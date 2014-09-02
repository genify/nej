# 前后端通讯系统

## 概述

随着富媒体应用的不断发展成熟，AJAX的应用得到越来越多的普及，而AJAX应用的一个核心功能-异步数据载入功能也就显得越为重要，包括HTML5的发展也为此提供了强大的支持。

对于富媒体WEB应用来说异步请求为其必不可缺的组成部分，对于同域的异步请求基本无需做太多额外配置，对于跨域的请求W3C也提供了相应的规范的支持，但是由于各浏览器对规范支持的程度的差异导致最终使用时会有一些差别，而NEJ框架针对这些差异及低版本的跨域支持做了封装，对上层应用而言可以使用统一的API做同域或非同域的异步请求。

## 代理模式

NEJ中主要通过客户端中间代理的方式实现异步请求，根据代理实现方式的差别主要提供以下几种模式的支持，具体应用可以根据实际情况选择使用的代理模式

* W3C的Cross-Origin Resource Sharing规范，后面简称CORS规范
* Frame代理
* Flash代理
* 文件上传代理

NEJ在所有平台均提供了以上三种模式的支持，由于各模式均有自己的一些缺陷，因此实际应用时请按照具体情况选择不同的模式


## CORS规范

CORS规范详细描述见W3C的《[Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/)》部分

### 原理

#### 术语

##### simple method

请求方式为以下几种之一，区分大小写

* GET
* HEAD
* POST

##### simple header

请求头信息只包含以下几种，不区分大小写

* Accept
* Accept-Language
* Content-Language

或者

* Content-Type

但是其值只能为以下几种之一，不区分大小写

* application/x-www-form-urlencoded
* multipart/form-data
* text/plain

##### simple response header

返回头信息包含以下几种，不区分大小写

* Cache-Control
* Content-Language
* Content-Type
* Expires
* Last-Modified
* Pragma

##### user credentials

指定安全相关信息传输方式，包括

* cookies
* HTTP authentication
* client-side SSL certificates

#### 控制字段

