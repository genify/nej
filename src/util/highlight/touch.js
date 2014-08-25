/*
 * ------------------------------------------
 * 高亮接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/highlight/touch */
NEJ.define([
    'base/global',
    'base/event',
    'base/element'
],function(NEJ,_v,_e,_p,_o,_f,_r){
    /**
     * 节点鼠标或手势按下高亮行为，移动触摸反馈
     *
     * 样式举例
     * ```css
     *    .page .element.js-highlight{background:#f00;}
     * ```
     *
     * 结构举例
     * ```html
     *    <!-- 使用data-highlight指定highlight效果的样式名称 -->
     *    <div id="abc" data-highlight="js-highlight">aaaaa</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'util/highlight/touch'
     *   ],function(_e){
     *       // 如果highlight效果的样式名已经通过data-hover指定
     *       _e._$highlight('abc');
     *       // 如果highlight效果的样式名没有通过data-hover指定
     *       _e._$highlight('abc','js-highlight');
     *   });
     * ```
     *
     * @method module:util/highlight/touch._$highlight
     * @param  {String|Node} arg0 - 节点
     * @param  {String}      arg1 - 样式，默认为js-highlight
     * @return {Void}
     */
    _p._$highlight = (function(){
        var _cache = {},
            _distance = 2;
        // touch start event
        var _doTouchStart = function(_id,_clazz,_event){
            _cache[_id] = _v._$page(_event);
            _e._$addClassName(_id,_clazz);
        };
        // touchmove event
        var _doTouchMove = function(_id,_clazz,_event){
            var _point = _cache[_id];
            if (_point===-1) return;
            var _xy = _v._$page(_event),
                _dx = Math.abs(_xy.x-_point.x),
                _dy = Math.abs(_xy.y-_point.y);
            if (_dx>_distance||_dy>_distance){
                _doTouchEnd(_id,_clazz);
            }
        };
        // touchend/touchcancel event
        var _doTouchEnd = function(_id,_clazz){
            if (_cache[_id]!==-1){
                _cache[_id] = -1;
                _e._$delClassName(_id,_clazz);
            }
        };
        return function(_element,_clazz){
            var _id = _e._$id(_element);
            if (!_id||_cache[_id]!=null){
                return;
            }
            // lock element
            _cache[_id] = -1;
            _clazz = _clazz||
                     _e._$dataset(_id,'highlight')||
                     'js-highlight';
            // add event
            _v._$addEvent(
                _id,'touchstart',
                _doTouchStart._$bind(null,_id,_clazz)
            );
            _v._$addEvent(
                document,'touchmove',
                _doTouchMove._$bind(null,_id,_clazz)
            );
            _v._$addEvent(
                document,'touchend touchcancel',
                _doTouchEnd._$bind(null,_id,_clazz)
            );
        };
    })();
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }
    
    return _p;
});
