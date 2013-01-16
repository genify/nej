/*
 * ------------------------------------------
 * 加载更多控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        v = NEJ.P('nej.v'),
        p = NEJ.P('nej.ui'),
        __proLoadMore,
        __supLoadMore;
    if (!!p._$$LoadMore) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     .#<uispace>{height:2.5em;line-height:2.5em;font-size:150%;text-align:center;cursor:pointer;}\
                     .#<uispace>-loading{cursor:default;}\
                     .#<uispace>-loading > div{margin:0 auto;}');
    /**
     * 加载更多控件
     * @class   {nej.ui._$$LoadMore} 加载更多控件
     * @extends {nej.ui._$$Abstract}
     * @param  {Object} 可选配置参数，已处理参数列表如下：
     * @config {String} loadstyle 加载中样式
     * 
     * [hr]
     * 
     * @event  {onloadmore} 加载更多回调事件
     * 
     */
    p._$$LoadMore = NEJ.C();
    __proLoadMore = p._$$LoadMore._$extend(p._$$Abstract);
    __supLoadMore = p._$$LoadMore._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proLoadMore.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    __proLoadMore.__initNode = function(){
        this.__supInitNode();
        this.__lopt = {parent:this.__body};
        this.__body.innerHTML = '加载更多...';
        this.__loadcls = this.__seed_css+'-loading';
        v._$addEvent(this.__body,'tap',
                     this.__onLoadMore._$bind(this));
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proLoadMore.__reset = function(_options){
        this.__supReset(_options);
        if (!!_options.loadstyle)
            this.__loadcls += ' '+_options.loadstyle;
        this.__setLoadable(!0);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proLoadMore.__destroy = function(){
        this.__supDestroy();
        this.__setLoadable(!0);
        this.__loadcls = this.__seed+'-loading';
    };
    /**
     * 设置是否可加载
     * @protected
     * @method {__setLoadable}
     * @param  {Boolean} 是否可加载
     * @return {Void}
     */
    __proLoadMore.__setLoadable = function(_able){
        if (!(!_able^!!this.__loading)) return;
        if (!_able){
            this.__body.innerText = '';
            this.__loading = p._$$Loading._$allocate(this.__lopt);
            e._$addClassName(this.__body,this.__loadcls);
        }else{
            this.__loading = p._$$Loading._$recycle(this.__loading);
            this.__body.innerText = '加载更多...';
            e._$delClassName(this.__body,this.__loadcls);
        }
    };
    /**
     * 载入更多触发事件
     * @protected
     * @method {__onLoadMore}
     * @return {Void}
     */
    __proLoadMore.__onLoadMore = function(){
        if (!this.__loading){
            this.__setLoadable(!1);
            this._$dispatchEvent('onloadmore');
        }
    };
    /**
     * 设置允许触发加载功能
     * @method {_$loadable}
     * @return {nej.ui._$$LoadMore}
     */
    __proLoadMore._$loadable = function(){
        this.__setLoadable(!0);
        return this;
    };
};
define('{lib}ui/loadmore/loadmore.js',
      ['{lib}ui/loading/loading.js'
      ,'{lib}util/gesture/tap.js'],f);