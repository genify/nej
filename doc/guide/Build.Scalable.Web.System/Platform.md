# 构建高可伸缩性的WEB交互式系统(1) - 平台的可伸缩性

## 概述

可伸缩性是一种对软件系统处理能力的设计指标，高可伸缩性代表一种弹性，在系统扩展过程中，能够保证旺盛的生命力，通过很少的改动，就能实现整个系统处理能力的增长。

在系统设计的时候，充分地考虑系统的可伸缩性，一方面能够极大地减少日后的维护开销，并帮助决策者对于投资所能获得的回报进行更加精准的估计；另一方面，高可伸缩性的系统往往会具有更好的容灾能力，从而提供更好的用户体验。

WEB交互式系统的可伸缩性主要体现在两个方面：

* 平台的可伸缩性：随着WEB技术的发展，越来越多的平台开始使用WEB技术来构建系统，一方面不同的平台提供的环境支持存在着各种差异；另一方面随着平台的发展，不断的会有一些旧平台退出历史舞台，新平台转而成为主流平台；因此构建的WEB系统需要能够快速的响应此类变化就需要其具备良好的平台伸缩性
* 模块的可伸缩性：随着系统功能不断增删更新需求的变化，系统会变得越来越复杂，冗余信息会越来越多，改动的影响范围也可能会越来越大，因此良好的模块伸缩性可保证系统具有良好的可维护性，始终处于最佳状态

WEB交互式系统的主要应用包括：

