/*
 * ------------------------------------------
 * 消息总线实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/event/esb */
NEJ.define([
    'base/klass',
    'util/event'
],function(
    k, t,
    exports, pro
){
    /**
     * 消息总线
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/event/esb'
     * ],function(esb){
     *      // 添加事件，新加的事件不会覆盖原同名事件
     *      esb._$addEvent(
     *          'onxxx', function(event){
     *              // TODO
     *              // 阻止后续逻辑
     *              // esb._$stop(event);
     *              // 判断事件是否被阻止
     *              // esb._$isStopped(event);
     *          }
     *      );
     *      // 设置事件，新加的事件覆盖原同名事件
     *      esb._$setEvent(
     *          'onxxx', function(event){
     *              // TODO
     *          }
     *      );
     *      // 删除事件，注意这里的 eventHandler 引用必须跟添加时一致
     *      esb._$delEvent(
     *          'onxxx', eventHandler
     *      );
     *      // 调度事件
     *      esb._$dispatchEvent(
     *          'onxxx',{
     *              a:'aaaa',
     *              b:'bbbbb'
     *          }
     *      )
     * });
     * ```
     *
     * @class    module:util/event/esb.ESB
     * @extends  module:util/event/esb._$$EventTarget
     *
     * @param    {Object} config  - 可选配置参数
     */
    var ESB = k._$klass();
    pro = ESB._$extend(t._$$EventTarget);

    /**
     * 阻止事件
     *
     * @method module:util/event/esb.ESB#_$isStopped
     * @param  {String} arg0 - 事件对象
     * @return {Void}
     */
    pro._$stop = function(event){
        (event||{}).__stopped__ = !0;
    };

    /**
     * 判断事件是否被阻止
     *
     * @method module:util/event/esb.ESB#_$isStopped
     * @param  {String} arg0 - 事件对象
     * @return {Void}
     */
    pro._$isStopped = function(event){
        return !!(event||{}).__stopped__;
    };

    // return esb instance
    return ESB._$allocate();
});