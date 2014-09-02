# 跨域窗体消息机制

## 概述

由于同源策略的限制，非同域的窗体之间不能直接进行数据通讯或共享，因此我们引入这部分内容来分析解决非同域及同域的窗体之间的数据通讯或共享问题。

这里的消息通讯是指应用在客户端跨窗体之间的消息交互，可以保证在不会被恶意攻击的前提下进行跨窗体的数据共享方式，这里不会涉及到客户端与服务器端的信息交互。

关于这部分对应的W3C规范的详细介绍可参阅[HTML5 Web Message](http://www.w3.org/TR/webmessaging/)

## 实现分析

消息通讯主要包含两个过程：

* 收消息：文档通过监听当前窗体的onmessage事件来接收来自其他窗体的消息
* 发消息：文档可以通过给定的接口向指定的窗体发送消息，包括跨域的窗体

原理示意图如下所示

![web message原理](http://img1.ph.126.net/YJDCgyyYN9oEYj6M6nd4Wg==/6608228710167581530.png)

这里我们可以简单理解为各个窗体之间有一个消息通道，对于消息通道的关系我们定义为以下两种类型：

* 直接父子关系：消息通道所在的窗体为父子关系
* 兄弟及祖孙关系：消息通道所在的窗体为兄弟关系，或者父窗体和子窗体的若干层子窗体关系

对于全浏览器平台兼容的消息机制实现一般采用以下两种方式

* HTML5 Web Message
* window.name代理

## HTML5 Web Message

### 原理

对于高版本实现了符合W3C [HTML5 Web Message](http://www.w3.org/TR/webmessaging/) 规范的浏览器，我们可以直接使用该规范提供的API来实现跨域的窗体之间的消息通信

#### MessageEvent

MessageEvent定义

![message event](http://img2.ph.126.net/YAxyMByji3SBIkgz563_1g==/2209297092302616725.png)

data

* 消息内容，支持多种格式
* IE8-9只支持字符串

origin

* 消息来源，如http://a.b.com:8080
* 从安全角度出发在收到消息时务必做来源验证

source

* 消息来源的窗体
* 回复消息，如event.source.postMessage

ports

* 消息通道，见[Channel](#Channel)部分说明
* 发送消息，如event.ports[0].postMessage
* webkit(chrome)/presto(opera)/trident(IE10+)支持

#### 发消息

原理图示

![send message](http://img2.ph.126.net/EKXmXzABYnLfQATvn-GbQA==/1396397359562519963.png)

发送消息使用规范定义的window.postMessage接口，接口定义如下

|      | 类型 | 描述 |
| :--- | :--- | :--- |
| 输入 | Variable | 发送的数据，可以是基本类型，也可以是File、Blob等对象，注IE8-9支持传递字符串格式的数据 |
|      | String   | 目标可接收消息的源信息，如果目标的源不是该参数指定的源则忽略此消息，如果所有源均可接收消息则可以传“*”，如果只允许同域的窗体接收消息则可以传“/” |
|      | Array    | 可选，消息通道对象列表，主要用来代理非直接父子关系的窗体之间的消息通讯 |
| 输出 | Void     | 无 |

代码举例

```html
<iframe src="http://a.b.com:1144/frame-a.html" name="A"></iframe>
```

```javascript
// 向名称为A的iframe发送消息，消息内容为字符串 connect
window.frames.A.postMessage(
    'connect',
    'http://a.b.com:1144'
);
```

#### 收消息

接收消息使用规范定义的window.onmessage事件，接收到的事件对象见[MessageEvent](#MessageEvent)定义

代码举例

```javascript
// http://a.b.com:1144/frame-a.html可以通过window.onmessage事件来监听其他窗口发过来的消息
window.addEventListener(
    'message',function(event){
        // check origin
        if (!isAllowed(event.origin))
            return;
        // check data format
        if (!isFormatOK(event.data))
            return;
        // TODO something
        ...
        // reply to source
        event.source.postMessage('message',event.origin);
    },false
);
```

#### Channel

前面我们通过postMessage接口和onmessage事件实现了父子窗体之间的消息通讯，接下来我们需要完成兄弟关系的窗体之间的消息通讯

![message between sibling](http://img2.ph.126.net/-eHlgNW2xZrps3HETzHvjQ==/1414411758071900501.png)

这里如果window2要向window1发送消息，因为window2不能直接拿到window1的窗体对象，因此无法直接通过postMessage接口来向window1发送消息，一种折中的方式就是通过父窗体将消息做一次转发，window2先给消息parent，然后由parent将消息转交给window1，如下图所示

![message by parent proxy](http://img1.ph.126.net/Xjfu7BcqwtGbhkbbUDMFMA==/6619527291653512726.png)

但是这样我们会发现消息的路径比较长，因此效率比较低，W3C针对此类消息提供了MessageChannel机制来完成消息通讯

一个MessageChannel包含两个端口，每个端口可以独立的完成消息的收发功能

![message channel abstract](http://img2.ph.126.net/kv-J9xwXLKRUYweaUKkqDw==/2210985942163057055.png)

MessageChannel定义

![message channel](http://img2.ph.126.net/MV9A26usRaaTBOT7keKDVw==/4796333603250057446.png)

因此兄弟关系的窗体之间的消息通讯机制可抽象为如下图所示

![message between sibling](http://img2.ph.126.net/jjYkSurWb66RN3ALMVktOQ==/3017974700392032857.png)

下面通过代码例子来解析整个流程

假设一个页面有两个跨域的iframe窗体，需要实现通过MessageChannel从A窗体向B窗体发送消息的功能

```html
<iframe src="http://a.b.com:1144/frame-a.html" name="A"></iframe>
<iframe src="http://d.e.com:1122/frame-b.html" name="B"></iframe>
```

A窗体中，我们需要先构建一个MessageChannel，在当前窗体上保持port1端口，通过port1端口进行消息的收发功能，然后将port2端口传递给parent窗体，由parent窗体将port2端口转交给B窗体

```javascript
var channel = new MessageChannel();
channel.port1.onmessage = function(event){
    // check origin from frame-b.html
    if (event.origin!='http://d.e.com:1122')
        return;
    log('receive message from d.e.com and say: '+event.data);
    // reply message
    channel.port1.postMessage('hello B!',event.origin);
};
// build connect by parent
parent.postMessage('connect','http://c.d.com:1100',[channel.port2]);
```

parent窗体需要将A窗口传过来的端口转交给B窗体，因此在parent窗体上需要做以下转发功能

```javascript
window.addEventListener(
    'message',function(event){
        // from frame-a to build connect
        if (event.origin!='http://a.b.com:1144')
            return;
        // proxy port to frame-b
        if (event.ports.length>0){
            window.frames.B.postMessage(
                'connect',
                'http://d.e.com:1122',
                [event.ports[0]]
            );
        }
    },false
);
```

B窗体在接收到parent传过来的port2端口后，保持port2端口，通过port2端口完成跟A窗体的消息收发功能

```javascript
window.addEventListener(
    'message',function(event){
        // check build channel message from parent
        if (event.origin!='http://c.d.com:1100')
            return;
        // build channel
        if (event.ports.length>0){
            event.ports[0].onmessage = function(ev){
                // check message from frame-a.html
                if (ev.origin!='http://a.b.com:1144')
                    return;
                log('receive message from a.b.com and say: '+ev.data);
            };
            // send message to frame-a.html
            event.ports[0].postMessage('hello A!',ev.origin);
        }
    },false
);
```

至此A窗体和B窗体之间就建立了一条直接的MessageChannel，后续所有消息通过通过该消息通道直接进行通讯，而不需要通过parent做消息中转

## window.name代理

对于低版本浏览器主要针对Trident引擎的浏览器，如IE6-7版本，对于这类浏览器本身对Web Message规范的实现不完善，因此采用window.name作为代理来实现消息的传递。

### 原理

这里我们主要利用Trident引擎下跨域窗体可设置window.name的特性来实现消息的传递，具体实现原理示意图如下所示

![message by window.name](http://img1.ph.126.net/NM6uHYXVUEU06McBcIR8tw==/6608700400654849159.png)

假设上图Window1需要传递消息至Window2中，则消息的传递步骤如下：

1.  Window1的消息发送器按照指定协议拼装消息
2.  Window1的消息发送器将拼装好的消息字符串设置到Window2的window.name属性上
3.  Window2起定时器轮询window.name的变化情况
4.  Window2发现window.name中Window1设置的消息串，按照指定协议解码
5.  Window2触发window上的onmessage事件通知上层应用收到消息

反之亦然

### 协议

这里的协议主要指window.name上设置的消息串的格式

* 必须以字符串 MSG| 作为起始，且必须大写字符
* 参数以键值对方式传入，键与值之间用 = 连接，所有键值均做encodeURIComponent编码，键值对之间以 | 字符分隔，如 a=b|b=a%26b
* 将以上结果做escape后设置到目标window的name属性上，如MSG%7Cdata%3D%257B%2522url%2522%253A%2522http%253A%252F%252Fa.b.com

传递的参数信息主要包括

| 参数名称 | 参数描述 |
| :---     | :---     |
| origin   | 目标接收消息的源信息 |
| data     | 传递的消息数据，序列化为JSON字符串 |
| ref      | 当前窗体的访问地址 |
| self     | 当前窗体名称，默认为_parent |

### 缺陷

由于浏览器的限制本解决方案会存在以下一些问题

1.  可能会有消息丢失

    由于使用的是定时器轮询window.name的变化，而window.name为所有其他窗体共享的资源，但是其他窗体仅有设置权限而没有读取权限，因此无法保证window.name的消息在读取前被程序中其他代码覆盖，如果出现这种情况之前的消息无法到达当前窗体中。

2.  没能真正意义上保证origin的限制条件

    由于无法读取一个窗体的location信息，因此对origin的验证是在接收到消息后由框架额外做的封装，因此从真正意义上来说这个消息还是已经到达了当前窗体中，因此可能会存在信息的泄漏情况

综上所述，对于低版本浏览器建议尽量避免传递一些敏感信息，同时系统也尽量避免强依赖消息传递机制来实现系统的重要功能。

## NEJ封装

[NEJ](https://github.com/NetEaseWD/NEJ) Web前端开发框架根据以上原理对消息通讯这部分做了封装，为上层应用提供统一的API，主要实现模块为 util/ajax/message

### 发送消息

NEJ封装的发送消息接口为_$postMessage，接口说明如下

|      | 类型 |   描述 |
| :--- | :--- | :--- |
| 输入 | String/Window | 目标window对象或者Frame的name，或者字符串如\_top、\_parent、\_self |
|      | Object        | 消息配置信息 |
| 输出 | Void          | 无 |

消息配置信息包括

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| data   | Variable  | 消息内容 |
| origin | String    | 目标Origin，只有指定的页面可以收到消息，默认为所有源可接收，如http://a.b.com |
| source | String    | 当前窗体标识，除非你非常确定当前窗体的标识是什么，否则请采用自动识别 |

代码举例

```html
<!-- 注意需要通过source进行双向交互的frame节点必须设置id属性作为标识 -->
<iframe id="targetFrame" src="http://a.b.com/a.html"></iframe>
```

```javacript
NEJ.define([
    'util/ajax/message'
],function(_j){
    // top页面代码
    // 发送消息至 http://c.d.com 的页面
    _j._$postMessage('targetFrame',{
        data:'hello c.d.com',
        origin:'http://c.d.com'
    });

    // 发送消息至 http://a.b.com 的页面
    _j._$postMessage('targetFrame',{
        data:'hello a.b.com'
    });
});
```

### 接收消息

跟W3C规范一致，NEJ同样提供window.onmessage事件来接收消息，注这里的onmessage事件必须通过_$addEvent接口添加，接收到的消息格式遵循W3C中对于[MessageEvent](#MessageEvent)的规范

代码举例

```javacript
NEJ.define([
    'base/event'
    'util/ajax/message'
],function(_v,_j){
    // 添加消息监测事件
    _v._$addEvent(
        window,'message',function(_event){
            // 必须先验证消息来源_event.origin是否你允许的域
             if (!_isAllow(_event.origin))
                return;

            // 处理_event.data中的消息内容
            // TODO something

            // 回复消息，使用_event.source
            _j._$postMessage(_event.source,{
                data:'hello!',
                origin:_event.origin
            });
        }
    );
});
```

