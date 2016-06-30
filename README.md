# NEJ - JavaScript Framework

## 概述 

跨平台WEB前端开发框架，主要提供Web端SDK用于开发Web应用，服务器端SDK用于整合解决方案的服务器端实现

主要特性包括：

* [依赖管理系统](./doc/DEPENDENCY.md)支持 
* [平台适配系统](./doc/PLATFORM.md)支持（浏览器、移动APP、桌面APP等）
* 丰富可灵活扩展的[控件系统](./doc/WIDGET.md)（可验证表单、列表、拖拽、滑块、日历、富文本编辑器等）
* 多方案集成（[模板系统](./doc/TEMPLATE.md)、[可组合的模块化开发](./doc/DISPATCHER.md)、[单页系统按需载入](./doc/DISPATCHER.md)、[基于配置的跨域异步请求](./doc/AJAX.md)等）
* 可自由定制的产品发布（按平台定制、按功能定制）
* 工具支持（[NEJ工具集](https://github.com/genify/toolkit2)、[NEI工具集](https://github.com/genify/nei)等）
* 新技术整合（对于高端目标平台自动应用新技术）

## 使用 

[API手册](http://nej.netease.com/help/index.html)

页面引入define.js，可以下载到本地也可以使用NEJ服务器上的define.js（ http://nej.netease.com/nej2/src/define.js ），通过切换define.js的路径切换使用的NEJ库

```html
<!DOCTYPE html>
<html>
  <head>
    <title>use nej</title>
    <meta charset="utf-8"/>
  </head>
  <body>
    <textarea id="txt-0"></textarea>
    <input type="text" id="input-id-0" maxlength="100"/>
    
    <script src="/path/to/nej/define.js"></script>
    <script>
      NEJ.define([
        'util/counter/counter'
      ],function(_e){
          _e._$counter('txt-0');
          _e._$counter('input-id-0');
          
          // TODO
      });
    </script>
    <script>
      // 习惯链式的同学也可以这样使用
      NEJ.define([
        'util/chain/chainable',
        'util/counter/counter'
      ],function($){
          $('#txt-0')._$counter();
          $('#input-id-0')._$counter();
          
          // TODO
      });
    </script>
  </body>
</html>
```

## 文档

* 依赖管理 [文档](./doc/DEPENDENCY.md)
* 平台适配 [文档](./doc/PLATFORM.md)
* 窗体消息 [文档](./doc/MESSAGE.md)
* 远程调用 [文档](./doc/AJAX.md)
* 模块调度 [文档](./doc/DISPATCHER.md)
* 模板系统 [文档](./doc/TEMPLATE.md)
* 组件系统 [文档](./doc/WIDGET.md)