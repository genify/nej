/*
 * ------------------------------------------
 * 超链接卡片实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _v = _('nej.v'),
        _i = _('nej.ui'),
        _p = _('nej.ui.cmd'),
        _proLinkCard,
        _supLinkCard;
    if (!!_p._$$LinkCard) return;
    /**
     * 超链接卡片
     * @class   {nej.ui.cmd._$$LinkCard} 超链接卡片
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 
     * @event {onErrorLink} 超链接地址有误
     * @param {Number}       错误码
     * [ntb]
     *  0 | 不是以http://开头
     *  1 | 地址中有空白字符
     * [/ntb]
     * 
     * [hr]
     * 
     * @event {onchange} 超链接通过检验
     * @param {String}   超链接地址
     * 
     */
    _p._$$LinkCard = NEJ.C();
      _proLinkCard = _p._$$LinkCard._$extend(_i._$$WindowWrapper);
      _supLinkCard = _p._$$LinkCard._$supro;
    
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _proLinkCard.__initXGui = function(){
        this.__seed_css  = _seed_css;
        this.__seed_html = _seed_html;
    };
    
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proLinkCard.__initNode = function(){
        this.__supInitNode();
        this.__btns = _e._$getByClassName(this.__body,'j-btn');
        this.__inputs = _e._$getByClassName(this.__body,'ipt');
        this.__errorMsg = _e._$getByClassName(this.__body,'j-error')[0];
    };
    
    /**
     * 取消
     * @protected
     * @method {__onCancel}
     * @return {Void}
     */
    _proLinkCard.__onCancel = function(){
        this._$hide();
    };
    
    /**
     * 完成链接
     * @protected
     * @method {__onOK}
     * @return {Void}
     */
    _proLinkCard.__onOK = function(){
        var _link = {};
        _link.name = _u._$escape(this.__inputs[0].value);
        _link.href = this.__inputs[1].value;
        var _reg = /^(?:http(s)?:\/\/)[^\s].?/,_reg2 = /^(?:http(s)?:\/\/).*/;
        var _flag = _link.href.search(_reg),_flag2= _link.href.search(_reg2);
        if(_flag2 < 0){
            this._$dispatchEvent('onErrorLink',0);
            return;
        }
        if(_flag < 0){
            this._$dispatchEvent('onErrorLink',1);
            return;
        }
        this._$dispatchEvent('onchange',_link);
        this._$hide();
    };
    
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object}  可选配置参数
     * @config {Boolean} draggable   是否可拖动
     * @config {Boolean} destroyable 关闭是否销毁
     * @config {String}  title          卡片标题
     * @config {Boolean} name        超链接名称
     * @return {Void}
     */
    _proLinkCard.__reset = function(_options){
        //默认以document为parent
        _options.parent = _options.parent || document.body; 
        _options.draggable = _options.draggable || false;
        _options.destroyable = _options.destroyable || false;
        _options.title = _options.title || '超链接';
        _options.mask  = _options.maskclazz || true;
        this.__supReset(_options);
        this.__inputs[0].value = _options.name||'';
        this.__doInitDomEvent([
            [this.__btns[1],'click',this.__onOK._$bind(this)],
            [this.__btns[0],'click',this.__onCancel._$bind(this)],
            [this.__inputs[0],'focus',this.__showErrorTips._$bind(this,'')],
            [this.__inputs[1],'focus',this.__showErrorTips._$bind(this,'')]
        ]);
    };

    /**
     * 显示错误信息
     * @protected
     * @method {__showErrorTips}
     * @param  {Object} 错误信息
     * @return {Void}
     */
    _proLinkCard.__showErrorTips = function(_message){
        this.__errorMsg.innerText = _message;
    };
    
    /**
     * 控件回收
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proLinkCard.__destroy = function(){
        this.__supDestroy();
    };

    /**
     * 提供聚焦到input的接口
     * @return {[type]} [description]
     */
    _proLinkCard._$doFocus = function(){
        this.__inputs[1].focus();
        this.__inputs[1].value = 'http://';
    };

    // ui html code
    var _seed_html = _e._$addNodeTemplate('\
        <div>\
          <div class="u-row f-cb"><div class="u-edit f-cb"><div class="f-fl u-title">标题</div><input class="f-fl ipt" type="text" /></div></div>\
          <div class="f-cb"><div class="u-edit f-cb"><div class="f-fl u-title">链接</div><input class="f-fl ipt" type="text" value="http://" /></div></div>\
          <div class="u-error j-error"></div>\
          <div class="btn f-cb">\
              <a class="f-fr slave j-btn"><span>取消 </span></a>\
              <a class="f-fr main right j-btn"><span>确定 </span></a>\
            </div>\
        </div>');
    // ui css seed
    var _seed_css = _e._$pushCSSText('.#<uispace>{padding:20px 20px \
        32px 20px;}\
        .#<uispace> .u-title{color:#ccc;height:35px;line-height:35px;margin:0 8px 0 10px;}\
        .#<uispace> .u-row{margin-bottom:10px;}\
        .#<uispace> .u-error{color:red;padding-top:10px;}\
        .#<uispace> .u-edit{position: relative;z-index: 101;background: #FAFAFA;border: 1px solid #DFDFDF;-webkit-box-shadow: inset 1px 1px 2px #DFDFDF;-moz-box-shadow: inset 1px 1px 2px #dfdfdf;box-shadow: inset 1px 1px 2px #DFDFDF;}\
        .#<uispace> .ipt{display:block;font-size: 14px;position: relative;z-index: 101;line-height:35px;height:35px;width: 290px;resize: none;background: transparent;border: none;color: #444;overflow:hidden;}');
};
NEJ.define('{lib}ui/editor/command/link.js',
      ['{lib}ui/layer/window.wrapper.js'],f);