各字段构建阶段相见[流程](#流程)部分

##### 请求相关

* [Origin](http://www.w3.org/TR/cors/#origin-request-header)
* [Access-Control-Request-Method](http://www.w3.org/TR/cors/#access-control-request-method-request-header)
* [Access-Control-Request-Headers](http://www.w3.org/TR/cors/#access-control-request-headers-request-header)

##### 返回相关

* [Access-Control-Allow-Origin](http://www.w3.org/TR/cors/#access-control-allow-origin-response-header)
* [Access-Control-Allow-Methods](http://www.w3.org/TR/cors/#access-control-allow-methods-response-header)
* [Access-Control-Allow-Headers](http://www.w3.org/TR/cors/#access-control-allow-headers-response-header)
* [Access-Control-Allow-Credentials](http://www.w3.org/TR/cors/#access-control-allow-credentials-response-header)
* [Access-Control-Max-Age](http://www.w3.org/TR/cors/#access-control-max-age-response-header)
* [Access-Control-Expose-Headers](http://www.w3.org/TR/cors/#access-control-expose-headers-response-header)

#### 流程

##### 流程概况

![CORS请求](http://img0.ph.126.net/R6pynYIBRt0rv2CJvzjhhA==/6608753177213290299.png)

1.  浏览器捕获到a.b.com应用往x.y.com的服务器发起的请求
2.  浏览器检查请求情况确定是否需要先做一次预请求来验证x.y.com的服务器是否允许发当前请求过去，如果需要发预请求则浏览器发起一个OPTIONS的请求到x.y.com的服务器验证继续第3步，否则直接发送请求到x.y.com服务器继续第5步
3.  服务器根据浏览器发过来的header信息，然后根据服务器端对资源的配置返回资源的实际控制权限配置
4.  浏览器验证预请求返回的信息，判断是否可以将请求发送到x.y.com的服务器，如果不行则异常退出，否则继续第5步
5.  浏览器发送实际请求至x.y.com服务器
6.  服务器返回请求数据及资源控制配置信息至浏览器
7.  浏览器验证资源控制信息是否允许当前实际请求的取到数据，如果不允许则异常退出，否则继续第8步
8.  浏览器返回x.y.com返回的数据至a.b.com的应用

##### User Agent相关流程

###### check preflight request

![check preflight request](http://img2.ph.126.net/r-8_Drfm2tKxTGZEDK8_3Q==/2987012452953704123.png)

在没有预请求缓存的情况下，是否发送预请求主要取决于以下两个条件

* 请求方式是否[simple method](#simple method)
* 没有自定义头信息，或者自定义头信息符合[simple header](#simple header)

###### make preflight request

![make preflight request](http://img0.ph.126.net/9_h6lb6N37bvStq5Ze2MFw==/6619176547444246158.png)

这里主要完成以下信息的设置

* [Origin](http://www.w3.org/TR/cors/#origin-request-header)
* [Access-Control-Request-Method](http://www.w3.org/TR/cors/#access-control-request-method-request-header)
* [Access-Control-Request-Headers](http://www.w3.org/TR/cors/#access-control-request-headers-request-header)

###### cache preflight request

![cache preflight request](http://img2.ph.126.net/qxQ_SDJ1oBbWdjgea0r4bw==/4806466702411514477.png)

###### check preflight response

![check preflight response](http://img1.ph.126.net/5tqXaNkLoUQ_ny5yhWpX5w==/1612570141676339530.png)

这里需要注意：如果设置了[user credentials](#user credentials)，则返回的Access-Control-Allow-Origin必须与请求的Origin完全一致，包括大小写

##### Server相关流程

###### response preflight request

![response preflight request](http://img0.ph.126.net/STUHWTmsoH_h9V49H9BL-Q==/3301420001939732538.png)

这里主要完成以下信息的设置

* [Access-Control-Allow-Origin](http://www.w3.org/TR/cors/#access-control-allow-origin-response-header)
* [Access-Control-Allow-Credentials](http://www.w3.org/TR/cors/#access-control-allow-credentials-response-header)
* [Access-Control-Max-Age](http://www.w3.org/TR/cors/#access-control-max-age-response-header)
* [Access-Control-Allow-Methods](http://www.w3.org/TR/cors/#access-control-allow-methods-response-header)
* [Access-Control-Allow-Headers](http://www.w3.org/TR/cors/#access-control-allow-headers-response-header)

###### response actual request

![response actual request](http://img2.ph.126.net/3ho2hdTzTKERNY6BTXda5g==/6619581167723268848.png)

这里除了返回[response preflight request](#response preflight request)阶段返回的头信息外，还可以返回Access-Control-Expose-Headers用来控制客户端脚本中可获取的返回头信息

* [Access-Control-Expose-Headers](http://www.w3.org/TR/cors/#access-control-expose-headers-response-header)

### 缺陷

需要高版本浏览器支持，Trident引擎的浏览器需要IE10以上才支持

## Frame代理

此模式主要参照CORS规范原理，通过在目标服务器放置一个代理文件，然后通过该代理文件来与服务器端进行数据交互，返回数据通过消息通讯返回给上层应用来实现跨域的数据交互。

此方式也支持通过代理文件配置资源可访问的来源

### 原理

![Frame代理跨域流程](http://img2.ph.126.net/cPIDakXJZLhpnldZrZpZ7g==/6608721291376084913.png)

1.  当a.b.com的应用要往x.y.com的服务器取数据时，首先会用iframe载入预先放置在x.y.com服务器上的代理文件
2.  服务器端返回做了配置的代理文件
3.  代理文件载入完成后a.b.com的应用将要发送的请求指令通过消息通信方式传递给代理文件
4.  代理文件验证a.b.com是否在预先配置的白名单中，如果不在则异常返回，否则直接发送请求至x.y.com服务器
5.  服务器返回数据至代理文件
6.  代理文件通过消息通讯机制将请求结果返回给a.b.com的应用

### 缺陷

该模式主要有以下几个问题：

* 需要在目标服务器放置代理文件
* 由于首次发起请求时需要载入代理文件，在载入代理文件之前的所有请求都会存在一定的延时
* 对于低版本浏览器受限于消息通讯机制的限制，对于并发量大的请求返回时可能存在较大延时

## Flash代理

此模式与Frame代理模式类似，主要差别在于请求通过Flash来发送，因此可以利用Flash的策略文件crossdomain.xml来控制资源的共享权限

### 原理

![Flash代理跨域流程](http://img1.ph.126.net/HVFJFekgjG23O_z-Fq2yLA==/6608433219329605678.png)

1.  a.b.com的应用从自己的服务器上载入用来做请求的flash代理文件
2.  a.b.com服务器返回代理flash文件
3.  flash准备完毕后a.b.com应用将请求指令发送给flash
4.  flash从目标服务器x.y.com载入策略文件crossdomain.xml
5.  flash验证策略文件是否允许a.b.com访问x.y.com的资源，如果不允许则异常返回，否则发送请求至目标服务器
6.  x.y.com服务器返回数据至flash代理中
7.  flash代理将请求返回的数据提交到a.b.com的应用中

### 缺陷

该模式主要有以下几个问题：

* 需要浏览器支持flash
* 需要在目标服务器配置flash策略文件crossdomain.xml
* 由于首次发起请求时需要载入flash代理文件，在载入代理文件之前的所有请求都会存在一定的延时

## 文件上传

对于无刷新的系统来说，如果需要上传文件则必须也需要不刷新当前页面，对于高版本浏览器使用W3C中定义的XMLHttpRequest规范来实现，低版本则采用Frame代理的方式来实现

### 原理

#### XMLHttpRequest

对于高版本浏览器使用W3C规范中对XMLHttpRequest的定义来实现，相关接口定义

![uploader in XMLHttpRequest](http://img2.ph.126.net/prhGaXl0rn9g7CY3BK1p9A==/6599280884541303788.png)

XMLHttpRequest关于上传相关的数据发送流程

![send in XMLHttpRequest](http://img0.ph.126.net/KMsO751gC-M32-m3e6Qxlw==/6608621235817958265.png)

上传这里主要会采用Blob或FormData数据形式发送到服务器

#### Form+Frame代理

对于无法支持XMLHttpRequest直接进行文件上传的浏览器，采用Form表单+Frame代理的方式来实现

![form+frame upload](http://img1.ph.126.net/TLJiqwe6DY31CZIddXXYTQ==/6619487709234907039.png)

1.  a.b.com应用中包含要上传的文件的Form表单POST至目标服务器x.y.com，如果需要轮询进度的话此时开始起定时器轮询上传进度
2.  x.y.com将返回结果按照nej\_proxy\_upload.html模板文件给定的格式返回结果至Frame代理中
3.  Frame代理通过消息通讯机制将上传结果返回到a.b.com的应用中

### 缺陷

低版本返回的数据格式同高版本的不一致，因此服务器端需额外判断当前请求类别，然后根据类别返回数据内容

## NEJ封装

NEJ作为跨平台的WEB前端开发框架在跨域前后端通讯方面根据以上原理做了较好的封装，上层应用只需使用相应API即可

### 配置

#### 高版本CORS配置

##### 添加依赖

如果是maven工程，在pom.xml文件中加入依赖即可

```xml
<dependency>
    <groupId>com.netease.wd</groupId>
    <artifactId>cross-origin</artifactId>
    <version>0.0.2</version>
</dependency>
```

如果是非maven工程，将jar包加入到工程的classpath中即可，[下载jar包](http://mvn.hz.netease.com/artifactory/webapp/browserepo.html?pathId=libs-releases%3Acom%2Fnetease%2Fwd%2Fcross-origin%2F0.0.2%2Fcross-origin-0.0.2.jar)

##### 配置web.xml

在web.xml文件中引入cross-origin filter的配置，并添加需要的初始化参数

```xml
<filter>
    <filter-name>cross-origin</filter-name>
    <filter-class>com.netease.wd.crossorigin.filter.CrossOriginFilter</filter-class>
</filter>
```

配置参数说明

| 参数名称 | 参数说明 |
| :---     | :---     |
| allowOrigins | 允许访问资源的origin列表。必须是完整的域名，包含scheme, host和port(如果有的话),以,分隔，且区分大小写。 如：http://a.b.com, http://a.b.com:8080。作用于preflight请求以及后面的正式访问请求。访问的请求必须带有Origin header，并且内容要完全匹配列表中的某个值才允许访问后面的资源。如果对origin无限制，则该项可以配置成*。|
| allowMethods | 允许访问资源的method列表，以,分隔，区分大小写。如：GET, POST等。在preflight请求中，必须带有“Access-Control-Request-Method” header，并且值必须与列表中的某个值匹配，才能允许访问后续资源。如果对Method无限制，可以将该项配置成*。 |
| allowHeaders | 访问资源的请求所允许携带的header列表。Filter会检查与preflight请求的“Access-Control-Request-Headers” header，获取请求访问的header列表。Header列表所包含的header必须全部出现在allowHeaders列表中（不区分大小写），才允许访问后续资源。如果对header无限制，可将该项配置为*。 |
| supportCredentials | 是否支持credentials选项，可选值为：true或者false。如果为true，则在响应中加入“Access-Control-Allow-Credentials”为true的header。 |
| maxAge | 指定preflight request缓存的时间长度，单位为秒。配置后，会在响应中加入相应的“Access-Control-Max-Age” header和秒数。 |
| exposeHeaders | 允许expose的header列表，以,分隔。配置该项后，在正式访问请求的响应中会带上“Access-Control-Expose-Header” header。 |
| checkReferer | 是否检查referer header，可选值：true或false。该选项主要用于处理IE某些版本下，不支持CORS并且跨域请求不带Origin header的情况。打开该开关后，如果请求没有Origin header，则会比较Referer和Host来判断请求是否存在跨域。如果有跨域，则从Referer中提取出Origin域名，之后的流程则与前面描述的流程一致。 |

##### 配置url mapping

将需要做CORS处理的资源与filter进行关联即可

```xml
<filter-mapping>
    <filter-name>cross-origin</filter-name>
    <url-pattern>/path/to/resources</url-pattern>
</filter-mapping>
```

##### 使用范例

```xml
<filter>
    <filter-name>cross-origin</filter-name>
    <filter-class>com.netease.wd.crossorigin.filter.CrossOriginFilter</filter-class>
    <init-param>
        <param-name>allowOrigins</param-name>
        <param-value>http://a.b.com, http://a.b.com:8080</param-value>
    </init-param>
    <init-param>
        <param-name>allowMethods</param-name>
        <param-value>GET, POST, OPTIONS</param-value>
    </init-param>
    <init-param>
        <param-name>allowHeaders</param-name>
        <param-value>*</param-value>
    </init-param>
    <init-param>
        <param-name>supportCredentials</param-name>
        <param-value>true</param-value>
    </init-param>
    <init-param>
        <param-name>maxAge</param-name>
        <param-value>60</param-value>
    </init-param>
    <init-param>
        <param-name>exposeHeaders</param-name>
        <param-value>Set-Cookie, Max-Age</param-value>
    </init-param>
    <init-param>
        <param-name>checkReferer</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>cross-origin</filter-name>
    <url-pattern>/path/to/resources</url-pattern>
</filter-mapping>
```

##### 上传返回结果兼容

在上面文件上传部分我们分析发现对于使用不同的上传策略，API需根据策略返回不同的结果，为了减少此方式对应用层的影响，在jar包中提供了统一的方法供使用，主要封装了

* 对于支持CORS的浏览器，服务器只需要返回json字符串
* 对于不支持CORS的浏览器，服务器需要返回特定格式的html页面内容

使用范例

```java
public void doGet(HttpServletRequest request, HttpServletResponse response) {
    // 返回结果序列化为JSON字符串
    String content = "{msg: \"'hello'\"}";
    try {
        // 调用工具方法按具体策略返回结果
        CORSResponseUtil.response(request, response, content);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

#### 低版本代理文件配置

##### 代理文件配置

在服务器放置NEJ代理文件，NEJ代理文件可从[这里](https://github.com/genify/nej/tree/master/res)获取，如果代理文件在服务器的/res/下可直接访问，则代码中无需配置，否则在载入NEJ define.js文件之前做好代理配置

```html
<script>
    window.NEJ_CONF = {
        // 多个域名在这里配置
        p_frame:['http://a.b.com/path/to/nej_proxy_frame.html']
    };
</script>
<script src="/path/to/nej/define.js"></script>
```

##### 白名单配置

数据提供方可以通过修改nej\_proxy\_frame.html中的白名单来控制允许调用接口的第三方域名，这里主要以正则表达式方式配置whitelist即可

```html
<script>window.whitelist=[/.*/i];</script>
```

### _$request

\_#request接口在util/ajax/xdr模块中实现

|      | 类型 | 描述 |
| :--  | :--  | :-- |
| 输入 | String | 请求地址 |
|      | Object | 配置信息 |
| 输出 | String | 请求标识 |

配置参数说明

| 参数 | 类型 | 说明 |
| :--  | :--  | :-- |
| sync    | Boolean  |  是否同步请求 |
| type    | String   |  返回数据格式,text/json/xml |
| data    | Variable |  要发送的数据 |
| query   | Variable |  查询参数,字符串格式a=b&c=d,对象格式{a:'b',c:'d'} |
| method  | String   |  请求方式,GET/POST |
| timeout | Number   |  超时时间,0 禁止超时监测 |
| headers | Object   |  头信息表 |
| cookie  | Boolean  |  跨域请求是否带cookie，仅对CORS方式有效 |
| mode    | Number   |  请求模式,针对跨域请求采用的请求方式 |
| result  | Object   |  onload回调输入时需包含的额外信息，已处理额外数据，headers - 服务器返回头信息，如{headers:'x-res-0'}或者{headers:['x-res-0','x-res-1']} |
| onload  | Function |  数据载入回调 |
| onerror | Function |  请求异常回调 |
| onbeforerequest | Function  | 请求之前回调 |

请求模式配置说明

* 0 - 自动模式，高版本使用HTML5的CORS协议，低版本采用Frame代理方式
* 1 - 高版本使用HTML5的CORS协议，低版本采用Flash代理方式
* 2 - 全部使用Frame代理方式
* 3 - 全部使用Flash代理方式

代码举例

```javascript
NEJ.define([
    'util/ajax/xdr'
],function(_j){
    // 从a.b.com载入数据
    _j._$request(
        'http://a.b.com/api/get',{
            type:'json',
            onload:function(_result){
                // TODO
            },
            onerror:function(_error){
                // TODO
            }
        }
    );
});
```

### _$upload

\_$upload接口在util/ajax/xdr模块中实现

|      | 类型 | 描述 |
| :--  | :--  | :-- |
| 输入 | HTMLFormElement | 表单对象，待上传的文件及目标地址信息封装在此对象中 |
|      | Object | 配置信息 |
| 输出 | String | 请求标识 |

配置参数说明

| 参数 | 类型 | 说明 |
| :--  | :--  | :-- |
| type    | String   |  返回数据格式
| query   | Variable |  查询参数
| mode    | Number   |  跨域类型，0/2，见[_$request](#_$request)接口说明
| headers | Object   |  头信息
| cookie  | Boolean  |  跨域请求是否带cookie，仅对CORS方式有效
| onload  | Function |  数据载入回调
| onerror | Function |  请求异常回调
| onuploading | Function |  上传进度回调
| onbeforerequest | Function |  请求之前回调

代码举例

```html
<form id="upload" name="upload" action="http://123.163.com:3000/xhr/uploadCallback">
   <input type="text" id="progress" />
   <!-- 低版本轮询进度接口 -->
   <input type="hidden" name="nej_mode" value="2" />
   <input type="hidden" name="nej_query" value="http://123.163.com:3000/xhr/progress" />
</form>
```

```javascript
NEJ.define([
    'util/ajax/xdr'
],function(_j){
    _j._$upload('upload',{
        mode:2,
        cookie:true,
        onuploading:function(_data){
            // 后台处理http://123.163.com:3000/xhr/progress，返回一个json对象
            // 前台会去轮询此接口获取进度
            if(!!_data.total&&_data.progress){
                _progress.value = _data.progress;
            }
        },
        onload:function(_url){
            // 此前会把进度轮询终止掉。如果要显示进度100%，可在此设置一次
            // 后台处理http://123.163.com:3000/xhr/uploadCallback，返回url
            // 文件上传完成的回调,url为返回的地址
        }
    });
});
```
