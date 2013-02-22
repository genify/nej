/*
 * ------------------------------------------
 * 下拉刷新控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        p = NEJ.P('nej.ui'),
        __proPuller,
        __supPuller;
    if (!!p._$$Puller) return;
    /**
     * 下拉刷新基类对象
     * @class   {nej.ui._$$Puller} 下拉刷新基类对象
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置信息，已处理参数列表如下
     * @config  {Number} state 状态值
     * [ntb]
     *   0 | 下拉刷新
     *   1 | 放开刷新
     *   2 | 刷新中
     *   3 | 数据更新完成
     * [/ntb]
     * @config  {Number} 状态变化临界值比例（相对于控件高度），默认为0.5
     * 
     * [hr]
     * 
     * @event  {onrefresh} 刷新触发事件
     * 
     */
    p._$$Puller = NEJ.C();
    __proPuller = p._$$Puller._$extend(p._$$Abstract);
    __supPuller = p._$$Puller._$supro;
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proPuller.__reset = function(_options){
        this.__supReset(_options);
        this.__factor = parseFloat(_options.factor)||0.5;
        this._$setState(parseInt(_options.state)||0);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proPuller.__destroy = function(){
        this.__supDestroy();
        delete this.__state;
    };
    /**
     * 状态变化触发事件，子类实现具体逻辑
     * @protected
     * @method {__doStateChange}
     * @param  {Number} 原来的状态
     * @return {Void}
     */
    __proPuller.__doStateChange = f;
    /**
     * 取可见区域高度
     * @method {_$getRange}
     * @return {Number} 可见区域高度
     */
    __proPuller._$getRange = function(){
        if (!this.__height)
            this.__height = this.__body.offsetHeight;
        return this.__height;
    };
    /**
     * 判断当前举例是否超出阀值
     * @method {_$isOutThreshold}
     * @param  {Number}  实际距离
     * @return {Boolean} 是否超出阀值
     */
    __proPuller._$isOutThreshold = function(_distance){
        return _distance>(this._$getRange()*this.__factor);
    };
    /**
     * 更新状态，子类实现具体逻辑
     * @method {_$setState}
     * @param  {Number} 状态值
     * @return {nej.ui._$$Puller}
     */
    __proPuller._$setState = function(_state){
        if (_state==this.__state) return;
        var _original =  this.__state;
        this.__state = _state;
        this.__doStateChange(_original);
        return this;
    };
    /**
     * 取状态值
     * @method {_$getState}
     * @return {Number} 状态值
     * [ntb]
     *   0 | 下拉刷新
     *   1 | 放开刷新
     *   2 | 刷新中
     *   3 | 数据更新完成
     * [/ntb]
     *                  
     */
    __proPuller._$getState = function(){
        return this.__state;
    };
};
NEJ.define('{lib}ui/pullrefresh/puller.js',['{lib}ui/base.js'],f);