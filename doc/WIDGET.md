# 控件系统

## 概述

控件系统主要用来解决系统复杂性的问题，使得系统不会因为变得复杂而不可控，同时保证其维护性和扩展性

NEJ框架提供了基于常规面向对象的思想构建的控件系统，主要用于：

* 提供通用解决方案的封装支持
* 提供核心功能、分析设计的重用
* 提供跨平台控件及API的支持


## 类模型

因为JavaScript本省没有提供类的概念，在控件系统中提供了一套类模型的解决方案，用以模拟常规面向对象语言中的“类”的概念。

类模型的实现见NEJ框架的base/klass模块

### 类定义

控件提供使用统一的类定义接口 _$klass 来定义一个类，通过此接口定义的类才具备以下的继承、初始化等特性

```javascript
NEJ.define([
    'base/klass'
],function(_k){
    // 定义一个类
    var Klass = _k._$klass();

    // TODO
});
```

### 类继承

使用 \_$klass 定义的类可以使用 \_$extend 接口来继承其他父类

```javascript
NEJ.define([
    'base/klass'
],function(_k){
    // 定义一个类
    var Klass = _k._$klass();
    // 继承其他类
    var pro = Klass._$extend(Super);

    // TODO
});
```

### 类构造

使用 \_$klass 定义的类统一使用 \_\_init 接口来初始化类，所有子类的接口均可以使用 this.\_\_super 方式调用父类同名接口

```javascript
NEJ.define([
    'base/klass'
],function(_k){
    // 定义一个类
    var Klass = _k._$klass();
    // 继承其他类
    var pro = Klass._$extend(Super);
    // 初始化
    pro.__init = function(){
        // 调用父类的__init
        this.__super();
        // TODO something
    };
    // TODO
});
```

### 类扩展

类的所有方法均定义在类函数的 prototype 对象上

```javascript
NEJ.define([
    'base/klass'
],function(_k){
    // 定义一个类
    var Klass = _k._$klass();
    // 继承其他类
    var pro = Klass._$extend(Super);
    // 初始化
    pro.__init = function(){
        // 调用父类的__init
        this.__super();
        // TODO something
    };
    // private 方法
    pro._privateMethod = function(){

    };
    // protected 方法
    pro.__protectedMethod = function(){
        // TODO
    };

    // public 方法
    pro._$publicMethod = function(){
        // TODO
    };

    // TODO
});
```

### 类规范

1. 类命名

   类命名使用前缀\_$$标识，首字母大写，驼峰式，如\_$$Klass，\_$$OneKlass

2. 类方法

   方法分为私有、保护、公共方法三类，各类方法的前缀标识如下

   * 私有方法使用\_(单个下划线)作为前缀，如\_privateMethod
   * 受保护的方法使用\_\_(两个下划线)作为前缀，如\_\_protectedMethod
   * 公共的方法使用\_$(下划线+美元符)作为前缀，如\_$publicMethod

   方法的命名首字母小写，驼峰式，如\_$myApi，\_\_myApi，\_myApi

## 控件模型

控件模型使用类模型来实现，基于类模型的基础做扩展，主要在util/event模块中实现；控件采用分配回收机制，因此控件的生命周期包括以下三个阶段：

1. 控件创建：首次使用时控件创建阶段，主要用于构建控件相关结构、数据等
2. 控件重置：重复使用时控件重置阶段，主要用于处理外部输入数据、事件侦测等
3. 控件回收：回收不用时控件销毁阶段，主要用于销毁重置阶段产生的结构、数据等

### 控件定义

所有的控件均继承自 util/event 模块的 _$$EventTarget 类

```javascript
NEJ.define([
    'base/klass',
    'util/event'
],function(_k,_t,_p){
    var _pro;
    // 定义控件
    _p._$$Widget = _k._$klass();
    // 继承_$$EventTarget
    _pro = _p._$$Widget._$extend(_t._$$EventTarget);

    // TODO

    return _p;
});
```

