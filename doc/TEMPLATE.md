# 模板系统

## 概述

模板系统主要用来分离视图与数据，用以生成特定格式的文档，可以提升开发效率，良好的设计也可以使得代码重用变得更加容易，主要特点包括：

* 分离代码（业务逻辑代码与视图代码）
* 数据分离（动态数据与静态数据）
* 代码单元共享（代码共享）

本文主要介绍NEJ框架的模板系统及其使用，模板系统提供两大类模板的支持：基本类型和资源类型，模版系统的实现模块包括util/template/tpl和util/template/jst

## 模板结构

NEJ模板系统可以直接用字符串作为模板，也可以使用TEXTAREA标签封装模板，使用TEXTAREA标签封装模版的形式如下

![模板类型](http://img2.ph.126.net/W_RhwYyx4kbPPGMpcVoUwQ==/6608414527633039667.png)

### 基本类型

结构范例

```html
<textarea name="txt" id="txt-template-1">
  <div>
    <p>aaaaaaaaaaaaaa</p>
    <!-- content here -->
  </div>
</textarea>
```

#### name

标识模板类型，主要包括txt/jst/ntp三种，每种类型的详细说明见模板类型章节

#### id

模板标识，后续可以用模板接口输入该ID取得模板的内容

### 资源类型

结构范例

```html
<textarea name="css" data-src="./a.css" data-version="20140901">
  .a{color:#000;}
  .b{color:#ddd;}
</textarea>
```

#### name

标识模板类型，主要包括css/js/html/res四种类型

#### data-src

标识模板资源地址，多个地址用“,”分隔，以“./”，“../”开始的相对路径相对于当前文件所在的目录

#### data-version

资源版本信息

## 模板类型

模板系统提供两类模板，根据实际需求，每类模板又做了细化分类

### 基本类型

基本类型模板主要包括 txt/jst/ntp 三类模板

#### txt

txt模板提供了基本的文本缓存功能, 模板标示符为txt，开发人员可以使用这个模板来缓存html结构

如果脚本里已经有了模版内容则可以通过_$addTextTemplate接口添加到缓存中

代码举例

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 模版添加到缓存池中
    _t._$addTextTemplate('txt-template-1','\
        <div>\
          <p>aaaaaaaaaaaaaa</p>\
          <!-- content here -->\
        </div>\
    ');

    // TODO
});
```

如果模版使用textarea标签封装的话采用以下形式

代码举例

```html
<textarea name="txt" id="txt-template-1">
  <div>
    <p>aaaaaaaaaaaaaa</p>
    <!-- content here -->
  </div>
</textarea>
```

此类模板后续可以使用_$getTextTemplate接口获取

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 解析模版，支持textarea的批量解析
    _t._$parseTemplate('txt-template-1');

    // 根据模板ID取模板内容
    // 返回字符串类型的模板内容
    var _text = _t._$getTextTemplate('txt-template-1');

    // TODO
});
```

#### ntp

节点模版，主要用于UI控件中对复杂结构的缓存和重用，见[ITEM控件](#ITEM控件)

如果是字符串的模版，则可以通过_$addNodeTemplate接口添加至缓存

代码举例

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 模版添加到缓存池中
    _t._$addNodeTemplate('ntp-template-1','\
        <div>\
          <p>aaaaaaaaaaaaaa</p>\
          <!-- content here -->\
        </div>\
    ');

    // TODO
});
```

如果模版使用textarea标签封装的话采用以下形式

代码举例

```html
<textarea name="ntp" id="ntp-template-1">
  <div>
    <p>aaaaaaaaaaaaaa</p>
    <!-- content here -->
  </div>
</textarea>
```

此类模板后续可以使用_$getNodeTemplate接口获取

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 解析模版，支持textarea的批量解析
    _t._$parseTemplate('ntp-template-1');

    // 根据模板ID取模板内容
    // 返回模板对应的DOM树结构
    var _node = _t._$getNodeTemplate('ntp-template-1');

    // TODO
});
```

#### jst

