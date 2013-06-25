/*
 * ------------------------------------------
 * 建议提示控件封装实现文件
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
        _b = _('nej.p'),
        _p = _('nej.ut'),
        _proSuggest,
        _supSuggest;
    if (!!_p._$$Suggest) return;
    /**
     * 建议提示控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <style type="text/css">
     *       .box{position:relative;width:100px;}
     *       .xuanzhong{background:pink;}
     *       #suggest-input{height:24px;line-height:24px;}
     *       #card0{position:absolute;top:40px;left:0;width:100%;height:auto;background:#ccc;}
     *   </style>
     *   <div class="box">
     *       <input id="suggest-input"  type="text" />
     *       <div id="card0"></div>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   // 注意：一个页面只能有一个suggest控件，不然会有冲突
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _v = _('nej.v'),
     *       _p = _('nej.ut');
     *   var _ipt = _e._$get('suggest-input');
     *   var _card0 = _e._$get('card0');
     *   var _sg = _p._$$Suggest._$allocate({
     *       input:_ipt,
     *       body:'card0',
     *       selected:'xuanzhong',
     *       onchange:function(_value){
     *           var _item = '';
     *           for(var i = 1; i < 10;i++){
     *               _item += '<p>'+i+'</p>';
     *           }
     *           // 输入框改变，改变select的列表内容
     *           _card0.innerHTML = _item;
     *           // 设置选择内容
     *           _sg._$setList(_e._$getChildren(_card0));
     *       },
     *       onselect:function(_value){
     *           // 选择一个值的回调
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$Suggest} 建议提示控件
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Node|String} input    输入框
     * @config  {Node|String} body     提示卡片节点
     * @config  {String}      selected 提示项选中样式，默认为js-selected
     * 
     * [hr]
     * 
     * @event  {onchange} 输入内容变化触发事件
     * @param  {String}   输入框去前后空格后的内容
     * [hr]
     * 
     * @event  {onselect} 选中建议项触发事件
     * @param  {String}   节点的data-value值，没有则取节点的value
     */
    _p._$$Suggest = NEJ.C();
      _proSuggest = _p._$$Suggest._$extend(_p._$$Event);
      _supSuggest = _p._$$Suggest._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proSuggest.__reset = function(_options){
        this.__supReset(_options);
        this.__body  = _e._$get(_options.body);
        this.__input = _e._$get(_options.input);
        this.__selected = _options.selected||'js-selected';
        this.__index = 0;
        this.__doInitDomEvent([[
            this.__input,'input',
            this.__onInput._$bind(this)
        ],[
            this.__input,'focus',
            this.__onInput._$bind(this)
        ],[
            this.__input,'blur',
            this.__doFinishSelect._$bind(this, {type: 'blur'})
        ],[
            this.__body,'mouseover',
            this.__onMouseOver._$bind(this)
        ],[
            document,'keydown',
            this.__onKeyBoardSelect._$bind(this)
        ],[
            document,'keypress',
            this.__onKeyBoardEnter._$bind(this)
        ]]);
        // fix ie9 bug
        if (_b._$KERNEL.release=='5.0'){
            this.__doInitDomEvent([[
                this.__input,'keydown',
                this.__doHackIE9Input._$bind(this)
            ],[
                this.__input,'keyup',
                this.__doHackIE9Input._$bind(this)
            ]]);
        }
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proSuggest.__destroy = function(){
        this.__supDestroy();
        this.__doDestroyList();
        delete this.__selected;
        delete this.__input;
        delete this.__body;
        delete this.__hkie9;
        delete this.__hkie;
    };
    /**
     * 判断节点是否建议项
     * @protected
     * @method {__isSuggestItem}
     * @param  {Node}    节点
     * @return {Boolean} 是否建议项
     */
    _proSuggest.__isSuggestItem = function(_element){
        return _element.flag!=null;
    };
    /**
     * 销毁建议项列表
     * @protected
     * @method {__doDestroyList}
     * @return {Void}
     */
    _proSuggest.__doDestroyList = (function(){
        var _deFlag = function(_node){
            _u._$safeDelete(_node,'flag');
        };
        return function(){
            _u._$forEach(this.__list,_deFlag);
            delete this.__list;
            delete this.__index;
        };
    })();
    /**
     * 选择指定索引项
     * @protected
     * @method {__doSelectItem}
     * @param  {Number} 索引值
     * @return {Void}
     */
    _proSuggest.__doSelectItem = function(_index){
        if (this.__index===_index) 
            return;
        this.__index = _index;
        _e._$addClassName(this.__list
           [this.__index],this.__selected);
    };
    /**
     * 选择指定索引项
     * @protected
     * @method {__deSelectItem}
     * @param  {Number} 索引值
     * @return {Void}
     */
    _proSuggest.__deSelectItem = function(_index){
        if (this.__index!==_index)
            return;
        _e._$delClassName(this.__list
           [this.__index],this.__selected);
        delete this.__index;
    };
    /**
     * 结束选择
     * @protected
     * @method {__doFinishSelect}
     * @return {Void}
     */
    _proSuggest.__doFinishSelect = function(_options){
        if (!this.__list) return;
        var _item = this.__list[
                    this.__index]||
                    this.__list[0],
            _value = _e._$dataset(_item,'value')
                              ||_item.innerText;
        this.__input.value = _value;
        this._$setList();
        this.__hkie = !0;
        this._$dispatchEvent('onselect',_value);
        this.__hkie = !1;
    };
    /**
     * 失去焦点，隐藏推荐菜单
     * @return {Void}
     */
    _proSuggest.__onBlur = function(_event){
        this.__body.style.visibility = 'hidden';
    };
    /**
     * 输入内容变化触发事件
     * @protected
     * @method {__onInput}
     * @return {Void}
     */
    _proSuggest.__onInput = function(){
        var _value = this.__input.value.trim();
        if (!_value){
            this._$setList();
        }else{
            if (this.__hkie) return;
            this._$dispatchEvent('onchange',_value);
        }
    };
    /**
     * 鼠标移出建议项触发事件
     * @protected
     * @method {__onMouseOver}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proSuggest.__onMouseOver = function(_event){
        var _element = _v._$getElement(
                       _event,this.__isSuggestItem);
        if (!!_element){
            this.__deSelectItem(this.__index);
            this.__doSelectItem(_element.flag);
        } 
    };
    /**
     * 键盘上下键选择项触发事件
     * @protected
     * @method {__onKeyBoardSelect}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proSuggest.__onKeyBoardSelect = function(_event){
        var _flag = 0,
            _code = _event.keyCode;
        if (_code==38) _flag = -1;
        if (_code==40) _flag =  1;
        if (!_flag) return;
        _v._$stop(_event);
        var _index = Math.max(0,
                     Math.min(
                     this.__index+_flag,
                     this.__list.length-1));
        if (_index===this.__index) return;
        this.__deSelectItem(this.__index);
        this.__doSelectItem(_index);
    };
    /**
     * 键盘回车键选择项触发事件
     * @protected
     * @method {__onKeyBoardEnter}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proSuggest.__onKeyBoardEnter = function(_event){
        if (_event.keyCode==13) this.__doFinishSelect({type: 'enter'});
    };
    /**
     * IE9删除文字不触发onchange事件
     * @protected
     * @method {__doHackIE9Input}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proSuggest.__doHackIE9Input = function(_event){
        if (_event.type=='keydown'){
            this.__hkie9 = this.__input.value;
        }else if(this.__hkie9!=this.__input.value&&!!this.__list){
            this.__onInput();
        }
    };
    /**
     * 设置列表<br />
     * 脚本举例
     * [code]
     *  // _list是节点列表
     *   _sg._$setList(_list);
     * [/code]
     * @method {_$setList}
     * @param  {Array} 建议项节点列表
     * @return {nej.ut._$$Suggest}
     */
    _proSuggest._$setList = (function(){
        var _doFlag = function(_node,_index){
            _node.flag = _index;
        };
        return function(_list){
            this.__doDestroyList();
            if (!_list||!_list.length){
                this.__body.style.visibility = 'hidden';
                return this;
            } 
            this.__list = _list;
            var _index = _u._$indexOf(this.__list,function(_node){
                return _e._$hasClassName(_node,this.__selected);
            });
            this.__doSelectItem(Math.max(0,_index));
            _u._$forEach(this.__list,_doFlag);
            this.__body.style.visibility = 'visible';
            return this;
        };
    })();
};
NEJ.define('{lib}util/suggest/suggest.js',
          ['{lib}util/event.js'],f);