### 接口重写

控件采用分配回收重用机制，因此控件需实现\_\_init、\_\_reset、\_\_destroy接口

```javascript
NEJ.define([
    'base/klass',
    'util/event'
],function(_k,_t,_p){
    var _pro;
    // 定义控件
    _p._$$Widget = _k._$klass();
    // 继承_$$EventTarget
    _pro = _p._$$Widget._$extend(_t._$$EventTarget);
    // 控件首次创建构造过程
    _pro.__init = function(){
        this.__super();
        // TODO
    };
    // 控件重复使用重置过程
    _pro.__reset = function(_options){
        this.__super(_options);
        // TODO
    };
    // 控件回收销毁过程
    _pro.__destroy = function(){
        this.__super();
        // TODO
    };

    // TODO

    return _p;
});
```

### 扩展实现

其他扩展的业务逻辑根据控件实际需求实现

```javascript
NEJ.define([
    'base/klass',
    'util/event'
],function(_k,_t,_p){
    var _pro;
    // 定义控件
    _p._$$Widget = _k._$klass();
    // 继承_$$EventTarget
    _pro = _p._$$Widget._$extend(_t._$$EventTarget);
    // 控件首次创建构造过程
    _pro.__init = function(){
        this.__super();
        // TODO
    };
    // 控件重复使用重置过程
    // 重置过程可以接受到分配控件时输入的配置信息
    _pro.__reset = function(_options){
        this.__super(_options);
        // TODO
    };
    // 控件回收销毁过程
    _pro.__destroy = function(){
        this.__super();
        // TODO
    };

    // 扩展私有接口
    _pro._myPrivateMethod = function(){
        // TODO
    };
    // 扩展保护接口
    _pro.__myProtectedMethod = function(){
        // TODO
    };
    // 扩展对外接口
    _pro._$myPublicMethod = function(){
        // TODO
    };

    // TODO

    return _p;
});
```

### 事件支持

控件支持自定义事件的触发，在控件的业务逻辑中可根据实际需求通过 _$dispatchEvent 接口触发自定义事件来与外界进行交互

```javascript
NEJ.define([
    'base/klass',
    'util/event'
],function(_k,_t,_p){
    var _pro;
    // 定义控件
    _p._$$Widget = _k._$klass();
    // 继承_$$EventTarget
    _pro = _p._$$Widget._$extend(_t._$$EventTarget);
    // 控件首次创建构造过程
    _pro.__init = function(){
        this.__super();
        // TODO
    };
    // 控件重复使用重置过程
    // 重置过程可以接受到分配控件时输入的配置信息
    _pro.__reset = function(_options){
        this.__super(_options);
        // TODO
    };
    // 控件回收销毁过程
    _pro.__destroy = function(){
        this.__super();
        // TODO
    };

    // 扩展私有接口
    _pro._myPrivateMethod = function(){
        // TODO
        // 触发自定义的onchange事件
        this._$dispatchEvent(
            'onchange',{
                x:'xxxxx',
                y:'yyyyyyy'
            }
        );
    };
    // 扩展保护接口
    _pro.__myProtectedMethod = function(){
        // TODO
        // 触发自定义的onupdate事件
        this._$dispatchEvent(
            'onupdate',{
                a:'aaaa',
                b:'bbbbbbb'
            }
        );
    };
    // 扩展对外接口
    _pro._$myPublicMethod = function(){
        // TODO
    };

    // TODO

    return _p;
});
```

### 平台适配

控件的平台适配规则遵循《[平台适配系统](./PLATFORM.md)》的规范，可以按照以下步骤实现：

1. 在控件实现文件处构建平台适配目录platform，可以通过nej工具集中nej-widget指令来自动生成控件目录结构，或者使用nej-patch指令来自动生成platform目录结构，如

    ```
      widget
        | - widget.js
        | - platform
                | - widget.js
                | - widget.patch.js
    ```

