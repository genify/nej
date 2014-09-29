# 依赖管理系统

## 概述

随着前端系统的日渐复杂，系统所依赖的文件越来越多，单纯的依靠人肉管理已经无法满足高品质系统的需求了，为了便于开发者管理、老系统平滑升级迁移，NEJ提供了一套文件依赖管理系统，本系统主要特性包括：

* 安全沙箱：文件定义的模块运行在自己的执行环境中，通过返回控制对外开放的接口
* 依赖管理：管理文件之间的依赖关系，包括非脚本的资源文件
* 依赖注入：文件依赖的其他资源可以通过返回结果注入给其依赖文件
* 平滑升级：无脚本侵入，只需通过配置即可在老系统中实现依赖管理
* 打包发布：提供优化输出[打包工具](https://github.com/genify/toolkit.git)，分离依赖系统，减少依赖对线上产品的影响

## 使用

页面引入依赖库文件，配置参数通过define.js的查询参数输入

```html
<script src="/path/to/nej/define.js?pro=./"></script>
```

脚本文件定义，为防止与其他加载器命名冲突，NEJ使用NEJ.define接口定义文件执行函数

```javascript
NEJ.define([
    'base/element',
    'pro/extend/util',
    '/path/to/file.js',
    '{platform}patch.js',
    'text!/path/to/file.css',
    'text!/path/to/file.html'
],function(e,u,t,h,css,html,p,o,f,r){

    // TODO something

    // 返回结果可注入给其他文件
    return p;
});
```

## 配置

NEJ的依赖管理系统配置信息通过define.js的查询参数输入，打包时也会根据这些参数配置做相应处理

系统保留单字母命名的参数配置，预置的配置参数如：g、c、d、p

### 预置配置

#### g=[true|false]

配置项目中是否存在全局的define函数，默认为false，如果配置为true则项目中必须使用NEJ.define来使用本依赖管理系统，否则如果项目没有定义额外的define函数则可以使用define函数来使用此依赖系统

```html
<script src="/path/to/nej/define.js?g=true"></script>
```

#### c=[gbk|utf-8|…]

配置项目编码格式，依赖载入的脚本编码格式会设置为此参数配置的信息，打包输出也会参考此参数进行输出，默认为utf-8，如果配置为其他编码格式则需保证项目的相关文件的编码必须统一为此配置的编码格式

```html
<script src="/path/to/nej/define.js?c=gbk"></script>
```

#### d=/patch/to/dep.js

配置第三方库或者遗留项目文件的依赖关系，具体使用可参看NEJ.deps接口的说明

```html
<script src="/path/to/nej/define.js?d=./dep.js"></script>
```

#### p=td|gk|wk
平台配置参数，见以下[平台配置](#平台配置)章节说明


### 路径配置

文件定义时指定的路径可以通过路径配置的变量来指定前缀，如路径配置时指定了变量A，则文件定义时可以直接使用A或者”{A}”来表示A指定的路径前缀。

```html
<script src="/path/to/nej/define.js?A=../web/js/"></script>
```

```javascript
NEJ.define([
    'A/extend/util',
    '{A}extend/util.js'
],function(u1,u2){

    // 这里需要注意的是如果使用{A}形式需要加后缀.js
    // 这里两种方式引入的为同一个文件都是 ../web/js/extend/util.js 文件

});
```

系统默认预置了lib、pro、platform的路径配置

#### lib

NEJ框架路径配置名称为”lib”，文件定义和依赖时可直接使用”{lib}”来表示框架的路径，默认此路径为外联的define.js文件所在的路径

```html
<script src="/path/to/nej/define.js"></script>
```

```javascript
NEJ.define([
    'base/element',
    'lib/base/element',
    '{lib}base/element.js'
],function(e1,e2,e3){

    // 这里解析出来的lib为 /path/to/nej/
    // 以上三种方式访问的为同一个文件都是 /path/to/nej/base/element.js 文件

});

```

#### pro

项目脚本根路径配置名称为“pro”，文件定义和依赖时可直接使用pro或“{pro}”来表示脚本根路径，此配置信息可以通过外联的define.js路径中的查询串进行配置。如果没有自定义配置则默认相对于当前页面访问路径的“../javascript/”路径。

```html
<script src="/path/to/nej/define.js?pro=./"></script>
```

```javascript
NEJ.define([
    'pro/api/element',
    '{pro}/api/element.js'
],function(e1,e2){

    // 以上两种方式访问的为同一个文件都是 ./api/element.js 文件

});

```

#### platform

控件依赖补丁名称为“platform”，只用于文件依赖，使用“{platform}xxx.js”来表示控件依赖的补丁文件，会解析为依赖xxx.js和xxx.patch.js两个文件。xxx.js为W3C/ES规范实现方式，提供所有标准平台支持的公用部分，xxx.patch.js通过NEJ.patch接口提供不同平台对这些接口的特有实现逻辑，这部分内容的详细说明参阅《NEJ平台适配系统》

```
  widget
    | - element.js
    | - platform
            | - element.js
            | - element.patch.js
```

```javascript
NEJ.define([
    '{platform}/element.js'
],function(e1){

    // 这里会自动载入 ./platform/element.js 和 ./platform/element.patch.js 文件

});

```

#### 自定义路径

其他自定义路径可以通过引入define.js文件时作为查询参数输入进行配置，如自定义com路径，则可以通过以下方式进行配置（配置路径中以”./”、”../”起始的相对路径相对于当前地址栏路径）

```html
<script src="/path/to/nej/define.js?com=../js/"></script>
```

```javascript
NEJ.define([
    'com/api/util',
    '{com}api/util.js'
],function(u1,u2){

    // 这里两种方式引入的为同一个文件都是 ../js/api/util.js 文件

});
```

### 平台配置

平台参数在开发及打包过程中都会使用，框架支持平台参数的配置通过define.js路径上查询串中的p参数输入。

平台配置信息，此配置又分两类基本配置：补丁配置和混合配置，因为混合模式下使用的浏览器引擎固定，因此当配置中出现混合类型的配置时忽略补丁配置的值。

如果在引入依赖定义库时未指定平台信息则表示系统需对全平台浏览器支持。

关于平台配置相关的详细内容可参阅《NEJ平台适配系统》

#### 补丁配置

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

#### 混合配置

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


## 接口

以下所有接口均使用NEJ作为名字空间，如define接口使用时用NEJ.define

### define

文件定义接口，并指定当前脚本执行所需的其他依赖文件，文件路径规则

* 完整的文件路径，如 http://a.b.com/patch/to/file.js
* 使用{}标识配置参数，如{root}file.js
* 直接使用非{}标识配置参数，此时不能加.js后缀，系统自动加.js后缀，如 root/file
* NEJ库文件可以省略lib标识，如base/element，等价于 lib/base/element，等价于 {lib}base/element.js
* 其他文本资源采用text!前缀标识，如text!/path/to/file.css，注意开发时如果资源是跨域的请设置好浏览器XHR的跨域支持
* JSON资源采用json!前缀标识，如json!/path/to/data.json，注意开发时如果资源是跨域的请设置好浏览器XHR的跨域支持
* Regular模板资源采用regular!前缀标识，如regular!/path/to/file.html，注意开发时如果资源是跨域的请设置好浏览器XHR的跨域支持
* 路径以 ./ 或者 ../ 开始的相对路径则相对于当前脚本文件的路径，如 ./util.js

执行函数注入参数说明

* 注入依赖列表中各文件对应的返回结果
* 注入额外四个参数，依次为p、o、f、r，其中
  * p为输出结果集空间，用于注入到其他执行函数中的内容
  * o为对象实例，即{}，用于处理对象默认值，如 var x = options||o;
  * f为函数实例，返回false，用于处理方法默认值，如 var func = x.onready||f;
  * r为数组实例，即[]，用于处理数组默认值，如 var arr = options.list||r;

接口说明

|      | 类型 | 描述 |
| :--- | :--- | :--- |
| 输入 | String   |   可选，当前文件路径 |
|      | Array    | 可选，依赖的其他文件路径 |
|      | Function | 可选，当前文件需要执行的脚本，依赖文件的返回结果依次注入到该函数中 |
| 输出 | Object   |   对外开放的接口，可注入到依赖该文件的其他文件执行函数中 |

```javascript
NEJ.define([
    'util/ajax/tag',
    'util/template/jst'
],function(j,e,p,o,f,r){

    // j 为 util/ajax/tag 文件导出的接口集合
    // e 为 util/template/jst 文件导出的接口集合

    // 用于注入到其他文件执行函数中的接口
    p.api = function(){

    };

    // TODO something

    return p;
});
```

### patch

平台补丁配置接口，用于针对不同平台做修正逻辑，平台支持TR|WR|GR，没有比较操作符表示支持当前内核所有release版本，平台引擎标识说明如下

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

### deps

通过配置来管理依赖，对于历史遗留项目或者使用了非AMD规范的第三方库如需引入依赖管理，可以通过此接口先配置依赖关系表，后期维护可直接使用依赖方式进行

开发阶段会全部依赖，发布只提取页面使用的脚本

接口说明

|      | 类型  | 描述 |
| :--- | :--- | :--- |
| 输入 | Array | 可选，依赖映射表 |
|      | Array | 可选，入口屏蔽文件列表 |
| 输出 | Void  | 无 |

假设系统依赖文件配置表为 deps.js， 文件内容如下

```javascript
NEJ.deps({
    '{pro}a.js':['{pro}b.js','{pro}c.js','{pro}d.js'],
    '{pro}b.js':['{pro}c.js','{pro}e.js'],
    '{pro}c.js':['{pro}d.js','{pro}e.js','{pro}a.js'],
    '{pro}d.js':['{pro}e.js'],
    '{pro}f.js':['{pro}a.js']
},[
    '{pro}f.js'
]);
```

则页面引入方式可用以下形式

```html
<script src="/path/to/nej/define.js?d=./deps.js&pro=./"></script>
<script src="./f.js"></script>
<script>
    NEJ.define([
        '{pro}a.js',
        '{pro}e.js'
    ],function(){
        log('app');
    });
</script>
```

## 循环依赖

当依赖链出现了环时我们就认为出现了循环依赖，依赖管理系统对于循环依赖的处理分两种情况

如下箭头方向表示文件的依赖，如 a.js 依赖 b.js

```
   a.js  ->  b.js  ->  a.js
```

* 强依赖：依赖文件之间的接口调用直接出现在文件定义函数中，避免代码出现强依赖，执行过程会出异常
* 弱依赖：依赖文件之间的接口调用出现在文件定义函数内部的某个接口中，允许出现弱依赖，可以正常处理

### 强依赖

在define接口中输入的执行函数里直接调用了依赖列表中的其他文件中的API的情况

a.js文件

```javascript
NEJ.define([
    './b.js'
],function(b,p){

    // 在此函数中直接调用了b的接口
    var result = b.api();

    p.api = function(){
        // TODO
        return 'aaaaa';
    };

    return p;
});
```

b.js文件

```javascript
NEJ.define([
    './a.js'
],function(a,p){

    // 在此函数中直接调用了a的接口
    var result = a.api();

    p.api = function(){
        // TODO
        return 'bbbbbb';
    };

    return p;
});
```

### 弱依赖

在define接口中输入的执行函数里没有直接调用依赖列表中的其他文件中的API，所有对其他文件的API的调用均在当前文件提供的API中调用的情况

a.js文件

```javascript
NEJ.define([
    './b.js'
],function(b,p){

    // 在其他API中调用了b的接口
    p.doSomething = function(){
        var result = b.api();
    };

    p.api = function(){
        // TODO
        return 'aaaaa';
    };

    return p;
});
```

b.js文件

```javascript
NEJ.define([
    './a.js'
],function(a,p){

    // 在其他API中调用了a的接口
    p.doSomething = function(){
        var result = b.api();
    };

    p.api = function(){
        // TODO
        return 'bbbbbb';
    };

    return p;
});
```