符合[JST语法](#JST语法)规则的模版，类似服务器端模版如freemarker、verlocity等

如果模版是字符串，则可以通过_$add接口添加到缓存

代码举例

```javascript
NEJ.define([
    'util/template/jst'
],function(_t){
    // 添加JST模板缓存
    _t._$add('\
        <table class="w-table">\
          <thead>\
            <tr><th>序号</th><th>姓名</th><th>性别</th></tr>\
          </thead>\
          {if !defined("workers")}\
          <tr><td colspan="3">数据加载失败，请稍后再试！</td></tr>\
          {elseif workers&&workers.length}\
            {list workers as x}\
              <tr{if x_index==x_length-1} class="last"{/if}>\
                <td>${x_index+1}</td>\
                <td>${x.name}</td>\
                <td>{if x.gender==1}男{else}女{/if}</td>\
              </tr>\
            {/list}\
          {else}\
          <tr><td colspan="3">没有工人！</td></tr>\
          {/if}\
        </table>\
    ');
})
```

如果模版使用textarea标签封装的话采用以下形式

代码举例

```html
<textarea name="jst" id="jst-template-1">
    <table class="w-table">
      <thead>
        <tr><th>序号</th><th>姓名</th><th>性别</th></tr>
      </thead>\
      {if !defined("workers")}
      <tr><td colspan="3">数据加载失败，请稍后再试！</td></tr>
      {elseif workers&&workers.length}
        {list workers as x}
          <tr{if x_index==x_length-1} class="last"{/if}>
            <td>${x_index+1}</td>
            <td>${x.name}</td>
            <td>{if x.gender==1}男{else}女{/if}</td>
          </tr>
        {/list}
      {else}
      <tr><td colspan="3">没有工人！</td></tr>
      {/if}
    </table>
</textarea>
```

后续可以使用_$get接口获取整合数据的结果

代码举例

```javascript
NEJ.define([
    'util/template/jst'
],function(_t){
    // 添加模版缓存
    // 也可以用_$parseTemplate接口批量添加
    _t._$add('jst-template-1');

    // 根据模板ID取模板内容
    // 返回整合数据后的html代码
    var _html = _t._$get('jst-template-1',{
        workers:[
            {name:'abc',gender:1},
            {name:'def',gender:1},
            {name:'ghi'}
        ]
    });

    // TODO
});
```

### 资源类型

资源类型模板又分为 css/js/html/res 四类，资源类模板只能用TEXTAREA标签封装

#### css

样式资源模版，可以采用内联也可以采用外联方式载入

代码举例

```html
<div id="template-box">
    <!-- 纯内联样式 -->
    <textarea name="css">
      .a{color:#aaa;}
      .b{color:#bbb;}
    </textarea>

    <!-- 纯外联 -->
    <textarea name="css" data-src="./a.css,./b.css" data-version="v1"></textarea>

    <!-- 复合内联外联 -->
    <textarea name="css" data-src="./a.css,./b.css" data-version="v1">
      .a{color:#aaa;}
      .b{color:#bbb;}
    </textarea>
</div>
```

对于内外联复合的样式模板，解析成样式时，内联的样式在外联的样式的后面

系统初始化时使用_$parseTemplate接口解析模版

代码举例

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 激活样式模版
    _t._$parseTemplate('template-box');

    // TODO
});
```

#### js

脚本资源模版，可以采用内联也可以采用外联方式载入

代码举例

```html
<div id="template-box">
    <!-- 纯内联样式 -->
    <textarea name="js">
      var a = 'aaaa';
      var b = 'bbbb';
    </textarea>

    <!-- 纯外联 -->
    <textarea name="js" data-src="./a.js,./b.js" data-version="v1"></textarea>

    <!-- 复合内联外联 -->
    <textarea name="js" data-src="./a.css,./b.css" data-version="v1">
      var a = 'aaaa';
      var b = 'bbbb';
    </textarea>
</div>
```

对于内外联复合的脚本模板激活时，内联的脚本在外联的脚本载入完成后执行

系统初始化时使用_$parseTemplate接口解析模版

代码举例

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 激活脚本
    _t._$parseTemplate('template-box');

    // TODO
});
```

