/*
 * ------------------------------------------
 * 循环播放封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}util/event.js',
    '{lib}util/page/page.simple.js'
],function(NEJ,_k,_e,_v,_u,_t,_t0,_p,_o,_f,_r){
    var _pro;
    /**
     * 循环播放封装对象<br/>
     * 页面结构举例
     * [code type="html"]
     *   <div id="nbox"></div>
     *   <ul id="pbox">
     *       <li>1</li>
     *       <li>2</li>
     *       <li>3</li>
     *   </ul>
     * [/code]
     * 脚本举例
     * [code]
     *   var _p = NEJ.P('nej.ut');
     *   var _cyc = _p._$$Cycler._$allocate(
     *   {
     *       list:['http://xxxx.com/xxx.jpg',
     *       'http://xxxx.com/xxx.jpg',
     *       'http://xxxx.com/xxx.jpg'],
     *       nbox:'nbox',
     *       pbox:'pbox',
     *       event:'click',
     *       interval:5,
     *       onchange:function(_index){
     *           // 切换页面的回调，_index从1到3
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$Cycler} 循环播放封装对象
     * @extends {nej.ut._$$EventTarget}
     * @param   {Object}      可选配置参数，已处理参数列表如下
     * @config  {Array}       list         图片地址列表
     * @config  {String|Node} nbox         图片容器节点
     * @config  {String|Node} pbox         页码索引容器节点
     * @config  {String}      event        页码切换事件名称
     * @config  {Number}      interval     轮播时间间隔，单位秒，默认为2s
     *
     * [hr]
     *
     * @event {onchange}
     * @param {Number} 页码信息
     *
     */
    _p._$$Cycler = _k._$klass();
    _pro = _p._$$Cycler._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__popt = {
            index:1,
            onchange:this.__onPageChange._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param   {Object}       可选配置参数，已处理参数列表如下
     * @config  {Array}       list      图片地址列表
     * @config  {String|Node} nbox      图片容器节点
     * @config  {String|Node} pbox      页码索引容器节点
     * @config  {String}      event     页码切换事件名称
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__list = _options.list||[];
        this.__nbox = _e._$get(_options.nbox);
        this.__interval = (_options.interval||2)*1000;
        var _list = _e._$getChildren(_options.pbox);
        this.__popt.list  = _list;
        this.__popt.total = _list.length;
        this.__popt.event = _options.event;
        this.__pager = _t0._$$SimplePage._$allocate(this.__popt);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        _e._$remove(this.__image);
        delete this.__nbox;
        delete this.__image;
        delete this.__popt.list;
        this.__timer = window.clearTimeout(this.__timer);
    };
    /**
     * 页面变化回调
     * @protected
     * @method {__onPageChange}
     * @param  {Object} 页码信息
     * @config {Number} index 页码信息
     * @return {Void}
     */
    _pro.__onPageChange = function(_event){
        this.__timer = window.clearTimeout(this.__timer);
        var _index = _event.index,
            _url = this.__list[_index-1];
        if (!!_url)
            this._$setImage(_url);
        this._$dispatchEvent('onchange',_index);
    };
    /**
     * 去到下一页
     * @protected
     * @method {__onNextPage}
     * @return {Void}
     */
    _pro.__onNextPage = function(){
        var _index = this.__pager._$getIndex(),
            _total = this.__pager._$getTotal();
        this.__pager._$setIndex((_index+1)%(_total+1));
    };
    /**
     * 图片载入完成触发事件
     * @protected
     * @method {__onImageLoad}
     * @param  {Boolean} 是否载入成功
     * @return {Void}
     */
    _pro.__onImageLoad = function(_isok){
        this.__timer = window.setTimeout(
            this.__onNextPage._$bind(this),this.__interval);
        _e._$setStyle(this.__image,'opacity',1);
    };
    /**
     * 设置图片<br/>
     * 脚本举例
     * [code]
     *   // 在回调里突然想换另外一张图片来展示
     *   _cyc._$setImage('http://abc.com/abc.jpg');
     * [/code]
     * @method {_$setImage}
     * @param  {String} 图片地址
     * @return {Void}
     */
    _pro._$setImage = (function(){
        var _css = {
            opacity:0,
            transitionProperty:'opacity',
            transitionDuration:'1s',
            transitionTimingFunction:'ease-in-out'
        };
        var _doSetStyle = function(_value,_key){
            _e._$setStyle(this.__image,_key,_value);
        };
        return function(_url){
            if (!!this.__image)
                _e._$remove(this.__image);
            this.__image = new Image();
            _u._$forIn(_css,_doSetStyle,this);
            this.__nbox.appendChild(this.__image);
            _v._$addEvent(this.__image,'load',
                this.__onImageLoad._$bind(this,!0));
            _v._$addEvent(this.__image,'error',
                this.__onImageLoad._$bind(this,!1));
            this.__image.src = _url;
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});