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
        _proGridX;
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
     *    _p._$$GridX._$allocate({
     *        grid:'grid-0',
     *        clazz:'js-grid-0',
     *        style:'grid-style'
     *    });
     * 
     *    // init grid-1
     *    _p._$$GridX._$allocate({
     *        grid:'grid-1',
     *        clazz:'js-grid-1',
     *        style:'grid-style'
     *    });
     * [/code]
     * 
     * @class   {nej.ut._$$GridX}
     * @extends {nej.ut._$$Grid}
     * 
     * @param   {Object} 配置参数
     * 
     */
    _p._$$GridX = NEJ.C();
      _proGridX = _p._$$GridX._$extend(_p._$$Grid);
    /**
     * 取配置信息
     * @return {Object} 配置信息
     */
    _proGridX.__getConfig = function(){
        return {
            n:'width',
            b:'clientWidth',
            c:'col-resize',
            p:'clientX'
        };
    };
};
NEJ.define('{lib}util/grid/grid.x.js',
          ['{lib}util/grid/grid.js'],f);