#### html

外联模版集合，载入的结构会递归进行调用_$parseTemplate接口解析模版，项目中一般用于载入通用控件结构，html模版的data-src不支持多个模版用“,”分隔的形式

代码举例

```html
<div id="template-box">
    <textarea name="html" data-src="./a.html" data-version="v1"></textarea>
    <textarea name="html" data-src="./b.html" data-version="v1"></textarea>
</div>
```

系统初始化时使用_$parseTemplate接口解析模版，如果要确保代码中能够使用外联的模版，则需要在document的ontemplateready事件中处理

代码举例

```javascript
NEJ.define([
    'base/event',
    'util/template/tpl'
],function(_v,_t){
    // 载入外联模版集合
    _t._$parseTemplate('template-box');

    _v._$addEvent(
        document,'templateready',function(){
            // 这里可以保证外联的模板可用

            // TODO
        }
    );

    // TODO
});
```

#### res

外联文本资源，载入后作为txt类型的模版使用，需要指定id

代码举例

```html
<div id="template-box">
    <textarea name="txt" id="txt-0" data-src="./a.html" data-version="v1"></textarea>
    <textarea name="txt" id="txt-1" data-src="./b.html" data-version="v1"></textarea>
</div>
```

后续通过_$getTextTemplate接口使用，如果要确保代码中能够使用外联的模版，则需要在document的ontemplateready事件中处理

代码举例

```javascript
NEJ.define([
    'util/template/tpl'
],function(_t){
    // 解析模版，支持textarea的批量解析
    _t._$parseTemplate('template-box');

    _v._$addEvent(
        document,'templateready',function(){
            // 这里可以保证外联的模板可用

            // 根据模板ID取模板内容
            // 返回字符串类型的模板内容
            var _text0 = _t._$getTextTemplate('txt-0');
            var _text1 = _t._$getTextTemplate('txt-1');

            // TODO
        }
    );

    // TODO
});
```

## JST语法

### 表达式

#### ${}

描述：求值表达式，表达式中不可以包含 “{”或者“}”

语法：

```html
${expr}

${expr|modifier}

${expr|modifier1|modifier2|...|modifierN}

${expr|modifier1:argExpr1_1}

${expr|modifier1:argExpr1_1,argExpr1_2,...,argExpr1_N}

${expr|modifier1:argExpr1_1|...|modifierN:argExprN_1,argExprN_2,...,argExprN_M}
```

范例：

```html
${customer.firstName}

${customer.firstName|capitalize}

${customer.firstName|default:"no name"|capitalize}

${article.getCreationDate|default:new Date()|toCalendarControl:"YYYY.MM.DD",true,"creation Date"}

${(lastQuarter.calcRevenue() - fixedCosts) / 10000}
```

#### ${% %}

描述：求值表达式，表达式中可以包含 “{”或者“}”

语法：

```html
${% expr %}
```

范例：

```html
${% emitLink("Solution and Products", {color: "red", blink: false}) %}
```

### 语句

#### list break

描述：遍历数组

语法1：

```html
{list seq as varName}
    ...
{break}
    ...
{/list}
```

范例1：

```html
{list ["aaa", "bbbb", "ccccc"] as x}
  ${x_index}/${x_length}:${x}<br/>
{/list}
```

备注：

* x_index为内置变量，值为循环的索引值。
* x_length为内置变量，值为列表长度， 上例中值为3。

语法2：

```html
{list from..to as varName}
    ...
{/list}
```

备注：循环时包含from和to值

范例2：

```html
{list 2..10 as x}
    ${x_index}/${x_length}:${x}<br/>
{/list}
```

备注：

* x_index为内置变量，值为循环的索引值。
* x_length为内置变量，值为列表长度， 上例中值为9。

#### for forelse

描述：遍历HASH表

语法：

```html
{for varName in hash}
    ...
{forelse}
    ...
{/for}
```

注：forelse 子语句为可选

范例：

```html
{for x in {a:"aaa", b:"bbbb", c:"ccccc"}}
    ${x_key} - ${x}<br/>
{forelse}
    no pro
{/for}
```