2. 提取控件涉及的存在平台差异的API，在platform/widget.js中根据W3C/ES规范实现API

    ```javascript
    NEJ.define([
        'base/platform'
    ],function(_m,_p){
        // 存在平台差异的API
        _p.__api1 = function(){
            // TODO
        };
        // 存在平台差异的API
        _p.__api2 = function(){
            // TODO
        }
        // 返回平台差异API集合
        return _p;
    });
    ```

3. 根据平台差异，在platform/widget.patch.js文件中实现各平台的差异化逻辑

    ```javascript
    NEJ.define([
        './widget.js'   // 这里注入标准API集合
    ],function(_h){
        // 根据平台特点重写API实现
        NEJ.patch('TR<=2.0',function(){
            // for ie6-
            _h.__api1 = function(){
                // TODO
            };
        });

        // 根据平台特点采用AOP方式切入平台逻辑
        NEJ.patch('WR',function(){
            // for webkit
            _h.__api2 = _h.__api2._$aop(
                function(_event){
                    // 标准逻辑之前处理业务逻辑
                    // _event.args
                    // _event.value
                    // _event.stopped
                    // TODO
                },
                function(_event){
                    // 标准逻辑之后处理业务逻辑
                    // _event.args
                    // _event.value
                    // _event.stopped
                    // TODO
                }
            );
        });

        // 这里必须返回注入的标准API集合
        return _h;
    });
    ```

4. 控件中使用{platform}注入平台适配API使用

    ```javascript
    NEJ.define([
        'base/klass',
        'util/event',
        '{platform}widget.js'
    ],function(_k,_t,_h,_p){
        var _pro;
        // 定义控件
        _p._$$Widget = _k._$klass();
        // 继承_$$EventTarget
        _pro = _p._$$Widget._$extend(_t._$$EventTarget);
        // 控件首次创建构造过程
        _pro.__init = function(){
            this.__super();
            // TODO
        };
        // 控件重复使用重置过程
        // 重置过程可以接受到分配控件时输入的配置信息
        _pro.__reset = function(_options){
            this.__super(_options);
            // TODO
        };
        // 控件回收销毁过程
        _pro.__destroy = function(){
            this.__super();
            // TODO
        };

        // 扩展私有接口
        _pro._myPrivateMethod = function(){
            // 使用平台适配接口
            _h.__api1();

            // TODO
            // 触发自定义的onchange事件
            this._$dispatchEvent(
                'onchange',{
                    x:'xxxxx',
                    y:'yyyyyyy'
                }
            );
        };
        // 扩展保护接口
        _pro.__myProtectedMethod = function(){
            // TODO
            // 触发自定义的onupdate事件
            this._$dispatchEvent(
                'onupdate',{
                    a:'aaaa',
                    b:'bbbbbbb'
                }
            );
        };
        // 扩展对外接口
        _pro._$myPublicMethod = function(){
            // 使用平台适配接口
            _h.__api2();

            // TODO
        };

        // TODO

        return _p;
    });
    ```

### 控件使用

控件使用分配回收机制而非 new 的方式使用

```javascript
NEJ.define([
    '/path/to/widget.js'
],function(_t){
    // 分配控件
    var _widget = _t._$$Widget._$allocate({
        a:'aaaaaaaa',
        b:'bbbbbbbbbbb',
        c:'ccccccccccccc',
        onchange:function(_event){
            // 控件支持的事件
            // _event.x
            // _event.y

            // TODO
        },
        onupdate:function(_event){
            // 控件支持的事件
            // _event.a
            // _event.b

            // TODO
        }
    });

    // 外界可以调用控件的public方法
    _widget._$myPublicMethod();

    // 回收控件
    // 注意这里必须将原控件持有的引用置空
    _widget = _widget._$recycle();
    // 或者
    _widget._$recycle();
    _widget = null;
});
```





























