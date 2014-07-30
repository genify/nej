/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './element.js',
    '{lib}base/util.js',
    '{lib}base/platform.js'
],function(_h,_u,_m,_p,_o,_f,_r){
    // for ie9-
    NEJ.patch('TR<=5.0',function(){
        // cache background image
        try{document.execCommand('BackgroundImageCache',!1,!0);}catch(e){}
        /**
         * 注入样式
         * @param  {Node}   样式节点
         * @param  {String} 样式内容
         * @return {Void}
         */
        _h.__injectCSSText = (function(){
            var _max = 30;
            return _h.__injectCSSText._$aop(function(_event){
                var _element = _event.args[0];
                if (!_element.styleSheet) return;
                _event.stopped = !0;
                var _css = _event.args[1];
                // ie9- has 31 style/link limitation
                var _list = document.styleSheets;
                if (_list.length>_max){
                    // bad performance
                    _element = _list[_max];
                    _css = _element.cssText + _css;
                }else{
                    _element = _element.styleSheet;
                }
                _element.cssText = _css;
            });
        })();
        /**
         * 取待验证的样式正则表达式
         * @param  {String} 样式，多个以空格分隔
         * @return {RegExp} 正则表达式
         */
        _h.__getClassRegExp = (function(){
            var _reg = /\s+/g;
            return function(_class){
                _class = (_class||'').trim().replace(_reg,'|');
                return !_class?null:new RegExp('(\\s|^)(?:'+_class+')(?=\\s|$)','g');
            };
        })();
        /**
         * 操作样式
         * @param  {Node}   节点
         * @param  {String} 操作
         * @param  {String} 样式
         * @return {Void}
         */
        _h.__processClassName = function(_element,_type,_class){
            _class = _class||'';
            var _name = _element.className||'',
                _xreg = _h.__getClassRegExp(
                    _class+' '+(arguments[3]||'')
                );
            // remove all calss
            var _result = _name;
            if (!!_xreg){
                _result = _result.replace(_xreg,'');
            }
            // parse added class
            switch(_type){
                case 'remove': 
                    _class = ''; 
                break;
                case 'replace':
                    _class = arguments[3]||'';
                break;
            }
            // generate class result
            _result = (_result+' '+_class).trim();
            if (_name!=_result){
                _element.className = _result;
            }
        };
        /**
         * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
         * @param  {Node}    节点ID或者对象
         * @param  {String}  样式串
         * @return {Boolean} 是否含指定样式
         */
        _h.__hasClassName = function(_element,_class){
            var _xreg = _h.__getClassRegExp(_class);
            if (!!_xreg){
                return _xreg.test(_element.className||'');
            }
            return !1;
        };
    });
    // for ie8-
    NEJ.patch('TR<=4.0',function(){
        /**
         * 取样式值
         * @param  {String|Node} 节点
         * @param  {String}      样式名称
         * @return {Variable}    样式值
         */
        _h.__getStyleValue = (function(){
            var _reg0 = /opacity\s*=\s*([\d]+)/i;
            var _fmap = {
                // get opacity from filter:alpha(opacity=50)
                opacity:function(_style){
                    var _result = 0;
                    if (_reg0.test(_style.filter||'')){
                        _result = parseFloat(RegExp.$1)/100;
                    }
                    return _result;
                }
            };
            return function(_element,_name){
                var _current = _element.currentStyle,
                    _func = _fmap[_name];
                if (!!_func){
                    return _func(_current);
                }
                return _current[_h.__getStyleName(_name)]||'';
            };
        })();
        /**
         * 设置样式
         * @param  {String|Node} 节点
         * @param  {String}      样式名称
         * @param  {String}      样式值
         * @return {Void}
         */
        _h.__setStyleValue = (function(){
            var _fmap = {
                // opacity -> filter:alpha(opacity=50)
                opacity:function(_element,_value){
                    _element.style.filter = 'alpha(opacity='+_value*100+')';
                }
            };
            return function(_element,_name,_value){
                var _func = _fmap[_name];
                if (!!_func){
                    _func(_element,_value);
                }else{
                    _element.style[_h.__getStyleName(_name)] = _value;
                }
            };
        })();
        /**
         * 追加CSS规则
         * @param  {Node}    样式节点
         * @param  {String}  单条样式规则
         * @return {CSSRule} 样式规则对象
         */
        _h.__appendCSSText = function(_element,_css){
            var _sheet = _element.styleSheet,
                _length = _sheet.rules.length,
                _arr = _css.split(/[\{\}]/);
            _sheet.addRule(_arr[0],_arr[1],_length);
            return _sheet.rules[_length];
        };
    });
    
    return _h;
});