注：x_key为内置变量，值为当前项的键值。

#### if elseif else

描述：条件控制语句

语法：

```html
{if expr}
    ...
{elseif expr}
    ...
{else}
    ...
{/if}
```

注：elseif、else 子语句为可选

范例：

```html
{if gender == 1}
    男
{elseif gender == 0}
    女
{else}
    春哥
{/if}
```

#### var

描述：变量定义

语法：

```html
{var varName}

{var varName = expr}
```

范例：

```html
{var test = "sssssss"}
```

#### macro

描述：宏定义

语法：

```html
{macro macroName(arg1, arg2, ... argN)}
    ... body of the macro ...
{/macro}
```

范例：

```html
{macro htmlList(dataList, optionalListType)}
    {var listType = optionalListType != null ? optionalListType : "ul"}
    <${listType}>
        {for item in dataList}
            <li>${item}</li>
        {/for}
    </${listType}>
{/macro}
```

调用宏：

```html
${htmlList(["首页", "日志"，"相册", "关于我"])}
```

输出：

```html
<ul>
    <li>首页</li>
    <li>日志</li>
    <li>相册</li>
    <li>关于我</li>
</ul>
```

#### cdata

描述：文本块，内容不做语法解析

语法：

```html
{cdata}
    ...no parsed text ...
{/cdata}
```

或

```html
{cdata EOF}
    ...no parsed text ...
EOF
```

范例：

```html
{cdata}
    ${customer.firstName}${customer.lastName}
{/cdata}
```

或

```html
{cdata END_OF_CDATA_SECTION}
    ${customer.firstName}${customer.lastName}
END_OF_CDATA_SECTION
```

输出：${customer.firstName}${customer.lastName}

#### minify

描述：压缩文本内容，内容不做语法解析

语法：

```html
{minify}
    ...multi-line text which will be stripped of line-breaks...
{/minify}
```

或

```html
{minify EOF}
    ...multi-line text which will be stripped of line-breaks...
EOF
```

范例：

```html
{minify}
    no parsed
    text
    and
    merge
    one
    line
{/minify}
```

或

```html
{minify EOF}
    no parsed
    text
    and
    merge
    one
    line
EOF
```

输出：no parsed text and merge one line

#### eval

描述：执行javascript语句，不做语法解析

语法：

```html
{eval}
    ...javascript statement...
{/eval}
```

或

```html
{eval EOF}
    ...javascript statement...
EOF
```

范例：

```html
{eval}
    var a = "aaaa";
    alert(a);
    function b(arg){
        alert(arg);
    }
{/eval}
```

或

```html
{eval EOF}
    var a = "aaaa";
    alert(a);
    function b(arg){
        alert(arg);
    }
EOF
```

### 扩展

#### rand

描述：随机一个指定长度的纯数字的串

语法：

```html
${number_expr|rand}
```

范例：

```html
${10|rand}
```

输出：3456785438

#### escape

描述：编码字符串

语法：

```html
${expr|escape}
```

范例：

```html
${"<div>1234<a href="#">163</a></div>"|escape}
```

输出：&amp;lt;div&amp;gt;1234&amp;lt;a href="#"&amp;gt;163&amp;lt;/a&amp;gt;&amp;lt;/div&amp;gt;

#### format

描述：格式化日期

语法：

```html
${data_expr|format:format_expr}
```

范例：

```html
${new Date()|format:"yyyy-MM-dd HH:mm:ss"}
```

输出：2012-06-13 16:30:55

#### default

描述：指定默认值

语法：

```html
${expr|default:default_expr}
```

范例：

```html
${null|default:"default value"}
```

输出：default value

注：当expr为undefiend,null,false,0或者空字符串时取默认值

## ITEM控件

ITEM控件提供了结构+逻辑的缓存功能，适合于列表项带复杂逻辑的模版，一般使用ntp模版来封装结构，列表类的ITEM基类抽象在ui/item/list模块中实现，因为ITEM控件也是UI控件，所以遵循[UI控件](./WIDGET.md)的规则










