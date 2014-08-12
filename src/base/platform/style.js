/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/util.js',
    '{lib}base/platform.js'
],function(_u,_m,_p,_o,_f,_r){
    // variables
    var _ospt = _m._$SUPPORT,
        _opfx = _m._$KERNEL.prefix;
    /**
     * 指定名称是否在配置表中
     * @param  {String}  名称
     * @param  {Object}  配置表
     * @return {Boolean} 是否命中
     */
    _p.__isMatchedName = (function(){
        var _reg = /^([a-z]+?)[A-Z]/;
        return function(_name,_map){
            return !!(_map[_name]||(_reg.test(_name)&&_map[RegExp.$1]));
        };
    })();
    /**
     * 样式名称做前缀增强
     * @param  {String}  名称
     * @return {Boolean} 是否需要前缀增强
     */
    _p.__isNeedPrefixed = (function(){
        var _pmap = _u._$array2object([
            'animation','transform','transition',
            'appearance','userSelect','box','flex','column'
        ]);
        return function(_name){
            return _p.__isMatchedName(_name,_pmap);
        };
    })();
    /**
     * 格式化样式属性名称
     * border-width -> borderWidth
     * @param  {String} 样式样式名
     * @return {String} 格式化后样式名
     */
    _p.__fmtStyleName = (function(){
        var _reg = /-([a-z])/g;
        return function(_name){
            _name = _name||'';
            return _name.replace(_reg,function($1,$2){
                return $2.toUpperCase();
            });
        };
    })();
    /**
     * 针对样式名称做格式化及前缀增强
     * @param  {String} 样式名
     * @return {String} 增强后的样式名
     */
    _p.__getStyleName = (function(){
        var _reg = /^[a-z]/,
            _prefix = _opfx.css||'';
        return function(_name){
            _name = _p.__fmtStyleName(_name);
            if (!_p.__isNeedPrefixed(_name)){
                return _name;
            }
            // add prefix
            // userSelect -> webkitUserSelect
            return _prefix+_name.replace(_reg,function($1){
                return $1.toUpperCase();
            });
        };
    })();
    /**
     * 取样式值
     * @param  {String|Node} 节点
     * @param  {String}      样式名称
     * @return {Variable}    样式值
     */
    _p.__getStyleValue = function(_element,_name){
        var _current = window.getComputedStyle(_element,null);
        return _current[_p.__getStyleName(_name)]||'';
    };
    /**
     * 设置样式
     * @param  {String|Node} 节点
     * @param  {String}      样式名称
     * @param  {String}      样式值
     * @return {Void}
     */
    _p.__setStyleValue = function(_element,_name,_value){
        _element.style[_p.__getStyleName(_name)] = _value;
    };
    /**
     * 取样式变换矩阵对象
     * @param  {String}    变换信息
     * @return {CSSMatrix} 变换矩阵对象
     */
    _p.__getCSSMatrix = (function(){
        var _reg0 = /\((.*?)\)/,
            _reg1 = /\s*,\s*/,
            _klss = ['CSSMatrix',_opfx.clz+'CSSMatrix'],
            _list = ['m11','m12','m21','m22','m41','m42'];
        // matrix(1,2,3,4,5,6) 
        // -> {m11:1,m12:2,m21:3,m22:4,m41:5,m42:6}
        var _doParse = function(_matrix){
            var _obj = {};
            if (_reg0.test(_matrix||'')){
                // 11,12,21,22,41,42
                _u._$forEach(
                    RegExp.$1.split(_reg1),
                    function(_value,_index){
                        _obj[_list[_index]] = _value;
                    }
                );
            } 
            return _obj;
        };
        return function(_matrix){
            var _mtrx;
            _u._$forIn(_klss,function(_name){
                if (!!this[_name]){
                    _mtrx = new this[_name](_matrix||'');
                    return !0;
                }
            });
            return !_mtrx?_doParse(_matrix):_mtrx;
        };
    })();
    /**
     * 注入样式
     * @param  {Node}   样式节点
     * @param  {String} 样式内容
     * @return {Void}
     */
    _p.__injectCSSText = function(_style,_css){
        _style.textContent = _css;
    };
    /**
     * 对样式进行预处理
     * @param  {String} 待处理样式内容
     * @return {String} 处理后样式内容
     */
    _p.__processCSSText = (function(){
        var _reg0 = /\$<(.*?)>/gi,
            _reg1 = /\{(.*?)\}/g,
            _pfx = '-'+_opfx.css.toLowerCase()+'-',
            _2dmap = {
                scale:'scale({x|1},{y|1})',
                rotate:'rotate({a})',
                translate:'translate({x},{y})',
                matrix:'matrix({m11},{m12},{m21},{m22},{m41},{m42})'
            },
            _3dmap  = {
                scale:'scale3d({x|1},{y|1},{z|1})',
                rotate:'rotate3d({x},{y},{z},{a})',
                translate:'translate3d({x},{y},{z})',
                matrix:'matrix3d({m11},{m12},{m13},{m14},{m21},{m22},{m23},{m24},{m31},{m32},{m33|1},{m34},{m41},{m42},{m43},{m44|1})'
            };
        // merge template and data
        var _getTransformValue = function(_tpl,_map){
            _map = _map||_o;
            return _tpl.replace(_reg1,function($1,$2){
                var _arr = $2.split('|');
                return _map[_arr[0]]||_arr[1]||'0';
            });
        };
        // process transform value
        _p.__processTransformValue = function(_name,_data){
            var _tpl = (!_ospt.css3d?_2dmap:_3dmap)[_name.trim()];
            if (!!_tpl){
                return _getTransformValue(_tpl,_data);
            }
            return '';
        };
        return function(_css){
            _css = _css||'';
            if (!_css.replace){
                return _css;
            }
            return _css.replace(_reg0,function($1,$2){
                // prefix for css3
                if ($2==='vendor'){
                    return _pfx;
                }
                // parse 3D value
                var _arr = ($2||'').split('|');
                return _p.__processTransformValue(
                    _arr[0],_u._$query2object(_arr[1])
                )||$1;
            });
        };
    })();
    /**
     * 追加CSS规则
     * @param  {Node}    样式节点
     * @param  {String}  单条样式规则
     * @return {CSSRule} 样式规则对象
     */
    _p.__appendCSSText = function(_element,_css){
        var _sheet = _element.sheet,
            _length = _element.cssRules.length;
        _sheet.insertRule(_css,_length);
        return _sheet.cssRules[_length];
    };
    /**
     * 取待验证的样式列表
     * @param  {String} 样式，多个以空格分隔
     * @return {Array}  样式列表
     */
    _p.__getClassList = (function(){
        var _reg = /\s+/;
        return function(_class){
            _class = (_class||'').trim();
            return !!_class?_class.split(_reg):null;
        };
    })();
    /**
     * 操作样式
     * @param  {Node}   节点
     * @param  {String} 操作
     * @param  {String} 样式
     * @return {Void}
     */
    _p.__processClassName = function(_element,_type,_class){
        if (_type=='replace'){
            _p.__processClassName(
                _element,'remove',_class
            );
            _p.__processClassName(
                _element,'add',arguments[3]
            );
            return;
        }
        _u._$forEach(
            _p.__getClassList(_class),
            function(_clazz){
                _element.classList[_type](_clazz);
            }
        );
    };
    /**
     * 检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含
     * @param  {Node}    节点ID或者对象
     * @param  {String}  样式串
     * @return {Boolean} 是否含指定样式
     */
    _p.__hasClassName = function(_element,_class){
        var _list = _element.classList;
        if (!_list||!_list.length){
            return !1;
        }
        return _u._$indexOf(
            _p.__getClassList(_class),
            function(_clazz){
                return _list.contains(_clazz);
            }
        )>=0;
    };
    // for init
    (function(){
        if (!_ospt.css3d){
            var _matrix = _p.__getCSSMatrix();
            _ospt.css3d = !!_matrix&&_matrix.m41!=null;
        }
    })();
    
    return _p;
});
