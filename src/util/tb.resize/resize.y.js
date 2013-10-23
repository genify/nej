/*
 * ------------------------------------------
 * 可调整宽度网格封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _p = _('nej.ut'),
        _proTBResizeY;
    /**
     * 可调整宽度网格控件<br/>
     *
     * 结构举例：
     * [code type="html"]
     *   <style id="grid-style">
     *      .r .c{position:relative;}
     *      .r .c .js-ctrl{width:5px;}
     *   </style>
     *   
     *   <div class="tb">
     *     <div class="r r0">
     *       <span class="c c0 js-grid-0" id="grid-0">11111</span>
     *       <span class="c c1 js-grid-1" id="grid-1">22222</span>
     *     </div>
     *     <div class="r r1">
     *       <span class="c c0 js-grid-0">11111</span>
     *       <span class="c c1 js-grid-1">22222</span>
     *     </div>
     *   </div>
     * [/code]
     * 
     * 脚本举例：
     * [code]
     *    var _  = NEJ.P,
     *        _p = _('nej.ut');
     * 
     *    // init grid-0
     *    _p._$$TBResizeY._$allocate({
     *        grid:'grid-0',
     *        clazz:'js-grid-0',
     *        style:'grid-style'
     *    });
     * 
     *    // init grid-1
     *    _p._$$TBResizeY._$allocate({
     *        grid:'grid-1',
     *        clazz:'js-grid-1',
     *        style:'grid-style'
     *    });
     * [/code]
     * 
     * @class   {nej.ut._$$TBResizeY}
     * @extends {nej.ut._$$TBResize}
     * 
     * @param   {Object} 配置参数
     * 
     */
    _p._$$TBResizeY = NEJ.C();
      _proTBResizeY = _p._$$TBResizeY._$extend(_p._$$TBResize);
    /**
     * 取配置信息
     * @return {Object} 配置信息
     */
    _proTBResizeY.__getConfig = function(){
        return {
            n:'height',
            b:'offsetHeight',
            c:'row-resize',
            p:'clientY'
        };
    };
};
NEJ.define('{lib}util/tb.resize/resize.y.js',
          ['{lib}util/tb.resize/resize.js'],f);