/*
 * ------------------------------------------
 * 卡片播放器列表实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        t = NEJ.P('nej.ut'),
        p = NEJ.P('nej.ui'),
        __proCarouselList,
        __supCarouselList;
    if (!!p._$$CarouselList) return;
    /**
     * 卡片播放器对象
     * @class   {nej.ui._$$CarouselList} 卡片播放器控件
     * @extends {nej.ut._$$Event}
     * @param  {Object} 可选配置参数，已处理参数列表如下：
     * @config {String|Node} parent    卡片所在父容器节点
     * @config {Number}      current   当前选中项
     * @config {Number}      buffer    预加载卡片个数
     * @config {Object}      indicator 指示器参数
     * 
     * [hr]
     * 
     * @event  {onscroll} 滚动到某张卡片
     * @param  {Number} 卡片索引
     * 
     * [hr]
     * 
     * @event  {onaddmore} 追加卡片(异步)
     * 
     */
    p._$$CarouselList = NEJ.C();
    __proCarouselList = p._$$CarouselList._$extend(t._$$Event);
    __proCarouselList.__init = function(_options){
        this.__supInit();
        this.__initLoading();
    };
    /**
     * 初始化加载控件
     * @protected
     * @method {__initLoading}
     * @return {Void}
     */
    __proCarouselList.__initLoading = function(){
        this.__lnode = document.createElement('div');
        this.__lnode.style.position = 'absolute';
        this.__lnode.style.top = '50%';
        this.__lnode.style.left = '100%';
    };
    /**
     * 控件重置函数
     * @protected
     * @method {__reset}
     * @param  {Object} 重置参数
     * @return {Void}
     */
    __proCarouselList.__reset = function(_options){
        this.__supReset(_options);
        this._$setEvent('onscroll',_options.onscroll);
        this._$setEvent('onaddmore',_options.onaddmore);
        _options.onscroll = this.__onScroll._$bind(this);
        _options.onbouncerelease = this.__onBounceRelease._$bind(this);
        this.__buffer = _options.buffer||0;
        if(!this.__carousel)this.__carousel = NEJ.P('nej.ui')._$$CarouselX._$allocate(_options);
        if(!this.__loading)this.__loading = NEJ.P('nej.ui')._$$Loading._$allocate({parent:this.__lnode});
    };
    /**
     * 滚动回调函数
     * @protected
     * @method {__onScroll}
     * @param  {Number} 卡片索引
     * @param  {Object} 是否最后一张卡片
     * @return {Void}
     */
    __proCarouselList.__onScroll = function(_index,_isLast){
        this._$dispatchEvent('onscroll',_index);
        if(_isLast){
            this.__carousel._$getCardByIndex(_index).appendChild(this.__lnode);
        }
    };
    /**
     * 弹性释放处理函数
     * @protected
     * @method {__onBounceRelease}
     * @param  {Object} 事件对象
     * @return {Void}
     */
    __proCarouselList.__onBounceRelease= function(_event){
        _event.offset=-(1.5*this.__lnode.offsetWidth);
        if(this.__load) return;
        this.__load = !0;
        this._$dispatchEvent('onaddmore');
    };
    /**
     * 添加卡片（同步）
     * @method {_$appendItem}
     * @param  {Object}      要添加的卡片索引
     * @param  {String|Node} 要添加的卡片内容或节点 
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$appendItem = function(_index,_node){
        this.__carousel._$appendItem(_index,_node);
        return this;
    };
    /**
     * 滚动下一张卡片
     * @method {_$scrollToNext}
     * @param  {Object} 卡片索引
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$scrollToNext = function(_index){
        this.__carousel._$scrollToNext(_index);
        return this;
    };
    /**
     * 滚动上一张卡片
     * @method {_$scrollToPrev}
     * @param  {Object} 卡片索引
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$scrollToPrev = function(_index){
        this.__carousel._$scrollToPrev(_index);
        return this;
    };
    /**
     * 滚动到指定卡片
     * @method {_$scrollTo}
     * @param  {Object} 卡片索引
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$scrollTo = function(_index){
        this.__carousel._$scrollTo(_index);
        return this;
    };
    /**
     * 滚动到指定卡片
     * @method {_$refresh}
     * @param  {Object} 卡片索引
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$refresh = function(_index){
        this.__carousel._$refresh();
        return this;
    };
    /**
     * 往列表末尾追加卡片（异步）
     * @method {_$appendMore}
     * @param  {Object} 要添加的卡片内容数组
     * @return {nej.ui._$$CarouselList}
     */
    __proCarouselList._$appendMore = function(_array){
        this.__load = !1;
        e._$removeByEC(this.__lnode);
        if(!_array||_array.length<=0)return;
        for(var i=0;i<Math.min(_array.length,this.__buffer);i++){
            this.__carousel._$appendMore(_array[i]);
        }
        window.setTimeout((function(){this.__carousel._$scrollToNext();})._$bind(this),0);
        return this;
    };
    /**
     * 列表回收处理函数
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proCarouselList.__destroy = function(){
        this.__carousel = NEJ.P('nej.ui')._$$CarouselX._$recycle(this.__carousel);
        this.__loading = NEJ.P('nej.ui')._$$Loading._$recycle(this.__loading);
        e._$removeByEC(this.__lnode);
        this._$clearEvent();
    };
};
NEJ.define('{lib}ui/carousel.list/carousel.list.js',
      ['{lib}ui/loading/loading.js'
      ,'{lib}ui/carousel/carousel.x.js'],f);