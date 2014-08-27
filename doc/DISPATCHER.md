# 模块调度系统

## 概述

随着WEB技术的发展，使用WEB技术构建富应用的场景越来越多，相比于纯Native技术，利用WEB技术构建富应用有其先天优势，如良好的跨平台特性、高效的构建及需求响应效率、更低的资源成本投入等，随着移动互联网的快速崛起、硬件设备的不断升级换代，WEB构建的应用体验将会越来越接近于纯Native的体验

使用WEB技术构建单页富应用在混合应用技术中使用的越来越多，此类应用复杂度要高于一般网站类型的WEB系统，采用模块化技术可用来将复杂系统拆分为若干简单子系统，同时所有子系统又需兼具低耦合，高可重组性，实际案例如：

* 移动混合应用（如 [网易云相册IPad版](http://photo.163.com/cloudphotos/)、[Lofter](http://www.lofter.com/app)等）
* 桌面混合应用（如 [网易云音乐PC版](http://music.163.com/#/download)、[网易闪电邮](http://flashmail.163.com/)等）

NEJ提供了一套模块调度系统 用于支持单页富应用的系统架构、模块拆分和重组、模块调度管理 等功能

## 模块

这里我们定义的模块是指从系统中拆分出来的可与用户进行交互完成一部分完整功能的独立单元

### 模块组成

因为这里描述的模块可独立与用户完成交互功能，因此模块会包含以下元素

* 样式：定义模块的效果
* 结构：定义模块的结构
* 逻辑：实现模块的功能

以上元素对于一个WEB系统开发者来说并不陌生，而我们只需要寻求一种形式将这些内容封装起来即可

### 模块封装

从模块的组成我们可以看到从系统中分离出来的模块可能会长成这个样子，比如module.html就是我们分离出来的一个模块，当然这里也可以用脚本文件封装，样式和结构采用注入形式，我们这里以html文件封装举例

```html
<!-- 模块样式 -->
<style>
    .m-mdl-1 .a{color:#aaa;}
    .m-mdl-1 .b{color:#bbb;}

    /* 此处省略若干内容 */
</style>

<!-- 模块结构 -->
<div class="m-mdl-1">
  <p class="a">aaaaaaaaaaaaaaaaaaa</p>
  <p class="b">bbbbbbbbbbbbbbbbbbb</p>

  <!-- 此处省略若干内容 -->
</div>

<!-- 模块逻辑 -->
<script>
    (function(){
        var a = 'aaa';
        var b = 'bbb';

        // 此处省略若干内容
    })();
</script>
```

而这个模块在用户需要时加载到客户端，并展现出来跟用户进行交互，完成功能；但是我们会发现如果系统预加载了此模块或者模块在parse时这些内容会被直接执行，而这个结果并不是我们需要的，因此我们需要将模块的各元素文本化处理，文本化处理有多种方式，如作为文本script、textarea等标签内容，因此module.html里的模块我们可以封装成如下样子，以textarea举例：

```html
<!-- 模块样式 -->
<textarea name="css">
    .m-mdl-1 .a{color:#aaa;}
    .m-mdl-1 .b{color:#bbb;}

    /* 此处省略若干内容 */
</textarea>

<!-- 模块结构 -->
<textarea name="html">
    <div class="m-mdl-1">
      <p class="a">aaaaaaaaaaaaaaaaaaa</p>
      <p class="b">bbbbbbbbbbbbbbbbbbb</p>

      <!-- 此处省略若干内容 -->
    </div>
</textarea>

<!-- 模块逻辑 -->
<textarea name="js">
    (function(){
        var a = 'aaa';
        var b = 'bbb';

        // 此处省略若干内容
    })();
</textarea>
```

## 管理依赖

从系统中拆分出来的模块之间是存在有一定关系的，如一个模块的呈现必须依赖另外一个模块的呈现，下面我们会以一个简单的例子来讲解模块之间的依赖管理，如下图是我们的一个单页富应用

![单页富应用范例](http://nej.netease.com/images/sample.gif)

从上图不难看出整个系统包含以下几部分内容：

* 日志管理

  * 日志：日志列表，可切换收件箱/草稿箱/回收站/标签
  * 标签：标签列表，可转至日志按标签查看列表

* 博客设置

  * 账号管理

    * 基本资料：用户基本资料设置表单
    * 个人经历：个人经历填写表单

  * 权限设置：权限设置表单

而这些模块之间的层级关系则如下所示

![模块层级结构图](http://img0.ph.126.net/7ixXaTU-uFtbe0pKCWCgPA==/6597270977286264717.png)

针对交互式系统的这种层级架构典型的模式可以参阅[PAC（Presentation－Abstraction－Control）模式](http://en.wikipedia.org/wiki/Presentation%E2%80%93abstraction%E2%80%93control) 或者 [HMVC（Hierarchical model–view–controller）模式](http://en.wikipedia.org/wiki/Hierarchical_model%E2%80%93view%E2%80%93controller)

然而在WEB交互式系统的实践过程中我们发现这种模式会存在一些缺陷：

* 由于每个父模块自己维护了所有的子模块，因此父子模块之间耦合性过强，父模块必须耦合所有子模块
* 由于模块之间不能越级调用，因此子模块需要其他模块协助时必须层层向上传递事件，如果层级过深则会影响到系统效率
* 模块的增删等变化导致的变更涉及的影响较大，删除中间节点上的模块可能导致相邻的若干模块的变更
* 多人协作开发系统时存在依赖关系的模块会导致开发人员之间的紧密耦合

在这里我们给出了一种基于模块标识的依赖管理配置方案，可以彻底的将模块进行解耦，每个模块可以独立完整的完成自己的交互功能，而系统的整合则可以通过配置的方式灵活的重组各模块，模块的增删操作只需修改配置即可完成，而无需影响到具体业务逻辑

下文我们会通过以上例子来讲解此方案的原理和实际操作方式

### 模块标识

因为本方案会基于模块标识做配置，因此在介绍方案之前我们先介绍一下模块标识，这里我们给模块标识取名为**UMI**（Uniform Module Identifier）统一模块标识，下文简称UMI，遵循以下规则约定

* 格式同URI的Path部分，如 /m/m0/
* 必须以“/”符开始
* 私有模块必须以“/?”开始
* 承载模块的依赖关系，如 /m/m0/ 和 /m/m1/ 表明这两个标识对应模块的父模块标识均为 /m

每个UMI均可唯一标识一个模块及模块在系统中的依赖关系，在模块章节我们介绍了一个模块可以用一个html进行封装，因此我们可以得到以下结果

![UMI与模块地址映射关系图](http://img0.ph.126.net/DCSPjxzVgjlgc8B983YSSg==/2673167853921558567.png)

每个UMI均可映射到一个模块实现文件，这样我们就可以将模块从具体实现中解耦出来，对模块的增删修改操作只需调整UMI和模块文件的映射关系即可，而无需涉及具体业务逻辑的修改

### 模块依赖

在解决了模块与实现分离的问题后，我们接下来需要将层级式的模块扁平化来解耦模块之间的依赖关系

回到前面的例子，模块之间的层级关系如下图所示

![模块层级关系图](http://img1.ph.126.net/NFbfUjokCb1KsI8tCj04xw==/6608203421400487879.jpg)

如果我们将图中的依赖关系进行抽象分离后可以发现所有的模块即可呈现扁平的状态

![模块关系分离图](http://img1.ph.126.net/XByNuSHTyJ_OzmAFIcqGKQ==/6608480498329578217.png)

而对于模块之前的依赖关系的管理在所有系统中都是一致的，但是每个模块的具体功能实现是由系统来决定的，不同的系统是截然不同的，因此本方案提供的解决方案主要是用来维护模块之间的依赖关系的

从上图我们可以比较清楚的看到模块之间的依赖关系呈现树状结构，因此我们会以树的结构来组织维护模块之间的依赖关系，我们称之为依赖关系树，而当我们将这棵树上的任意节点与根节点之间的路径用“/”分隔序列化后发现刚好与我们提供的UMI是匹配的，因此组成系统的模块的UMI可以跟依赖关系树的节点一一对应起来，如下图所示

![依赖关系树节点序列化成UMI](http://img2.ph.126.net/cu36voh3bRXFx530aW6nkg==/6608921402492317376.png)

在模块标识章节我们介绍了UMI与模块封装文件可以相互映射，因此依赖关系树上的节点可以直接与模块的实现文件做一一对应，如下图所示

![依赖关系树映射模块实现文件](http://img1.ph.126.net/6Pfkz1_4dd32jnL60QQ1Kw==/6608598146073751639.png)

至此，我们将垂直层级依赖的模块通过依赖关系树分解成了无任何关系的扁平模块结构

### 模块组合

模块只需要有个呈现容器即可渲染出来，因此模块如果需要能够做任意组合，只需将模块分成两种类型：提供容器的模块和使用容器的模块即可，当然一个模块可同时兼具提供容器和使用容器的功能，提供容器的模块和使用容器的模块可任意组合

![模块组合](http://img2.ph.126.net/D446SK2cBk_aGZFLVRwIew==/3669307796500606643.png)

对于模块组合的配置代码范例

```javascript
'/m/blog/list/':{
    module:'module/layout/blog.list/index.html',
    composite:{
        box:'/?/blog/box/',
        tag:'/?/blog/tag/',
        list:'/?/blog/list/',
        clazz:'/?/blog/class/'
    }
}
```

## 调度策略

在将模块扁平化后，各模块就可以安排给不同的开发人员进行功能实现和测试了，各模块完成后根据依赖关系树进行系统整合，完成系统整合后各模块会遵循一定的调度策略进行调度

### 模块状态

根据模块调度的阶段划分，模块的状态可以分为以下四个阶段：

* 模块构建：构建模块结构
* 模块显示：将模块渲染到指定的容器中
* 模块刷新：根据外界输入的参数信息获取数据并展示（这里主要做数据处理）
* 模块隐藏：模块放至内存中，回收由刷新阶段产生的额外结构

调度策略主要控制模块在这几个阶段之间的转换规则

### 模块显示

当用户请求显示一个模块时各模块会遵循以下步骤进行调度，假设请求显示 /m/blog/list/ 模块

![显示调度策略](http://img1.ph.126.net/ip4S9-mTCAH943VGwXZ1OQ==/6619563575537201227.png)

1. 检查目标节点到根节点路径上注册的模块，如果注册的是模块的实现文件地址，则请求载入模块实现文件
2. 如果节点所在的模块的所有祖先节点已显示，则当前模块可被显示出来，否则等待祖先模块的显示调度
3. 模块载入后根据第二步骤原则尝试调度目标模块的显示

### 模块切换

当用户从一个模块切换到另外一个模块时各模块遵循以下步骤调度，假设从 /m/blog/list/ 切换到 /m/setting/account/edu/ 模块

![模块切换](http://img0.ph.126.net/ca9IdYk2ezLL-zN8vRqI4Q==/6619574570653479153.png)

1. 查找源模块与目标模块的公共父节点

   ![查找公共模块](http://img2.ph.126.net/G36CYcFsck1w8Uf0k7oOIw==/6608672912864439374.png)

2. 从源节点到公共节点之间的模块调度隐藏操作

   ![隐藏模块](http://img0.ph.126.net/kCydlPd-q7yUIQ2rc65Eyg==/6608818048399307052.png)

3. 从根节点到公共节点之间的模块调度刷新操作

   ![刷新模块](http://img2.ph.126.net/sN7NPW5etJ0FVjv-TyBL9w==/6608677310910950450.png)

4. 从公共节点到目标节点之间的模块调度显示操作

   ![显示模块](http://img1.ph.126.net/DwnLyinZy9ZG8IX_uwOmsg==/6599306173308730570.png)

## 消息通道

大部分时候我们不需要模块之前的消息通信，实践中也存在一些特殊情况会需要模块之前的消息通信，这里提供两种方式的消息通讯

* 点对点的消息：一个模块发送消息时明确指定目标模块的UMI
* 观察订阅消息：一个模块可以对外申明发布了什么样的消息，有需要的模块可以订阅该模块UMI上的消息

## 实例解析

这部分我们用上面的具体实例讲解如何使用NEJ的模块调度系统来拆分一个复杂系统、开发测试模块、整合系统

### 系统分解

#### 绘制层级关系图

当我们拿到一个复杂系统时根据交互稿可以绘制出组成系统的模块的层级关系图，并确定系统对外可访问的模块

![模块层级关系图](http://img1.ph.126.net/UmNMLNzb-Vjdtv8skT8kqg==/6608742182096989774.png)

#### 抽象依赖关系树

从模块的层级关系图中我们可以非常方便的抽象出模块的依赖关系树

![抽象依赖关系树](http://img1.ph.126.net/BK5_LhDhh01addpDJuY4Yw==/6619331578583739475.png)

将抽象出来的依赖关系树根据UMI规则进行格式化，格式化的主要操作包括

* 增加一个名称为“/”的根结点（也可将“m”结点改为“/”）
* 每个结点增加“/”的子节点作为默认节点

![格式化依赖关系树](http://img2.ph.126.net/5b3ByaubY0XFOlnU1PZHAw==/6619382156118617138.png)

至此输出的依赖关系树，具有以下特性：

* 任何一个结点（除根结点外）到根结点路径上的结点名称用“/”分隔组合起来即为结点的UMI值，如list结点的UMI值为/m/blog/list
* 任何结点上的模块都依赖于他祖先结点（注册有模块）上的模块存在，如blog结点和list结点均注册有模块，则list结点上的模块显示必须以blog结点上的模块的显示为先决条件

#### 确定对外模块注册节点

五个对外可访问的模块：日志、标签、基本资料、个人经历、权限设置，在依赖关系树中找到合适的结点（叶子结点，层级关系树在依赖关系树中对应的结点或“/”结点）来注册对外可访问的模块

![对外模块注册节点](http://img0.ph.126.net/vC28JzPSddgzZdpEAeBZ2w==/6619485510211628655.png)

#### 确定布局模块注册节点

从可访问模块注册的结点往根结点遍历，凡碰到两模块交叉的结点即为布局模块注册结点，系统所需的组件相关的模块可注册到根结点，这样任何模块使用的时候都可以保证这些组件已经被载入

![布局模块注册节点](http://img1.ph.126.net/Jjp0GCDfh2eXvaxJvhiCeQ==/6619215030351195733.png)

#### 映射模块功能

原则：结点的公共父结点实现结点上注册的模块的公共功能

举例：blog结点和setting结点的公共父结点为m结点，则我们可以通过切换blog模块和setting模块识别不变的功能即为m模块实现的功能，同理其他模块

![功能映射](http://img2.ph.126.net/64xhHIfGy4qdQKSV5Bym-g==/2679360303409193237.png)

#### 分解复杂模块

进一步分解复杂模块，一般需要分解的模块包括：

* 可共用模块，比如日志列表，可以在日志管理页面呈现，也可以在弹层中显示
* 逻辑上无必然联系的模块，如日志模块中日志列表与右侧的按标签查看的标签列表之间没有必然的联系，任何一个模块的移除或添加都不会影响到另外一个模块的业务逻辑

![分解复杂模块](http://img1.ph.126.net/wRM1uAxQDRFhfAzlNw8b5Q==/6599274287471525959.png)

至此我们可以得到两棵系统分解后的依赖关系树

对外模块依赖关系树

![对外模块依赖关系树](http://img2.ph.126.net/6yAKfH-sST3-RGc0xIxU2g==/6608788361585356880.png)

私有模块依赖关系树

![私有模块依赖关系树](http://img1.ph.126.net/KgimU46Zn4ZnUtxiBrXdKw==/6608191326772584502.png)

#### 绘制模块功能规范表

本例中为了说明分解过程将所有可分解的模块都做了分解，实际项目看具体情况，比如这里的/m模块组合的/?/tab/模块的功能可以直接在/m模块中实现，而不需要新建一个/?/tab/模块来实现这个功能

规范表范例如下所示

![功能规范表](http://img1.ph.126.net/e_0ZFwbefuXT5bZ6bq17Rg==/1496320976294650210.png)

### 构建目录

#### 项目目录

项目目录的构建如下图所示

![项目目录](http://img0.ph.126.net/7mfjeInfGILw-tWQznxxLA==/6608777366469080397.png)

各目录说明

```
webroot                    项目前端开发相关目录
   |- res                  静态资源文件目录，打包时可配置使用到该目录下的静态资源带版本信息
   |- src                  前端源码目录，最终发布时该目录不会部署到线上
       |- html
            |- module      单页面模块目录，系统所有模块的实现均在此目录下
            |- app.html    单页面入口文件
```

#### 模块单元目录

根据模块封装规则一个模块单元由以下几部分组成：

* 模块测试：模块实现的功能可以通过模块测试页面独立进行测试
* 模块结构：模块所涉及的结构分解出来的若干模板集合
* 模块逻辑：根据模块规范实现的模块业务逻辑，从模块基类继承
* 模块样式：模块特有的样式，一般情况下这部分样式可以直接在css目录下实现

结构范例如下所示

![模块单元目录](http://img0.ph.126.net/o6dTV8RpqAtS63zxdz8sEg==/6608917004445806742.png)

至此我们可以得到所有模块的目录结构如下所示

![模块目录结构](http://img0.ph.126.net/2cMlaKsMBzOfAPPdH9IzkA==/6608797157678379135.png)

### 模块实现

#### 结构

这里我们假设系统的静态页面已经做完，这里的模块实现只是在原有结构的基础上进行结构分解和业务逻辑的实现，结构部分内容主要将模块相关的静态结构拆分成若干NEJ的模板，注意：

* 模板中的外联资源如css，js文件地址如果使用的是相对路径则均相对于模块的html文件路径
* 模板集合中的外联资源必须使用@TEMPLATE标记标识，这个在后面打包发布章节会详细介绍

NEJ模板说明

![NEJ模板](http://img2.ph.126.net/W_RhwYyx4kbPPGMpcVoUwQ==/6608414527633039667.png)

模块结构举例

```html
<meta charset="utf-8"/>

<textarea name="txt" id="m-ifrm-module">
  <div class="n-login">
    <div class="iner j-flag">
      <span class="cls j-flag">×</span>
      <span class="min j-flag">－</span>
    </div>
    <div class="cnt j-cnt"></div>
  </div>
</textarea>

<!-- @TEMPLATE -->
<textarea name="js" data-src="./index.css"></textarea>
<textarea name="js" data-src="./index.js"></textarea>
<!-- /@TEMPLATE -->
```

#### 逻辑

依赖util/dispatcher/module模块，从_$$ModuleAbstract扩展一个项目的模块基类，完成项目中模块特有属性、行为的抽象

```javascript
/*
 * ------------------------------------------
 * 项目模块基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'util/dispatcher/module'
],function(_k,_t,_p){
    // variable declaration
    var _pro;
    /**
     * 项目模块基类对象
     * @class   {_$$Module}
     * @extends {_$$ModuleAbstract}
     * @param   {Object}  可选配置参数，已处理参数列表如下所示
     */
    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t._$$ModuleAbstract);
    /**
     * 操作
     * @param  {Object}
     * @return {Void}
     */
    _pro.__doSomething = function(_args){
        // TODO
    };

    // TODO

    return _p;
});
```

根据模块状态的划分，我们在实现一个模块时需要实现以下几个接口

![模块各阶段接口](http://img0.ph.126.net/8XyKVwG3dzG0dK59qteZFw==/6619467918025585071.png)

各阶段对应的接口：

* 构建 - \_\_doBuild：构建模块结构，缓存模块需要使用的节点，初始化组合控件的配置参数
* 显示 - \_\_onShow：将模块放置到指定的容器中，分配组合控件，添加相关事件，执行\_\_onRefresh的业务逻辑
* 刷新 - \_\_onRefresh：根据外界输入的参数信息获取数据并展示（这里主要做数据处理）
* 隐藏 - \_\_onHide：模块放至内存中，回收在\_\_onShow中分配的组合控件和添加的事件，回收\_\_onRefresh中产生的视图（这里尽量保证执行完成后恢复到\_\_doBuild后的状态）

具体模块实现举例

```javascript
/*
 * ------------------------------------------
 * 项目模块实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/klass',
    'util/dispatcher/module',
    '/path/to/project/module.js'
],function(_k,_e,_t,_p){
    // variable declaration
    var _pro;
    /**
     * 项目模块对象
     * @class   {_$$ModuleDemo}
     * @extends {_$$Module}
     * @param   {Object} 可选配置参数
     */
    _p._$$ModuleDemo = _k._$klass();
    _pro = _p._$$ModuleDemo._$extend(_t._$$Module);
    /**
     * 构建模块，主要处理以下业务逻辑
     * - 构建模块结构
     * - 缓存后续需要使用的节点
     * - 初始化需要使用的组件的配置信息
     * @return {Void}
     */
    _pro.__doBuild = function(){
        this.__super();
        // TODO
    };
    /**
     * 显示模块，主要处理以下业务逻辑
     * - 添加事件
     * - 分配组件
     * - 处理输入信息
     * @param  {Object} 输入参数
     * @return {Void}
     */
    _pro.__onShow = function(_options){
        this.__super(_options);
        // TODO
    };
    /**
     * 刷新模块，主要处理以下业务逻辑
     * - 分配组件，分配之前需验证
     * - 处理输入信息
     * - 同步状态
     * - 载入数据
     * @return {Void}
     */
    _pro.__onRefresh = function(_options){
        this.__super(_options);
        // TODO
    };
    /**
     * 隐藏模块，主要处理以下业务逻辑
     * - 回收事件
     * - 回收组件
     * - 尽量保证恢复到构建时的状态
     * @return {Void}
     */
    _pro.__onHide = function(){
        this.__super();
        // TODO
    };
    // notify dispatcher
    _e._$regist(
        'umi_or_alias',
        _p._$$ModuleDemo
    );

    return _p;
});
```
#### 消息

##### 点对点消息

模块可以通过\_\_doSendMessage接口向指定UMI的模块发送消息，也可以通过实现\_\_onMessage接口来接收其他模块发给他的消息

发送消息

```javascript
_pro.__doSomething = function(){

    // TODO

    this.__doSendMessage(
        '/m/setting/account/',{
            a:'aaaaaa',
            b:'bbbbbbbbb'
        }
    );
};
```

接收消息

```javascript
_pro.__onMessage = function(_event){
    // _event.from 消息来源
    // _event.data 消息数据，这里可能是 {a:'aaaaaa',b:'bbbbbbbbb'}

    // TODO
};
```

##### 发布订阅消息

发布消息

```javascript
_pro.__doSomething = function(){

    // TODO

    this.__doPublishMessage(
        'onok',{
            a:'aaaaaa',
            b:'bbbbbbbb'
        }
    );
};
```

订阅消息

```javascript
_pro.__doBuild = function(){

    // TODO

    this.__doSubscribeMessage(
        '/m/message/account/','onok',
        this.__onMessageReceive._$bind(this)
    );
};
```

#### 自测

创建html页面，使用模板引入模块实现文件

```html
<!-- template box -->
<div id="template-box" style="display:none;">
  <textarea name="html" data-src="../index.html"></textarea>
</div>
```

模块放至document.mbody指定的容器中

```javascript
NEJ.define([
    'util/dispatcher/test'
],function(_e){
    document.mbody = 'module-id-0';
    // test module
    _e._$testByTemplate('template-box');
});
```

### 系统整合

#### 映射依赖关系树

系统整合时，我们只需要将依赖关系树中需要注册模块的节点同模块实现文件进行映射即可

对外模块整合

![对外模块整合](http://img2.ph.126.net/CQe6y5Bdgkl4bA5VsSIwzA==/6608893914701623469.png)

私有模块整合

![私有模块整合](http://img0.ph.126.net/upKrOu1fEmK_Q6x2jc-ibA==/6619430534630239416.png)

#### 提取系统配置信息

规则配置举例

```javascript
  rules:{
      rewrite:{
          '404':'/m/blog/list/',
          '/m/blog/list/':'/m/blog/',
          '/m/setting/account/':'/m/setting/'
      },
      title:{
          '/m/blog/tag/':'日志标签',
          '/m/blog/list/':'日志列表',
          '/m/setting/permission/':'权限管理',
          '/m/setting/account/':'基本资料',
          '/m/setting/account/edu/':'教育经历'
      },
      alias:{
          'system-tab':'/?/tab/',
          'blog-tab':'/?/blog/tab/',
          'blog-list-box':'/?/blog/box/',
          'blog-list-tag':'/?/blog/tag/',
          'blog-list-class':'/?/blog/class/',
          'blog-list':'/?/blog/list/',
          'setting-tab':'/?/setting/tab/',
          'setting-account-tab':'/?/setting/account/tab/',

          'layout-system':'/m',
          'layout-blog':'/m/blog',
          'layout-blog-list':'/m/blog/list/',
          'layout-setting':'/m/setting',
          'layout-setting-account':'/m/setting/account',

          'blog-tag':'/m/blog/tag/',
          'setting-edu':'/m/setting/account/edu/',
          'setting-profile':'/m/setting/account/',
          'setting-permission':'/m/setting/permission/'
      }
  }
```

模块配置举例

```javascript
  modules:{
      '/?/tab/':'module/tab/index.html',
      '/?/blog/tab/':'module/blog/tab/index.html',
      '/?/blog/box/':'module/blog/list.box/index.html',
      '/?/blog/tag/':'module/blog/list.tag/index.html',
      '/?/blog/class/':'module/blog/list.class/index.html',
      '/?/blog/list/':'module/blog/list/index.html',
      '/?/setting/tab/':'module/setting/tab/index.html',
      '/?/setting/account/tab/':'module/setting/account.tab/index.html',

      '/m':{
          module:'module/layout/system/index.html',
          composite:{
              tab:'/?/tab/'
          }
      },
      '/m/blog':{
          module:'module/layout/blog/index.html',
          composite:{
              tab:'/?/blog/tab/'
          }
      },
      '/m/blog/list/':{
          module:'module/layout/blog.list/index.html',
          composite:{
              box:'/?/blog/box/',
              tag:'/?/blog/tag/',
              list:'/?/blog/list/',
              clazz:'/?/blog/class/'
          }
      },
      '/m/blog/tag/':'module/blog/tag/index.html',

      '/m/setting':{
          module:'module/layout/setting/index.html',
          composite:{
              tab:'/?/setting/tab/'
          }
      },
      '/m/setting/account':{
          module:'module/layout/setting.account/index.html',
          composite:{
              tab:'/?/setting/account/tab/'
          }
      },
      '/m/setting/account/':'module/setting/profile/index.html',
      '/m/setting/account/edu/':'module/setting/edu/index.html',
      '/m/setting/permission/':'module/setting/permission/index.html'
  }
```

#### 模块组合

模块通过__export属性开放组合模块的容器，__export中的parent为子模块的容器节点，顶层模块（如 “/m”）可以通过重写__doParseParent来明确指定应用所在容器

```javascript
_pro.__doBuild = function(){
    this.__body = _e._$html2node(
        _e._$getTextTemplate('module-id-l2')
    );
    // 0 - box select
    // 1 - class list box
    // 2 - tag list box
    // 3 - sub module box
    var _list = _e._$getByClassName(this.__body,'j-flag');
    this.__export = {
        box:_list[0],
        clazz:_list[1],
        tag:_list[2],
        list:_list[3],
        parent:_list[3]
    };
};
```

通过composite配置模块组合

```javascript
'/m/blog/list/':{
    module:'module/layout/blog.list/index.html',
    composite:{
        box:'/?/blog/box/',
        tag:'/?/blog/tag/',
        list:'/?/blog/list/',
        clazz:'/?/blog/class/'
    }
}
```

模块组合时可以指定组合模块的处理状态
* onshow  - 这里配置的组合模块仅在模块显示时组合，后续的模块refresh操作不会导致组合模块的refresh，适合于模块在显示后不会随外界输入变化而变化的模块
* onrefresh  -  这里配置的模块在模块显示时组合，后续如果模块refresh时也会跟随做refresh操作，适用于组合的模块需要与外部输入同步的模块
* 不指定onshow或者onrefresh的模块等价于onrefresh配置的模块

```javascript
composite:{
    onshow:{
        // 模块onshow时组合
        // 组合的模块在模块onrefresh时不会刷新
    },
    onrefresh{
        // 模块onshow时组合
        // 组合的模块在模块onrefresh时也同时会刷新
    }
    // 这里配置的组合模块等价于onrefresh中配置的模块
}
```

#### 启动应用

根据配置启动应用

```javascript
NEJ.define([
    'util/dispatcher/dispatcher'
],function(_e){
    _e._$startup({
        // 规则配置
        rules:{
            rewrite:{
                // 重写规则配置
            },
            title:{
                // 标题配置
            },
            alias:{
                // 别名配置
                // 建议模块实现文件中的注册采用这里配置的别名
            }
        },
        // 模块配置
        modules:{
            // 模块UMI对应实现文件的映射表
            // 同时完成模块的组合
        }
    });
});
```

### 打包发布

打包发布内容详见[NEJ工具集](https://github.com/genify/toolkit)相关文档

## 系统变更

当系统需求变化而进行模块变更我们只需要开发新的模块或删除模块配置即可

### 新增模块

如果新增的模块功能在系统中已经实现，则只需修改配置即可，如上例中我们需要在将日志管理下的标签模块在博客设置中也加一份，访问路径为/m/setting/tag/

![新增模块](http://img0.ph.126.net/s4pv6FZmPal8Jx0m0eNltA==/6619471216560468933.png)

修改规则配置

```javascript
rules:{
    // ...
    alias:{
        // ...
        'blog-tag':['/m/blog/tag/','/m/setting/tag/']
    }
}
```

修改模块配置

```javascript
modules:{
    // ...
    '/m/setting/tag/':'module/blog/tag/index.html'
}
```

如果要在/?/setting/tab模块的结构模板中增加一个标签即可

```html
<textarea name="txt" id="module-id-8">
  <div class="ma-t w-tab f-cb">
    <a class="itm fl" href="#/setting/account/" data-id="/setting/account/">账号管理</a>
    <a class="itm fl" href="#/setting/permission/" data-id="/setting/permission/">权限设置</a>
    <a class="itm fl" href="#/setting/tag/" data-id="/setting/tag/">日志标签</a>
  </div>
</textarea>
```

### 删除模块

将退化的模块从系统中删除只需要将模块对应的UMI配置从模块配置中删除即可，而无需修改具体业务逻辑



