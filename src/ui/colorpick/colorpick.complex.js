/*
 * ------------------------------------------
 * 颜色选择控件实现文件
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
        _p = _('nej.ui'),
        _proComplexColorPick,
        _supComplexColorPick;
    if (!!_p._$$ComplexColorPick) return;
    // color list
    var _seed_color = _e._$addHtmlTemplate('\
        {list xlist as x}\
        <a class="zitm zitm2" style="background-color:#${x}" data-value="#${x}" href="#">&nbsp;</a>\
        {/list}'
    );
    /**
     * 颜色选择控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id='colorpanel-box'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _cp = _p._$$ComplexColorPick._$allocate({
     *       parent:'colorpanel-box',
     *       defaultColor:'默认rgb颜色',
     *       onselect:function(_event){
     *           console.log(_event.color)
     *       }
     *   });
     * [/code]
     * @class   {nej.ui._$$ComplexColorPick}
     * @extends {nej.ui._$$SimpleColorPick}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String} defaultColor 默认颜色值
     * 
     * [hr]
     * 确定选择颜色触发事件
     * @event  {onselect} 
     * @param  {Object} 颜色信息
     * @config {String} color 颜色值
     * 
     */
    _p._$$ComplexColorPick = NEJ.C();
      _proComplexColorPick = _p._$$ComplexColorPick._$extend(_p._$$SimpleColorPick);
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proComplexColorPick.__initNode = function(){
        this.__supInitNode();
        _e._$addClassName(this.__nbox,'zbox2');
    };
    /**
     * 绘制可选颜色列表
     * @return {Void}
     */
    _proComplexColorPick.__doRenderColorList = (function(){
        var _xlist = ['00','33','66','99','cc','ff'],
            _ylist = ['ff0000','00ff00','0000ff','ffff00','00ffff','ff00ff'];
        return function(){
            var _arr = [],
                _test = ['','','',''];
            // top panel
            _u._$forEach(
                _xlist,function(_value,_index){
                    _arr.push(_test.join(_value));
                    _arr.push('000000');
                    for(var i=0;i<3;i++){
                        for(var j=0;j<6;j++){
                            _arr.push(_xlist[i]+_xlist[j]+_xlist[_index]);
                        }
                    }
                }
            );
            // bottom panel
            _u._$forEach(
                _xlist,function(_value,_index){
                    _arr.push(_ylist[_index]);
                    _arr.push('000000');
                    for(var i=3;i<6;i++){
                        for(var j=0;j<6;j++){
                            _arr.push(_xlist[i]+_xlist[j]+_xlist[_index]);
                        }
                    }
                }
            );
            _e._$renderHtmlTemplate(
                this.__nbox,_seed_color,{
                    xlist:_arr
                }
            );
        };
    })();
};
NEJ.define('{lib}ui/colorpick/colorpick.complex.js',
          ['{lib}ui/colorpick/colorpick.simple.js'],f);