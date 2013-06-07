/*
 * ------------------------------------------
 * 窗体基本行为封装对象实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _n = _('nej.n'),
        _t = _('nej.ut'),
        _x = _('nej.cef'),
        _p = _('nej.cef.ut'),
        _s = _('window.os'),
        _proWindow;
    /**
     * 窗体基本行为封装对象，窗体调整区域大小节点集合标识： 
     * [ntb]
     *   名称                            |  描述
     *   ------------------------------
     *   left         |  左边框拉伸与收缩节点
     *   right        |  右边框拉伸与收缩节点
     *   top          |  上边框拉伸与收缩节点
     *   bottom       |  下边框拉伸与收缩节点
     *   topleft      |  左上角拉伸与收缩节点
     *   topright     |  右上角拉伸与收缩节点
     *   bottomleft   |  左下角拉伸与收缩节点
     *   bottomright  |  右下角拉伸与收缩节点
     * [/ntb]
     * 
     * @class   {nej.cef.ut._$$Window}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String|Node} min     最小化按钮节点
     * @config  {String|Node} max     最大化按钮节点
     * @config  {String|Node} dbmax   双击最大化节点
     * @config  {String|Node} close   关闭按钮节点
     * @config  {String|Node} dragger 窗体拖拽节点
     * @config  {Object}      resizes 窗体调整大小节点集合，格式如：{left:'left-node'}
     * @config  {String}      clazz   可最大化时按钮的样式，默认js-max
     * 
     * [hr]
     * 最小化之前触发事件
     * @event  {onbeforemin}
     * @param  {Object} 事件信息
     * 
     * [hr]
     * 最小化之后触发事件
     * @event  {onaftermin}
     * @param  {Object} 事件信息
     * 
     * [hr]
     * 最大化之前触发事件
     * @event  {onbeforemax}
     * @param  {Object} 事件信息

     * [hr]
     * 最大化之后触发事件
     * @event  {onaftermax}
     * @param  {Object} 事件信息
     * 
     * [hr]
     * 关闭之前触发事件
     * @event  {onbeforeclose}
     * @param  {Object} 事件信息

     * [hr]
     * 关闭之后触发事件
     * @event  {onafterclose}
     * @param  {Object} 事件信息
     * 
     * 
     * 
     * 
     */
    _p._$$Window = NEJ.C();
      _proWindow = _p._$$Window._$extend(_t._$$Event);
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proWindow.__reset = function(_options){
        this.__supReset(_options);
        this.__maxcls = _options.clazz||'js-max';
        // init action
        var _arr = [[
            _options.min,'click',
            this.__onActionMin._$bind(this)
        ],[
            _options.max,'click',
            this.__onActionMax._$bind(this)
        ],[
            _options.dbmax,'dblclick',
            this.__onActionMax._$bind(this)
        ],[
            _options.close,'click',
            this.__onActionClose._$bind(this)
        ],[
            _options.dragger,'mousedown',
            this.__onActionDraggerStart._$bind(this)
        ],[
            _options.dragger,'mousemove',
            this.__onActionDraggerCheck._$bind(this)
        ]];
        this.__nmax = _e._$get(_options.max); 
        // init resizer
        this.__nodes = _options.resizes||{};
        _u._$forIn(
            _options.resizes,
            function(_node,_key){
                _arr.push([
                    _node,'mousedown',
                    this.__onActionResize._$bind(this,_key)
                ]);
            },this
        );
        this.__doInitDomEvent(_arr);
        this.__doUpdateMaxState(_s.hasFullScreenWindow());
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _proWindow.__destroy = function(){
        this.__supDestroy();
        delete this.__nodes;
        delete this.__maxcls;
    };
    /**
     * 最小化行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionMin = function(_event){
        _v._$stop(_event);
        this._$dispatchEvent('onbeforemin');
        this._$min();
        this._$dispatchEvent('onaftermin');
    };
    /**
     * 更新最大化状态
     * @param  {Boolean} 是否最大化状态
     * @return {Void}
     */
    _proWindow.__doUpdateMaxState = function(_max){
        if (!this.__nmax) return;
        if (!!_max){
            this.__nmax.title = '向下还原';
            _e._$delClassName(this.__nmax,this.__maxcls);
        }else{
            this.__nmax.title = '最大化';
            _e._$addClassName(this.__nmax,this.__maxcls);
        }
    };
    /**
     * 最大化行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionMax = function(_event){
        _v._$stop(_event);
        var _cmd,_node = _v._$getElement(_event);
        if (_e._$hasClassName(this.__nmax,this.__maxcls)){
            // do max action
            _cmd = 'maximize';
            this.__doUpdateMaxState(!0);
        }else{
            // do restore action
            _cmd = 'restore';
            this.__doUpdateMaxState(!1);
        }
        var _event = {action:_cmd};
        this._$dispatchEvent('onbeforemax',_event);
        _n._$exec('winhelper.showWindow',_cmd);
        this._$dispatchEvent('onaftermax',_event);
    };
    /**
     * 关闭行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionClose = function(_event){
        _v._$stop(_event);
        var _event = {};
        this._$dispatchEvent('onbeforeclose',_event);
        if (!!_event.close){
            // do close action
            _x._$exit();
            //window.close();
        }else{
            // do hide action
            _x._$hideWindow();
        }
        this._$dispatchEvent('onafterclose',_event);
    };
    /**
     * 拖拽行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionDraggerStart = function(_event){
        var _node = _v._$getElement(_event,'d:draggable');
        if (!!_node&&_e._$dataset(_node,'draggable')=='false') 
            return;
        this.__reqdrg = !0;
    };
    /**
     * 拖拽行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionDraggerCheck = function(_event){
        if (!this.__reqdrg) 
            return;
        this.__reqdrg = !1;
        _n._$exec('winhelper.dragWindow');
    };
    /**
     * 调整窗体大小行为事件
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proWindow.__onActionResize = function(_key,_event){
        var _node = _v._$getElement(_event);
        if (_node!=_e._$get(this.__nodes[_key])) return;
        _n._$exec('winhelper.sizeWindow',_key);
    };
    /**
     * 最小化窗体
     * @return {Void}
     */
    _proWindow._$min = function(){
        _n._$exec('winhelper.showWindow','minimize');
    };
    /**
     * 最大化窗体
     * @return {Void}
     */
    _proWindow._$max = function(){
        _n._$exec('winhelper.showWindow','maximize');
    };
    /**
     * 还原窗体
     * @return {Void}
     */
    _proWindow._$restore = function(){
        _n._$exec('winhelper.showWindow','restore');
    };
    /**
     * 关闭窗体
     * @return {Void}
     */
    _proWindow._$close = function(){
        this.__onActionClose();
    };
};
NEJ.define('{lib}native/cef/util/window.js',
          ['{lib}util/event.js'
          ,'{lib}native/command.js'
          ,'{lib}native/cef/api.js'],f);