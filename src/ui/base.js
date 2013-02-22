/*
 * ------------------------------------------
 * UI控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _proAbstract;
    if (!!_p._$$Abstract) return;
    /**
     * UI控件基类，框架及项目中所有涉及UI的控件均继承此类
     * [code]
     *    // 分配控件实例
     *    var ctrl = AAA._$allocate({
     *        clazz:'xxx',
     *        parent:document.body
     *    });
     *    ctrl._$appendTo(document.body);   // 如果在分配时传入了parent则这步可省略
     *    ctrl._$appendTo(function(_body){  // 如果需要自定义body插入的位置可以输入函数，返回父容器节点
     *        _parent.insertAdjacentElement('afterBegin',_body);
     *        return _parent;
     *    });
     * [/code]
     * @class   {nej.ui._$$Abstract}
     * @extends {nej.ut._$$Event}
     * @param {String}               控件样式
     * @param {String|Node|Function} 控件所在容器节点或者追加控件节点执行函数
     */
    _p._$$Abstract = NEJ.C();
      _proAbstract = _p._$$Abstract._$extend(_t._$$Event);
    /**
     * 初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proAbstract.__init = function(){
        this.__supInit();
        _e._$dumpCSSText();
        this.__initXGui();
        this.__initNode();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proAbstract.__reset = function(_options){
        this.__supReset(_options);
        this.__doInitClass(_options.clazz);
        this._$appendTo(_options.parent);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proAbstract.__destroy = function(){
        this.__supDestroy();
        // clear parent
        this.__doDelParentClass();
        delete this.__parent;
        // clear body
        _e._$removeByEC(this.__body);
        _e._$delClassName(this.__body,
                          this.__class);
        delete this.__class;
    };
    /**
     * 初始化外观信息，子类实现具体逻辑
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proAbstract.__initXGui = _f;
    /**
     * 初始化节点，子类重写具体逻辑
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proAbstract.__initNode = function(){
        if (!this.__seed_html)
             this.__initNodeTemplate();
        this.__body = _e._$getNodeTemplate(this.__seed_html);
        if (!this.__body)
             this.__body = _e._$create('div',this.__seed_css);
        _e._$addClassName(this.__body,this.__seed_css);
    };
    /**
     * 动态构建控件节点模板，子类实现具体逻辑
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _proAbstract.__initNodeTemplate = _f;
    /**
     * 添加节点样式
     * @protected
     * @method {__doInitClass}
     * @param  {String} 样式名称
     * @return {Void}
     */
    _proAbstract.__doInitClass = function(_clazz){
        this.__class = _clazz||'';
        _e._$addClassName(this.__body,this.__class);
    };
    /**
     * 父节点增加辅助样式
     * @protected
     * @method {__doAddParentClass}
     * @return {Void}
     */
    _proAbstract.__doAddParentClass = function(){
        if (!this.__seed_css) return;
        _e._$addClassName(this.__parent,
                          this.__seed_css+'-parent');
    };
    /**
     * 父节点删除辅助样式
     * @protected
     * @method {__doDelParentClass}
     * @return {Void}
     */
    _proAbstract.__doDelParentClass = function(){
        if (!this.__seed_css) return;
        _e._$delClassName(this.__parent,
                          this.__seed_css+'-parent');
    };
    /**
     * 取当前控件节点<br />
     * 脚本举例
     * [code]
     *   // _mask是一个继承了此基类的实例化对象
     *   // 获取当前控件的节点
     *   _mask._$getBody();
     * [/code]
     * @method {_$getBody}
     * @return {Node} 控件节点
     */
    _proAbstract._$getBody = function(){
        return this.__body;
    };
    /**
     * 控件节点追加至容器<br />
     * 脚本举例
     * [code]
     *   // _mask是一个继承了此基类的实例化对象
     *   _mask._$appendTo(document.body);
     *   // 还可以传方法
     *   _mask._$appendTo(function(_body){
     *      // 根据情况插入节点
     *      var _parent = document.body;
     *      _parent.insertAdjacentElement('afterBegin',_body);
     *      return _parent;
     *   });
     * [/code]
     * @method {_$appendTo}
     * @param  {String|Node|Function} _parent 控件所在容器节点
     * @return {nej.ui._$$Abstract}
     */
    _proAbstract._$appendTo = function(_parent){
        if (!this.__body) return this;
        this.__doDelParentClass();
        if (_u._$isFunction(_parent)){
            this.__parent = _parent(this.__body);
        }else{
            this.__parent = _e._$get(_parent);
            if (!!this.__parent)
                this.__parent.appendChild(this.__body);
        }
        this.__doAddParentClass();
        return this;
    };
    /**
     * 显示控件<br />
     * 脚本举例
     * [code]
     *   // _mask是一个继承了此基类的实例化对象
     *   _mask._$show();
     * [/code]
     * @method {_$show}
     * @return {nej.ui._$Absttact}
     */
    _proAbstract._$show = function(){
        if (!this.__parent||!this.__body||
             this.__body.parentNode==this.__parent)
            return this;
        this.__parent.appendChild(this.__body);
        return this;
    };
    /**
     * 隐藏控件<br />
     * 脚本举例
     * [code]
     *   // _mask是一个继承了此基类的实例化对象
     *   _mask._$hide();
     * [/code]
     * @method {_$hide}
     * @return {nej.ui._$$Abstract}
     */
    _proAbstract._$hide = function(){
        _e._$removeByEC(this.__body);
        return this;
    };
};
NEJ.define('{lib}ui/base.js',
          ['{lib}base/element.js'
          ,'{lib}util/event.js'
          ,'{lib}util/template/tpl.js'],f);