* 桌面端/移动端网站类系统（如 [网易云课堂](http://study.163.com/)、[Lofter移动WEB版](http://www.lofter.com/)等）
* 移动混合应用（如 [网易云相册IPad版](http://photo.163.com/cloudphotos/)、[Lofter](http://www.lofter.com/app)等）
* 桌面混合应用（如 [网易云音乐PC版](http://music.163.com/#/download)、[网易闪电邮](http://flashmail.163.com/)等）

## 平台的可伸缩性

WEB交互式系统对平台的可伸缩性主要表现为：

* 可扩展性：对于新兴平台能够快速进行支持
* 可缩减性：对于过时的平台依赖信息能够以最小的修改剔除

首先我们先介绍一下WEB交互式系统的目标平台的情况

### 平台分类

根据系统所在容器的差异将平台分为浏览器平台和混合应用平台两大类，各分类的详细说明见下文所述

#### 浏览器平台

##### 按引擎划分

浏览器平台按照主流引擎可以划分为以下几类：

![按引擎划分平台](http://img0.ph.126.net/gmJEDK7pAdfE8nH4VQexkA==/6608273790144412074.png)

| 引擎 | 说明 |
| :--- | :--- |
| Trident | 由微软研发的排版引擎，代表浏览器有Internet Explorer |
| Webkit  | 由Apple、Google、Adobe等公司推动的开源的排版引擎，代表浏览器有Apple Safari、Google Chrome |
| Gecko   | 由Mozilla基金会支持的开源排版引擎，代表浏览器有Mozilla Firefox |
| Presto  | 由Opera Software研发的商用排版引擎，代表浏览器有Opera，由于Opera从15以后就开始采用新的Blink引擎，因此Presto也将逐步淡出我们的目标平台对象 |
| Blink   | 由Google和Opera Software基于Webkit引擎研发的排版引擎，代表浏览器有Chrome 28+、Opera 15+ |

##### 按功能划分

各引擎的浏览器版本根据对标准、规范的支持程度进行划分可分为以下几类：

![按功能划分平台](http://img1.ph.126.net/PELRvZvw_Gx7DTN3v7hUFQ==/6608921402492080696.png)

由于目前国内基于Trident的Internet Explorer浏览器还占有大量的市场份额，包括低版本的Internet Explorer浏览器，因此我们将浏览器分成三个等级

| 标准性 | 说明 |
| :--- | :--- |
| 差 | 主要针对低版本的Trident引擎（如IE6浏览器）平台，这部分平台对规范和标准的支持程度比较差，在适配时需要做大量额外的hack工作来实现相应的功能，因此如果产品的目标平台定位需要支持此平台则会有一定的性能损耗 |
| 中 | 主要针对中间版本的Trident引擎（如IE7-9浏览器）平台，这部分平台对规范和标准有一定的支持，但是也存在若干功能需要做额外的hack工作来实现 |
| 好 | 主要针对对规范、标准支持比较好的平台，按照标准实现的功能无需做额外的hack工作，因此如果产品的目标平台定位为此平台将取得比较好的用户体验和性能，如移动产品、混合应用等 |

#### 混合应用平台

根据混合应用的宿主平台的差异我们将混合应用的目标平台分为以下几类：

![混合平台划分](http://img1.ph.126.net/1VV98yGBpj3E2KPaa9M3jg==/6608853232771155778.png)

| 宿主     | 说明 |
| :---     | :--- |
| Android  | Android系统的混合应用，浏览器引擎会自动适配至Webkit |
| IOS      | IOS系统的混合应用，浏览器引擎会自动适配至Webkit |
| WinPhone | Windows Phone系统的混合应用，浏览器引擎会自动适配至Trident |
| PC       | 桌面应用，采用CEF做为容器，浏览器引擎会自动适配至Webkit |

### 平台适配

AOP(Aspect-Oriented Programming)：面向切面的编程范式，其核心思想是将横切关注点从主关注点中分离出来，因此特定领域的问题代码可以从标准业务逻辑中分离出来，从而使得主业务逻辑和领域性业务逻辑之间不会存在任何耦合性。

这里我们可以借鉴AOP思想来实现平台的适配策略，结合不同的平台实现逻辑，我们可以认为对于使用规范、标准来实现业务逻辑的部分为我们的主关注点，而不同平台可以做为若干的切面关注点进行封装，各平台只需关注自己平台下对标准的修正逻辑即可，因此可以通过增加删平台修正逻辑来实现对不同平台的适配。

实现时我们首先提取标准业务逻辑，然后各平台根据实际情况实现对业务逻辑的修正

![AOP策略](http://img2.ph.126.net/27YJvuHJvtvBFv4FoYX7QA==/6608822446445580374.png)

* 标准业务逻辑：主关注点，这里主要是使用根据W3C、ES标准来实现的业务逻辑
* 前置平台修正逻辑：领域特定关注点，主要是根据平台特性对标准在该平台下的修正，修正逻辑会先于标准逻辑执行
* 前置平台修正逻辑：同前置平台修正逻辑，也是领域特定关注点，修正逻辑会在标准逻辑执行后再执行

根据此思路我们对比以下两段代码：

代码一：目前常用的平台检查方式

```javascript
function doSomething(){
    if(isTrident){
        // TODO trident implement
    }else if(isWebkit){
        // TODO webkit implement
    }else if(isGecko){
        // TODO gecko implement
    }else if(isPresto){
        // TODO presto implement
    }else{
        // TODO w3c implement
    }
}

// 上层应用使用
doSomething(1,2,3);
```

此方式对所有平台的修正逻辑均在主逻辑中实现，存在以下弊端：

* 对平台特有的修正逻辑耦合在主逻辑中，平台特有的更新必然引起主逻辑的更新
* 对于新增或删除平台的支持必须修改到主业务逻辑
* 无法分离不必要的平台修正，比如基于webkit引擎的移动平台应用不需要其他平台的修正逻辑

代码二：借鉴AOP思想的平台适配方式

```javascript
function doSomething(){
    // TODO w3c/es implement
}

// 上层应用使用
doSomething(1,2,3);
```

针对Trident平台适配的逻辑，比如 trident.js中

```javascript
// trident implement
doSomething = doSomething._$aop(
    function(_event){
        // TODO trident implement
    },
    function(_event){
        // TODO trident implement
    }
);
```

对比代码一，我们可以发现借鉴AOP思想的接口适配方式分离了标准业务逻辑和平台特有业务逻辑，是否增加平台特有业务逻辑并不会影响主业务逻辑的执行，而对于平台修正逻辑的切入则可以直接通过配置的方式灵活的进行增删，因此我们可以从中得到以下好处：

* 主逻辑和平台特有逻辑无耦合性，可随意分离、整合
* 对于新增平台适配只需新加平台特有逻辑即可，而无需影响到主业务逻辑
* 可通过配置控制支持的目标平台，有选择性的导出平台特有业务逻辑

### 实现举例

[NEJ框架](https://github.com/NetEaseWD/NEJ)借鉴AOP思想提供了配置式的平台适配系统，对于这部分的详细信息可参阅NEJ的《[依赖管理系统](https://github.com/NetEaseWD/NEJ/blob/master/doc/DEPENDENCY.md)》和《[平台适配系统](https://github.com/NetEaseWD/NEJ/blob/master/doc/PLATFORM.md)》了解更为详细的信息，以下选取其中相关原理部分进行举例说明

#### platform

控件依赖补丁名称为“platform”，只用于文件依赖，使用“{platform}xxx.js”来表示控件依赖的补丁文件，会解析为依赖xxx.js和xxx.patch.js两个文件。xxx.js为W3C/ES规范实现方式，提供所有标准平台支持的公用部分，xxx.patch.js通过NEJ.patch接口提供不同平台对这些接口的特有实现逻辑

一个典型的适配控件结构如下图所示

![适配控件结构](http://img1.ph.126.net/shaaEm3oj13JZcdMF9iHTQ==/6608208918958379461.png)

这里的widget.js是控件业务逻辑实现文件，在此控件的实现中会依赖到存在平台差异的API，其依赖代码如下所示

```javascript
NEJ.define([
    'util/event',
    '{platform}api.js'
],function(t,h,p){

    // TODO

});
```

这里对 {platform}api.js 的处理方式如下图所示，这里的./相对于当前的代码文件即widget.js文件所在的目录

![platform](http://img2.ph.126.net/ygcxx2DAXf5YbpQ8No7SWg==/6608689405538619068.png)

这里的api.js文件为需平他适配API的标准实现逻辑，而api.patch.js文件则利用NEJ.patch接口对各平台做按需适配逻辑，同时打包时也根据NEJ.patch接口中对平台的条件识别做按需输出，由于api.patch.js文件最终会按需输出，因此在此文件中除了使用NEJ.patch做平台适配逻辑外不允许保护其它业务逻辑

#### NEJ.patch

NEJ框架中的平台按需适配采用NEJ.patch接口来实现，由于打包发布后NEJ.patch相关的接口会被分离出来不会发布上线，因此仅允许在patch文件中调用此接口，平台引擎标识说明如下

| 标识  | 说明 |
| :---  | :--- |
| T     | Trident引擎，如IE |
| W     | Webkit引擎，如chrome |
| G     | Gecko引擎，如firefox |

内置的Trident引擎版本对应的IE版本关系

| Trident版本 | IE版本 |
| :---  | :--- |
| 2.0 | 6 |
| 3.0 | 7 |
| 4.0 | 8 |
| 5.0 | 9 |
| 6.0 | 10 |
| 7.0 | 11 |

接口说明

|      | 类型 | 描述 |
| :--- | :--- | :--- |
| 输入 | String   |   必须，平台的判断条件，如2=<TR<4 |
|      | Array    | 可选，依赖文件列表，规则同define接口定义的文件路径 |
|      | Function | 可选，当前条件下需要执行的脚本 |
| 输出 | Void     | 无 |

```javascript

// 此文件只能定义NEJ.patch不可执行其他业务逻辑
// 打包输出时仅根据平台配置输出所需处理逻辑
// 实际情况看需求，可将平台相关部分逻辑独立到单独的模块中

NEJ.define([
    './hack.js'
],function(h){
    // 针对trident平台的处理逻辑
    NEJ.patch('TR',function(){
        // TODO
    });

    // 针对gecko平台的处理逻辑
    NEJ.patch('GR',[
        './hack.firefox.js'
    ],function(fh){
        // TODO
    });

    // 针对IE6平台的处理逻辑
    NEJ.patch('TR==2.0',['./hack.ie6.js']);

    // 针对IE7-IE9的处理逻辑
    NEJ.patch('3.0<=TR<=5.0',function(){
        // TODO
    });

    // 这里必须同hack.js文件的返回值一致
    return h;
});
```

#### 平台配置

平台参数在开发及打包过程中都会使用，框架支持平台参数的配置通过define.js路径上查询串中的p参数输入。

平台配置信息，此配置又分两类基本配置：补丁配置和混合配置，因为混合模式下使用的浏览器引擎固定，因此当配置中出现混合类型的配置时忽略补丁配置的值。

如果在引入依赖定义库时未指定平台信息则表示系统需对全平台浏览器支持。

##### 补丁配置

主要用来修正浏览器平台对接口及控件的支持，按照目前浏览器引擎划分，参数值由一个或者多个平台标识组成，标识支持如下所示：

| 标识  | 说明 |
| :---  | :--- |
| gk    | 以gecko为核心的浏览器平台，如firefox等 |
| wk    | 以webkit为核心的浏览器平台，如chrome、safari等 |
| td    | 以trident为核心的浏览器平台，如IE、360、maxthon等 |
| td-0  | 以trident为核心的浏览器平台，且引擎内核版本大于等于3.0，即IE>=7 |
| td-1  | 以trident为核心的浏览器平台，且引擎内核版本大于等于7.0，即IE>=10 |

```html
<script src="/path/to/nej/define.js?p=wk|gk|td"></script>
```

##### 混合配置

主要用于混合开发模式下对native接口的适配，按照native平台划分，参数值由一个标识组成，多个标识则以识别的第一个标识为准，标识支持如下所示：

| 标识 | 说明 |
| :--- | :--- |
| cef       | 基于cef框架混合应用，主要针对桌面应用 |
| ios       | ios平台混合应用，如iphone应用、ipod应用、ipad应用等 |
| win       | windows phone平台混合应用 |
| android   | android平台混合应用 |

```html
<script src="/path/to/nej/define.js?p=cef"></script>
```

### 平台变更

通过以上分析我们可以看到当平台发生变更时我们可以快速进行扩充或缩减

#### 平台扩展

当有新平台需要作为系统目标平台时，我们只需要做以下工作：

* 增加平台配置识别符，如nxw
* 识别该平台与标准存在的差异，增加平台特有业务逻辑至patch
* 系统对平台配置部分增加新添的识别符，如

    原平台适配
    ```html
    <script src="/path/to/nej/define.js?p=wk|gk|td"></script>
    ```
    新增平台适配
    ```html
    <script src="/path/to/nej/define.js?p=wk|gk|td|nxw"></script>
    ```

即可完成对平台的扩充，而不会影响到原有的业务逻辑

#### 平台缩减

当系统适配的目标平台由于种种原因逐步退出历史舞台时，我们的系统也需要将该平台的冗余代码从系统中剔除，我们只需要做以下工作：

* 系统对平台配置部分删除要剔除的平台标识，如

    原平台适配
    ```html
    <script src="/path/to/nej/define.js?p=wk|gk|td"></script>
    ```
    缩减后平台适配
    ```html
    <script src="/path/to/nej/define.js?p=wk"></script>
    ```

即可完成对平台的缩减，而无需修改任何业务逻辑


