/*
 * ------------------------------------------
 * 选择助手控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$SelectHelper) return;
    /**
     * 选择助手控件<br />
     * 结构举例：
     * [code type="html"]
     *  <div id="xxx">
     *    <p>aaaaaaaaaaaaaa</p>
     *    <p>bbbbbbbbbbbbbb</p>
     *    <p>cccccccccccccc</p>
     *    <p>dddddddddddddd</p>
     *    <p>eeeeeeeeeeeeee</p>
     *    <p>ffffffffffffff</p>
     *    <p>gggggggggggggg</p>
     *  </div>
     * [/code]
     * 脚本举例
     * [code]
     *    nej.ut._$$SelectHelper._$allocate({
     *        parent:'xxx',
     *        loopable:!0,
     *        onchange:function(_event){
     *            // _event.last
     *            // _event.target
     *            console.log('selection change -> '+_event.target.innerText);
     *        },
     *        onselect:function(_event){
     *            // _event.target
     *            console.log('select -> '+_event.target.innerText);
     *        }
     *    });
     * [/code]
     * @class   {nej.ut._$$SelectHelper} 音频播放控件
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下所示
     * @config  {String|Node} parent   容器节点，从该容器开始往上遍历找到设置了tabindex大于1000的节点来响应键盘上下事件，找不到为document
     * @config  {String}      clazz    用于标识可选择的节点，不传则为body下的子节点
     * @config  {String}      selected 选中节点样式标识，默认为js-selected
     * @config  {String}      hover    鼠标移入样式标识，默认同selected，如果hover样式和selected不一样，确保selected样式优先级高于hover
     * @config  {Boolean}     loopable 是否允许循环选择
     * 
     * [hr]
     * 选择项变化触发事件
     * @event   {onchange}
     * @param   {Object} 选择信息
     * @config  {Node} target  当前选中项
     * @config  {Node} last    上次选中项
     * 
     * [hr]
     * 选中某项触发事件，用户敲回车或者鼠标单击选项时触发此事件
     * @event   {onselect}
     * @param   {Object} 选择信息
     * @config  {Node} target  当前选中项
     */
    _p._$$SelectHelper = NEJ.C();
    _pro = _p._$$SelectHelper._$extend(_p._$$Event);
    /**
     * 控件重置
     * @param  {Object} 配置信息
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__loop = !!_options.loopable;
        this.__parent = _e._$get(_options.parent);
        this.__selected = _options.selected||'js-selected';
        this.__hovered = _options.hover||this.__selected;
        this.__nopt = {};
        if (!!_options.clazz){
            this.__nopt.filter = 
                _e._$hasClassName.
                    _$bind2(_e,_options.clazz);
            this.__clazz = _options.clazz;
        }
        // init event
        this.__kbody = this.__getKeyBoardParent(
            this.__parent
        );
        this.__doInitDomEvent([[
            this.__kbody,'keydown',
            this.__doCheckKBAction._$bind(this)
        ],[
            this.__kbody,'enter',
            this.__doCheckKBEnter._$bind(this)
        ],[
            this.__parent,'click',
            this.__onCheckClick._$bind(this)
        ],[
            this.__parent,'mouseover',
            this.__onCheckHover._$bind(this)
        ],[
            this.__parent,'mouseleave',
            this.__onCheckLeave._$bind(this)
        ]]);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        delete this.__selected;
        delete this.__hovered;
        delete this.__parent;
        delete this.__kbody;
        delete this.__clazz;
        delete this.__nopt;
        delete this.__loop;
    };
    /**
     * 判断节点是否选项节点
     * @param  {Node}    节点
     * @return {Boolean} 是否选项
     */
    _pro.__isItemElement = function(_element){
        if (!!this.__clazz){
            return _e._$hasClassName(
                _element,this.__clazz
            );
        }
        return _element.parentNode==this.__parent;
    };
    /**
     * 取键盘检测节点
     * @return {Node} 节点
     */
    _pro.__getKeyBoardParent = (function(){
        var _max = 1000;
        return function(_element){
            while(_element.tabIndex<=_max){
                _element = _element.parentNode;
            }
            return _element||document;
        };
    })();
    /**
     * 根据样式取项节点
     * @return {Node} 节点
     */
    _pro.__getItemElement = function(_class){
        var _list = _e._$getByClassName(
            this.__parent,_class
        );
        return !_list?null:_list[0];
    };
    /**
     * 同步选中状态
     * @return {Void}
     */
    _pro.__doSyncSelection = function(_event,_class){
        // update state
        _e._$delClassName(_event.last,_class);
        _e._$addClassName(_event.target,_class);
        // trigger onselectionchange
        if (_class==this.__selected&&
            _event.last!=_event.target){
            this.__doScrollToView(_event.target);
            this._$dispatchEvent(
                'onchange',_event
            );
        }
    };
    /**
     * 节点滚动至可视区域
     * @return {Void}
     */
    _pro.__doScrollToView = function(_element){
        var _parent = _e._$getScrollViewPort(_element),
            _offset = _e._$offset(_element,_parent);
        // item out of top
        if (_offset.y-_parent.scrollTop<0){
            _parent.scrollTop = _offset.y;
            return;
        }
        // item out of bottom
        var _delta = _offset.y+
            _element.offsetHeight-_parent.clientHeight;
        if (_delta>_parent.scrollTop){
            _parent.scrollTop = _delta;
        }
    };
    /**
     * 解析选择状态
     * @return {Object} 状态信息
     */
    _pro.__doParseSelection = function(_event,_class){
        var _element = _v._$getElement(
            _event,this.__isItemElement._$bind(this)
        );
        return !_element?null:{
            last:this.__getItemElement(_class),
            target:_element
        };
    };
    /**
     * 触发键盘选择实践
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _pro.__doCheckKBAction = function(_event){
        var _code = _event.keyCode;
        // only for up and down
        if (_code!=38&&_code!=40) return;
        var _eopt = {
            last:this._$getSelectedNode()
        };
        // calculate last and target
        this.__nopt.backward = _code==38;
        var _list = !this.__clazz
                  ? _e._$getChildren(this.__parent)
                  : _e._$getByClassName(this.__parent,this.__clazz),
            _next = this.__nopt.backward
                  ? _list[_list.length-1]
                  : _list[0];
        if (!_eopt.last){
            _eopt.target = this.__getItemElement(
                this.__hovered
            )||_next;
        }else{
            _eopt.target = _e._$getSibling(
                _eopt.last,this.__nopt
            );
        }
        // check loop selection
        if (!_eopt.target){
            if (!this.__loop||_list.length<=1){
                return;
            }
            _eopt.target = _next;
        }
        this.__doSyncSelection(_eopt,this.__selected);
    };
    /**
     * 回车事件
     * @return {Void}
     */
    _pro.__doCheckKBEnter = function(_event){
        this._$dispatchEvent('onselect',{
            target:this._$getSelectedNode()
        });
    };
    /**
     * 点击事件
     * @return {Void}
     */
    _pro.__onCheckClick = function(_event){
        var _eopt = this.__doParseSelection(
            _event,this.__selected
        );
        if (!_eopt) return;
        this.__doSyncSelection(
            _eopt,this.__selected
        );
        this._$dispatchEvent('onselect',{
            target:_eopt.target
        });
    };
    /**
     * 鼠标移入事件
     * @return {Void}
     */
    _pro.__onCheckHover = function(_event){
        var _eopt = this.__doParseSelection(
            _event,this.__hovered
        );
        if (!_eopt) return;
        this.__doSyncSelection(
            _eopt,this.__hovered
        );
        this.__kbody.focus();
    };
    /**
     * 鼠标移出事件
     * @return {Void}
     */
    _pro.__onCheckLeave = function(_event){
        if (this.__hovered==this.__selected){
            return;
        }
        _e._$delClassName(
            this.__getItemElement(this.__hovered),
            this.__hovered
        );
    };
    /**
     * 取当前选中的节点
     * @return {Node} 当前选中节点
     */
    _pro._$getSelectedNode = function(){
        return this.__getItemElement(this.__selected);
    };
};
NEJ.define(
    '{lib}util/helper/select.js',[
    '{lib}util/event/event.js'
],f);