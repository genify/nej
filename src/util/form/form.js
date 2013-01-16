/*
 * ------------------------------------------
 * WEB表单封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proWebForm;
    if (!!_p._$$WebForm) return;
    /**
     * WEB表单验证封装对象，HTML代码中支持以下属性配置：
     * [ntb]
     *   data-focus-mode | 0/1                   | 聚焦模式，仅在form节点上设置，见{#nej.e._$focus}
     *   data-auto-focus | true/false            | 自动聚焦项，多个表单项设置了该属性仅第一项有效
     *   data-counter     | true/false             | 是否需要显示计数信息，必须同时设置data-max-length或者maxlength
     *   data-message    | String                | 验证出错提示信息，多个提示信息可以通过配置或者回调事件定制提示内容
     *   data-tip        | String                | 默认提示信息，正常输入状态时的提示信息
     *   data-required   | true/false            | 必填项，对于checkbox/radio的required表示必须选中
     *   data-type       | url/email/date/number | 输入内容预订类型格式匹配
     *   data-pattern    | RegExp                | 正则匹配表达式，字符串格式
     *   data-min        | String/Number         | 输入值必须大于此设置，适用于number/date型
     *   data-max        | String/Number         | 输入值必须小于此设置，适用于number/date型
     *   data-max-length | Number                | 输入长度必须小于此设置，一个中文算两个字符，适用于text/textarea
     *   data-min-length | Number                | 输入长度必须大于此设置，一个中文算两个字符，适用于text/textarea
     *   maxlength       | Number                | 输入长度必须小于此设置，一个中文算一个字符，适用于text/textarea
     *   minlength       | Number                | 输入长度必须大于此设置，一个中文算一个字符，适用于text/textarea
     * [/ntb]
     * 
     * HTML示例代码：
     * [code type="html"]
     *   <!-- form节点添加data-focus-mode属性 -->
     *   <form id="webForm" data-focus-mode="1">
     *     <!-- 必须设置值 -->
     *     <input name="n00" type="text" 
     *            data-auto-focus="true" 
     *            data-required="true" 
     *            data-message="必须输入xxx！"
     *            data-tip="这是对xxx的说明！"/>
     *     <select name="n01" 
     *            data-required="true" 
     *            data-message="必须选择xxx！">
     *       <option>please select city</option>
     *       <option value="0">Hangzhou</option>
     *       <option value="1">Shanghai</option>
     *     </select>
     *     <input type="checkbox" 
     *            data-required="true" 
     *            data-message="必须同意xxx！"/>
     *     <input type="radio" 
     *            data-required="true" 
     *            data-message="必须选中xxx！"/>
     *     <!-- 输入URL地址、Email地址、日期、数字 -->
     *     <input name="n10" type="text" 
     *            data-type="url" data-message="URL地址不合法！"/>
     *     <input name="n11" type="text" 
     *            data-type="email" data-message="Email地址不合法！"/>
     *     <input name="n12" type="text" 
     *            data-type="date" data-message="日期格式不正确！"/>
     *     <input name="n12" type="text" 
     *            data-type="number" data-message="只能输入数字！"/>
     *     <!-- 正则匹配输入信息，注意pattern值必须符合正则表达式规则 -->
     *     <input name="n20" type="text" 
     *            data-pattern="^[\\d]+$" 
     *            data-message="输入内容必须符合xxx！"/>
     *     <!-- 限制输入长度 -->
     *     <input name="n30" type="text" 
     *            maxlength="100" data-message="长度超过限制！"/>
     *     <textarea name="n31" 
     *            maxlength="100" data-message="长度超过限制！"></textarea>
     *     <input name="n32" type="text" 
     *            data-max-length="100" data-message="长度超过限制！"/>
     *     <textarea name="n33" 
     *            data-max-length="100" data-message="长度超过限制！"></textarea>
     *     <input name="n34" type="text" 
     *            minlength="100" data-message="长度必须达到xxx！"/>
     *     <textarea name="n35" 
     *            minlength="100" data-message="长度必须达到xxx！"></textarea>
     *     <input name="n36" type="text" 
     *            data-min-length="100" data-message="长度必须达到xxx！"/>
     *     <textarea name="n37" 
     *            data-min-length="100" data-message="长度必须达到xxx！"></textarea>
     *     <!-- 限制最小值/最大值 -->
     *     <input name="n40" type="text" 
     *            data-type="number" data-min="10"/>
     *     <input name="n41" type="text" 
     *            data-type="number" data-max="100"/>
     *     <input name="n42" type="text" 
     *            data-type="number" data-min="10" data-max="100"/>
     *     <input name="n43" type="text" 
     *            data-type="date" data-min="2010-08-10"/>
     *     <input name="n44" type="text" 
     *            data-type="date" data-max="now"/>
     *     <input name="n45" type="text" 
     *            data-type="date" data-min="now" data-max="2050-10-10"/>
     *   </form>
     * [/code]
     * 
     * 简单应用示例代码：
     * [code]
     *   // 分配表单验证控件实例
     *   var _form = nej.ut._$$WebForm._$allocate({
     *       form:'webForm',
     *       message:{
     *           'password-1':'必须输入密码！',
     *           'password100':'密码强度不够',
     *           'password101':'两次密码不一致',
     *           'pass':'<span class="pass">ok</span>'
     *       }
     *   });
     *   
     *   // 验证表单后提交
     *   if (_form._$checkValidity())
     *       _form._$submit();
     *       
     *   // 或者在验证完表单的配置项后再做表单的其他项验证
     *   if (_form._$checkValidity()){
     *       // TODO other form check
     *       // 验证过程可以调用一下接口显示错误信息
     *       // _form._$showMsgError('n30','invalid message！');
     *       // 验证过程可以调用一下接口显示通过信息
     *       // _form._$showMsgPass('n31','ok！');
     *       _form._$submit();
     *       // 使用ajax请求的话可以通过_form._$data()获取表单信息
     *       doAjaxRequest('/api/form',_form._$data());
     *   }
     * [/code]
     * 
     * 通过回调自定义提示信息示例代码：
     * [code]
     *   var _form = nej.ut._$$WebForm._$allocate({
     *       form:'webForm',
     *       oninvalid:function(_event){
     *           // check _event.target and _event.code
     *           if (_event.target.name=='password'&&_event.code==-1){
     *               // 通过设置_event.value设置提示信息
     *               _event.value = '必须输入密码！';
     *           }
     *           // TODO other check
     *       },
     *       onvalid:function(_event){
     *           // 自定义验证通过提示信息，对应的节点信息_event.target
     *           _event.value = '<span class="pass">pass</span>'
     *       }
     *   });
     * [/code]
     * 
     * 通过回调自定义验证规则示例代码：
     * [code]
     *   var _form = nej.ut._$$WebForm._$allocate({
     *       form:'webForm',
     *       oncheck:function(_event){
     *           // check _event.target
     *           if (_event.target.name=='password'){
     *               // 通过_event.value返回验证结果
     *               // 验证结果必须大于0的值（保留所有小于0的返回值）
     *               _event.value = doCheckPassword(_event.target.value); // 100
     *           }
     *           // TODO other check
     *       },
     *       oninvalid:function(_event){
     *           // check _event.target and _event.code
     *           if (_event.target.name=='password'&&_event.code==100){
     *               // 通过设置_event.value设置提示信息
     *               _event.value = '密码强度太弱！';
     *           }
     *           // TODO other check
     *       }
     *   });
     * [/code]
     * 
     * @class   {nej.ut._$$WebForm}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object}      配置参数
     * @config  {String|Node} form    表单节点
     * @config  {String}      invalid 验证未通过时添加在表单元素上的样式名称，默认为js-invalid
     * @config  {String}      holder  如果有placeholder，则可以指定样式名称，默认为js-placeholder
     * @config  {String}      focus   如果有聚焦效果，则可以通过指定该样式名称，默认为js-focus
     * @config  {String}      tip     提示信息效果样式名称，默认为js-tip
     * @config  {String}      pass    提示信息效果样式名称，默认为js-pass
     * @config  {String}      error   提示信息效果样式名称，默认为js-error
     * @config  {Object}      type    类型验证扩展，主要扩展data-type值的验证规则，{type:regexp,type:function}
     * @config  {Object}      attr    验证属性扩展，主要扩展自定义data-xxx的验证规则，{attr:function}
     * @config  {Object}      message 提示信息内容，{key:value}<br/>
     *                                错误信息key规则：节点名称+错误代码，
     *                                如 'username-1':'必须输入用户名！'
     *                                表示username输入框没有输入内容时错误提示信息为'必须输入用户名！'<br/>
     *                                默认错误信息key规则：节点名称+'-error'，如username-error<br/>
     *                                提示信息key规则：节点名称+'-tip'，如username-tip<br/>
     *                                成功信息key规则：节点名称+'-pass'，如username-pass<br/>
     *                                默认成功信息key：pass
     * [hr]
     * 对于无法通过配置验证的控件会回调外界辅助验证
     * @event   {oncheck}
     * @param   {Object} 验证基本信息
     * @config  {Node}   target 当前验证节点
     * @config  {Number} value  验证返回结果
     * 
     * [hr]
     * 验证未通过触发事件，错误类型对照表
     * [ntb]
     *   -1  | value missing, if the element has no value but is a required field
     *   -2  | type mismatch, if the element's value is not in the correct syntax, email, url
     *   -3  | pattern mismatch, if the element's value doesn't match the provided pattern
     *   -4  | too long, if the element's value is longer than the provided maximum length
     *   -5  | too short, if the element's value is shorter than the provided minimum length
     *   -6  | range underflow, if the element's value is lower than the provided minimum
     *   -7  | range overflow, if the element's value is higher than the provided maximum
     * [/ntb]
     * @event   {oninvalid}
     * @param   {Object} 验证基本信息
     * @config  {Node}   target 当前验证节点
     * @config  {Number} code   错误标识
     * 
     * [hr]
     * 通过验证提示信息
     * @event   {onvalid}
     * @param   {Object} 验证基本信息
     * @config  {Node}   target 当前验证节点
     */
    _p._$$WebForm = NEJ.C();
      _proWebForm = _p._$$WebForm._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proWebForm.__init = function(){
        this.__supInit();
        this.__wopt = {
            tp:{nid:'js-nej-tp'},
            ok:{nid:'js-nej-ok'},
            er:{nid:'js-nej-er'}
        };
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proWebForm.__reset = function(_options){
        this.__supReset(_options);
        this.__form = document.forms[_options.form]||
                     _e._$get(_options.form);
        this.__message = _options.message||{};
        // focus options
        var _mode = this.__dataset(
                    this.__form,'focusMode',1);
        if (!isNaN(_mode)){
            this.__fopt = {
                mode:_mode,
                clazz:_options.focus
            }
        }
        // save class name
        this.__holder = _options.holder;
        this.__wopt.tp.clazz = 'js-mhd '+(_options.tip||'js-tip');
        this.__wopt.ok.clazz = 'js-mhd '+(_options.pass||'js-pass');
        this.__wopt.er.clazz = 'js-mhd '+(_options.error||'js-error');
        this.__invalid = _options.invalid||'js-invalid';
        // init valid rule
        this.__doInitValidRule(_options);
        // refresh validate node
        this._$refresh();
        // auto focus node
        if (!!this.__fnode) 
            this.__fnode.focus();
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proWebForm.__destroy = function(){
        this.__supDestroy();
        delete this.__message;
        delete this.__fnode;
        delete this.__vinfo;
        delete this.__form;
        delete this.__treg;
        delete this.__vfun;
    };
    /**
     * 取节点自定义数据值
     * @protected
     * @method {__dataset}
     * @param  {String} 自定义属性名
     * @param  {Number} 类型，0-字符，1-数值，2-布尔，3-日期
     * @return {String} 值 
     */
    _proWebForm.__dataset = function(_node,_attr,_type){
        var _value = _e._$dataset(_node,_attr);
        switch(_type){
            case 1: return parseInt(_value);
            case 2: return (_value||'').toLowerCase()=='true';
            case 3: return this.__doParseDate(_value);
        }
        return _value;
    };
    /**
     * 根据类型转数值
     * @protected
     * @method {__number}
     * @param  {String} 值
     * @param  {String} 类型
     * @return {Number} 数值
     */
    _proWebForm.__number = function(_value,_type){
        if (_type=='date')
            return this.__doParseDate(_value);
        return parseInt(_value);
    };
    /**
     * 判断节点是否需要验证
     * @protected
     * @method {__isValidElement}
     * @param  {Node}    节点
     * @return {Boolean} 是否需要验证
     */
    _proWebForm.__isValidElement = (function(){
        var _reg1 = /^button|submit|reset|image|hidden|file$/i;
        return function(_node){
            // with name attr
            // not button
            _node = this._$get(_node)||_node;
            var _type = _node.type;
            return !!_node.name&&
                    !_reg1.test(_node.type||'');
        };
    })();
    /**
     * 解析日期值
     * @protected
     * @method {__doParseDate}
     * @param  {String} 日期字符串
     * @return {Number} 日期毫秒数
     */
    _proWebForm.__doParseDate = (function(){
        // yyyy-MM-dd --> MM/dd/yyyy
        var _reg = /[-\/]/;
        var _doFormatDate = function(_value){
            if (!_value) return '';
            _value = _value.split(_reg);
            _value.push(_value.shift());
            return _value.join('/');
        };
        return function(_value){
            if ((_value||'').toLowerCase()=='now')
                return +new Date;
            return Date.parse(_doFormatDate(_value));
        };
    })();
    /**
     * 解析字符类型规则属性
     * @protected
     * @method {__doCheckString}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckString = function(_id,_name){
        var _rule = this.__vfun[_name],
            _value = this.__dataset(_id,_name);
        if (!_value||!_rule) return;
        this.__doPushValidRule(_id,_rule);
        this.__doSaveValidInfo(_id,_name,_value);
    };
    /**
     * 解析正则类型规则属性
     * @protected
     * @method {__doCheckPattern}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckPattern = function(_id,_name){
        try{
            var _pattern = this.__dataset(_id,_name);
            if (!_pattern) return;
            var _value = new RegExp(_pattern);
            this.__doSaveValidInfo(_id,_name,_value);
            this.__doPushValidRule(_id,this.__vfun[_name]);
        }catch(e){
            // ignore exception
        }
    };
    /**
     * 解析布尔类型规则属性
     * @protected
     * @method {__doCheckBoolean}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckBoolean = function(_id,_name){
        var _rule = this.__vfun[_name];
        if (!!_rule&&
            this.__dataset(_id,_name,2))
            this.__doPushValidRule(_id,_rule);
    };
    /**
     * 解析数值类型规则属性
     * @protected
     * @method {__doCheckNumber}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @param  {String} 规则值
     * @return {Void}
     */
    _proWebForm.__doCheckNumber = function(_id,_name,_value){
        _value = parseInt(_value);
        if (isNaN(_value)) return;
        this.__doSaveValidInfo(_id,_name,_value);
        this.__doPushValidRule(_id,this.__vfun[_name]);
    };
    /**
     * 解析dataset中数值类型规则属性
     * @protected
     * @method {__doCheckDSNumber}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckDSNumber = function(_id,_name){
        this.__doCheckNumber(
             _id,_name,this.__dataset(_id,_name));
    };
    /**
     * 解析属性中数值类型规则属性
     * @protected
     * @method {__doCheckATNumber}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckATNumber = function(_id,_name){
        this.__doCheckNumber(
              _id,_name,_e._$attr(_id,_name));
    };
    /**
     * 解析dataset中数值类型规则属性
     * @protected
     * @method {__doCheckTPNumber}
     * @param  {String} 规则标识
     * @param  {String} 规则属性
     * @return {Void}
     */
    _proWebForm.__doCheckTPNumber = function(_id,_name,_type){
        var _value = this.__number(
                     this.__dataset(_id,_name),
                     this.__dataset(_id,'type'));
        this.__doCheckNumber(_id,_name,_value);
    };
    /**
     * 准备表单元素验证信息
     * @protected
     * @method {__doPrepareElement}
     * @param  {Node} 表单元素节点
     * @return {Void}
     */
    _proWebForm.__doPrepareElement = (function(){
        var _reg0 = /^input|textarea$/i;
        // onfocus
        var _onFocus = function(_event){
            this._$showTip(_v._$getElement(_event));
        };
        // onblur
        var _onBlur = function(_event){
            this.__doCheckValidity(_v._$getElement(_event));
        };
        return function(_node){
            // check auto focus node
            if (this.__dataset(
                      _node,'autoFocus',2))
                this.__fnode = _node;
            // check placeholder
            if (!!_e._$attr(_node,'placeholder'))
                _e._$placeholder(_node,this.__holder);
            // check focus
            if (!!this.__fopt&&
                _reg0.test(_node.tagName))
                _e._$focus(_node,this.__fopt);
            // check validate condition
            var _id = _e._$id(_node);
            // type check
            // pattern check
            // required check
            // max length
            // min length
            // cn max length
            // cn min length
            // min value check
            // max value check
            this.__doCheckBoolean(_id,'required');
            this.__doCheckString(_id,'type');
            this.__doCheckPattern(_id,'pattern');
            this.__doCheckATNumber(_id,'maxlength');
            this.__doCheckATNumber(_id,'minlength');
            this.__doCheckDSNumber(_id,'maxLength');
            this.__doCheckDSNumber(_id,'minLength');
            this.__doCheckTPNumber(_id,'min');
            this.__doCheckTPNumber(_id,'max');
            // save message content
            var _name = _node.name;
            this.__message[_name+'-tip'] = this.__dataset(_node,'tip');
            this.__message[_name+'-error'] = this.__dataset(_node,'message');
            this._$showTip(_node);
            // node counter
            var _info = this.__vinfo[_id],
                _data = (_info||_o).data,
                _need = this.__dataset(_node,'counter',2);
            if (_need&&(_data.maxlength||_data.maxLength)){
                _e._$counter(_id,{nid:this.__wopt.tp.nid});
            }
            // node need validate
            if (!!_info&&_reg0.test(_node.tagName)){
                this.__doInitDomEvent([
                    [_node,'focus',_onFocus._$bind(this)],
                    [_node,'blur',_onBlur._$bind(this)]
                ]);
            }
        };
    })();
    /**
     * 初始化验证规则
     * @protected
     * @method {__doInitValidRule}
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _proWebForm.__doInitValidRule = (function(){
        // type regexp map
        var _rmap = {
                number:/^[\d]+$/i,
                // xxx://xx.xx.xx/a/b
                url:/^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i,
                // xxx@xx.xx.xxx
                email:/^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i,
                // xx-x-xx or xxxx-xx-x
                date:function(v){
                    return !v||!isNaN(this.__doParseDate(v));
                }
            };
        // validate function map
        var _vfun = {
            // value require for text
            // checked require for checkbox or radio
            required:function(_node){
                var _type = _node.type,
                    _novalue = !_node.value,
                    _nocheck = (_type=='checkbox'||
                                _type=='radio')&&!_node.checked;
                if (_nocheck||_novalue) return -1;
            },
            // type supported in _regmap
            type:function(_node,_options){
                var _reg = this.__treg[_options.type],
                    _val = _node.value.trim(),
                    _tested = !!_reg.test&&!_reg.test(_val),
                    _funced = _u._$isFunction(_reg)&&!_reg.call(this,_val);
                if (_tested||_funced) return -2;
            },
            // pattern check
            pattern:function(_node,_options){
                if (!_options.pattern.test(_node.value))
                    return -3;
            },
            // maxlength check
            maxlength:function(_node,_options){
                if (_node.value.length>_options.maxlength)
                    return -4;
            },
            // minlength check
            minlength:function(_node,_options){
                if (_node.value.length<_options.minlength)
                    return -5;
            },
            // data-max-length check
            maxLength:function(_node,_options){
                if (_u._$length(_node.value)>_options.maxLength)
                    return -4;
            },
            // data-min-length check
            minLength:function(_node,_options){
                if (_u._$length(_node.value)<_options.minLength)
                    return -5;
            },
            // min value check
            min:function(_node,_options){
                var _number = this.__number(
                    _node.value,_options.type);
                if (isNaN(_number)||
                   _number<_options.min)
                    return -6;
            },
            // max value check
            max:function(_node,_options){
                var _number = this.__number(
                    _node.value,_options.type);
                if (isNaN(_number)||
                   _number>_options.max)
                    return -7;
            }
        };
        return function(_options){
            this.__treg = NEJ.X(NEJ.X({},
                         _rmap),_options.type);
            this.__vfun = NEJ.X(NEJ.X({},
                         _vfun),_options.attr);
        };
    })();
    /**
     * 添加验证规则
     * @protected
     * @method {__doPushValidRule}
     * @param  {String}   规则标识
     * @param  {Function} 验证规则
     * @return {Void}
     */
    _proWebForm.__doPushValidRule = function(_id,_valid){
        if (!_u._$isFunction(_valid)) return;
        var _info = this.__vinfo[_id];
        if (!_info||!_info.func){
            _info = _info||{};
            _info.func = [];
            this.__vinfo[_id] = _info;
        }
        _info.func.push(_valid);
    };
    /**
     * 缓存验证信息
     * @protected
     * @method {__doSaveValidInfo}
     * @param  {String}   验证标识
     * @param  {String}   信息标识
     * @param  {Variable} 信息内容
     * @return {Void}
     */
    _proWebForm.__doSaveValidInfo = function(_id,_name,_value){
        if (!_name) return;
        var _info = this.__vinfo[_id];
        if (!_info||!_info.data){
            _info = _info||{};
            _info.data = {};
            this.__vinfo[_id] = _info;
        }
        _info.data[_name] = _value;
    };
    /**
     * 验证节点
     * @protected
     * @method {__doCheckValidity}
     * @param  {String|Node} 节点
     * @return {Boolean}     是否通过验证
     */
    _proWebForm.__doCheckValidity = function(_node){
        // check node validate
        _node = this._$get(_node)||_node;
        var _info = this.__vinfo[_e._$id(_node)];
        if (!_node||!_info||
            !this.__isValidElement(_node)) 
            return !0;
        var _result;
        // check condition
        _u._$forIn(_info.func,
            function(_func){
                _result = _func.call(this,_node,_info.data);
                return _result!=null;
            },this);
        // check custom validate
        if (_result==null){
            var _event = {target:_node};
            this._$dispatchEvent('oncheck',_event);
            _result = _event.value;
        }
        // dispatch validate event
        var _event = {target:_node};
        if (_result!=null){
            _event.code = _result;
            this._$dispatchEvent('oninvalid',_event);
            if (!_event.stopped){
                this._$showMsgError(_node,_event.value||
                    this.__message[_node.name+_result]);
            }
        }else{
            this._$dispatchEvent('onvalid',_event);
            if (!_event.stopped)
                this._$showMsgPass(_node,_event.value);
        }
        return _result==null;
    };
    /**
     * 显示信息
     * @protected
     * @method {__doShowMessage}
     * @param  {String|Node} 表单元素节点
     * @param  {String}      显示信息
     * @param  {String}      信息类型
     * @return {Void}
     */
    _proWebForm.__doShowMessage = (function(){
        var _getVisible = function(_type1,_type2){
            return _type1==_type2?'visible':'hidden';
        };
        var _getHolder = function(_node,_type){
            var _holder;
            if (_type=='tp')
                _holder = _e._$get(_node.name+'-tip');
            if (!_holder)
                _holder = _e._$wrapInline(_node,this.__wopt[_type]);
            return _holder;
        };
        return function(_node,_message,_type){
            _node = this._$get(_node)||_node;
            if (!_node) return;
            _type=='er' ? _e._$addClassName(_node,this.__invalid)
                        : _e._$delClassName(_node,this.__invalid);
            // set message content
            if (!!_message)
                _getHolder.call(this,_node,_type).innerHTML = _message;
            // show message node
            _u._$forIn(this.__wopt,
                function(_value,_key){
                    _e._$setStyle(
                        _getHolder.call(this,_node,_key),
                        'visibility',
                        _getVisible(_type,_key)
                    );
                },this);
        };
    })();
    /**
     * 显示提示信息
     * @method {_$showTip}
     * @param  {String|Node} 表单元素节点或者名称
     * @param  {String}      显示信息
     * @return {nej.ut._$$WebForm}
     */
    _proWebForm._$showTip = function(_node,_message){
        this.__doShowMessage(_node,_message||
            this.__message[_node.name+'-tip'],'tp');
        return this;
    };
    /**
     * 显示验证通过信息
     * @method {_$showMsgPass}
     * @param  {String|Node} 表单元素节点或者名称
     * @param  {String}      显示信息
     * @return {nej.ut._$$WebForm}
     */
    _proWebForm._$showMsgPass = function(_node,_message){
        this.__doShowMessage(_node,_message||
            this.__message[_node.name+'-pass']||
            this.__message.pass,'ok');
        return this;
    };
    /**
     * 显示错误信息
     * @method {_$showMsgError}
     * @param  {String|Node} 表单元素节点或者名称
     * @param  {String}      显示信息
     * @return {nej.ut._$$WebForm}
     */
    _proWebForm._$showMsgError = function(_node,_message){
        this.__doShowMessage(_node,_message||
            this.__message[_node.name+'-error'],'er');
        return this;
    };
    /**
     * 设置表单控件值
     * @method {_$setValue}
     * @param  {String} 表单控件名称
     * @param  {String} 值
     * @return {Void}
     */
    _proWebForm._$setValue = (function(){
        var _reg0 = /^(?:radio|checkbox)$/i;
        // get value
        var _getValue = function(_value){
            return _value==null?'':_value;
        };
        // set node value
        var _doSetValue = function(_value,_node){
            if (_reg0.test(_node.type||'')){
                // radio/checkbox
                _node.checked = _value==_node.value;
            }else{
                // other
                _node.value = _getValue(_value);
            }
        };
        return function(_name,_value){
            var _node = this._$get(_name);
            if (!_node) return this;
            if (!_node.length){
                // for node
                _doSetValue(_value,_node);
            }else{
                // for node list
                _u._$forEach(
                    _node,
                    _doSetValue._$bind(null,_value)
                );
            }
            return this;
        };
    })();
    /**
     * 取指定名称的表单控件对象
     * @method {_$get}
     * @param  {String} 控件名称
     * @return {Node}   表单控件对象
     */
    _proWebForm._$get = function(_name){
        return this.__form.elements[_name];
    };
    /**
     * 取当前表单节点
     * @method {_$form}
     * @return  {Node} 当前封装的表单节点
     */
    _proWebForm._$form = function(){
        return this.__form;
    };
    /**
     * 取表单数据
     * @method {_$data}
     * @return {Object} 数据集合
     */
    _proWebForm._$data = (function(){
        var _reg0 = /^radio|checkbox$/i,
            _reg1 = /^number|date$/;
        var _doParseValue = function(_map,_node){
            var _name = _node.name,
                _value = _node.value,
                _info = _map[_name],
                _type = this.__dataset(_node,'type');
            // parse value
            if (_reg1.test(_type))
                _value = this.__number(_value,_type);
            // checkbox and radio
            if (_reg0.test(_node.type)&&!_node.checked){
                _value = this.__dataset(_node,'value');
                if (!_value) return;
            }
            // if name exist
            if (!!_info){
                if (!_u._$isArray(_info)){
                    _info = [_info];
                    _map[_name] = _info;
                }
                _info.push(_value);
            }else{
                _map[_name] = _value;
            }
        };
        return function(){
            var _result = {};
            _u._$forEach(
                this.__form.elements,
                function(_node){
                    if (this.__isValidElement(_node))
                        _doParseValue.call(this,_result,_node);
                },this);
            return _result;
        };
    })();
    /**
     * 重置表单
     * @method {_$reset}
     * @return {nej.ut._$$WebForm}
     */
    _proWebForm._$reset = function(){
        this.__form.reset();
        return this;
    };
    /**
     * 提交表单
     * @method {_$submit}
     * @return {nej.ut._$$WebForm}
     */
    _proWebForm._$submit = function(){
        this.__form.submit();
        return this;
    };
    /**
     * 刷新验证信息
     * @method {_$refresh}
     * @return {nej.ut._$$WebForm} 
     */
    _proWebForm._$refresh = (function(){
        var _doPrepareElement = function(_node){
            if (this.__isValidElement(_node)) 
                this.__doPrepareElement(_node);
        };
        return function(){
            // id:{func:[],data:{}}
            // func  - validate function list
            // data  - validate information
            this.__vinfo = {};
            _u._$forEach(this.__form.elements,
                        _doPrepareElement,this);
            return this;
        };
    })();
    /**
     * 验证表单或者表单控件
     * @method {_$checkValidity}
     * @param  {String|Node} 表单控件，没有输入表示验证整个表单
     * @return {Boolean}     表单是否通过验证
     */
    _proWebForm._$checkValidity = function(_node){
        _node = this._$get(_node)||_node;
        // check single form element
        if (!!_node)
            return this.__doCheckValidity(_node);
        // check all form elements
        var _result = !0;
        _u._$forEach(
            this.__form.elements,
            function(_node){
                var _pass = this._$checkValidity(_node);
                _result = _result&&_pass;
            },this);
        return _result;
    };
};
define('{lib}util/form/form.js',
      ['{lib}base/util.js'
      ,'{lib}util/event.js'
      ,'{lib}util/counter/counter.js'
      ,'{lib}util/placeholder/placeholder.js'],f);