/*
 * ------------------------------------------
 * 图片裁剪器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _proClipper;
    if (!!_p._$$Clipper) return;
    /**
     * 图片裁剪器封装对象<br/>
     * 页面结构举例
     * [code type="html"]
     *   
     * [/code]
     * 脚本举例
     * [code]
     *   
     * [/code]
     * @class   {nej.ut._$$Clipper} 循环播放封装对象
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node}       mbox 裁剪容器节点
     * @config  {String|Node|Array} pbox 预览容器节点 
     * @config  {String}            url  图片地址
     * @config  {String}      
     * @config  {Number}      
     * 
     * [hr]
     * 
     * @event {onchange}
     * @param {Number} 页码信息
     * 
     */
    _p._$$Clipper = NEJ.C();
      _proClipper = _p._$$Clipper._$extend(_p._$$Event);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proClipper.__init = function(){
        this.__image = new Image();
        this.__supInit();
    };
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proClipper.__reset = function(_options){
        this.__supReset(_options);
        // init event
        this.__doInitDomEvent([[
            this.__image,'load',
            this.__onImageLoad._$bind(this,!0)
        ],[
            this.__image,'error',
            this.__onImageLoad._$bind(this,!1)
        ]]);
        // init node
        this.__pbox = [];
        this.__nbox = _e._$get(_options.mbox);
        var _preview = _options.pbox;
        if (_u._$isArray(_preview)){
            this._$addPreview(_preview);
        }else{
            _u._$forEach(
                _preview,this._$addPreview,this
            );
        }
        this._$setURL(_options.url);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _proClipper.__destroy = function(){
        this.__supDestroy();
        
    };
    /**
     * 图片载入完成触发事件
     * @param  {Boolean} 图片是否成功载入
     * @return {Void}
     */
    _proClipper.__onImageLoad = function(_isok){
        
    };
    /**
     * 设置图片地址
     * @param  {String} 图片地址
     * @return {Void}
     */
    _proClipper._$setURL = function(_url){
        if (!_url) return;
        this.__image.src = _url;
    };
    /**
     * 添加预览容器节点
     * @param  {String|Node} 预览容器节点
     * @return {Void}
     */
    _proClipper._$addPreview = function(_box){
        
    };
};
NEJ.define('{lib}util/clipper/clipper.js',
          ['{lib}util/event.js'],f);
