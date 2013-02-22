/**
 * ------------------------------------------ 
 * 窗体框架控件实现文件
 * @version 1.0
 * @author yuqijun(yuqijun@corp.netease.com)
 *         ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _e = _('nej.e'), 
        _i = _('nej.ui'), 
        _t = _('nej.cef.ut'), 
        _c = _('nej.c'), 
        _n = _('nej.n'),
        _p = _('nej.cef.ui'), 
        _proFrame;
    // ui css text
    var _seed_css = _e
            ._$pushCSSText('.#<uispace>{position:absolute;right:2px;top:2px;}\
            .#<uispace> .zbg{background:url('+ _c._$get('root')+ 'frame.png) no-repeat 999px 999px;}\
            .#<uispace> .zact{float:left;width:31px;height:17px;overflow:hidden;margin-right:2px;cursor:default}\
            .#<uispace> .zmin{background-position:0 0}\
            .#<uispace> .zmin:hover{background-position:0 -25px}\
            .#<uispace> .zmin:active{background-position:0 -50px}\
            .#<uispace> .zmax{background-position:-33px 0}\
            .#<uispace> .zmax:hover{background-position:-33px -25px;}\
            .#<uispace> .zmax:active{background-position:-33px -50px}\
            .#<uispace> .zrestore{background-position:-99px 0}\
            .#<uispace> .zrestore:hover{background-position:-99px -25px}\
            .#<uispace> .zrestore:active{background-position:-99px -50px}\
            .#<uispace> .zclose{background-position:-66px 0}\
            .#<uispace> .zclose:hover{background-position:-66px -25px}\
            .#<uispace> .zclose:active{background-position:-66px -50px}');
    // ui html code
    var _seed_html = _e
            ._$addNodeTemplate('<ul class="w-frame '+ _seed_css+ '">\
                                    <li class="zbg zmin zact" title="最小化">&nbsp;</li>\
                                    <li class="zbg zmax zact" title="最大化">&nbsp;</li>\
                                    <li class="zbg zclose zact" title="关闭">&nbsp;</li>\
                                  </ul>');
    /**
     * 窗体框架控件封装
     * 
     * @class 分页器控件封装
     * @extends {nej.ui._$$Abstract}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                    clazz  控件样式 
     *                    parent 控件所在容器节点或者追加控件节点执行函数 
     *                    canResize    窗体是否支持边四周拖动缩放
     *                    taskIcon    任务栏对象
     *                            url        窗体图标
     *                             title    窗体名称
     *                    isclose 
     *                            true 最闭窗体 
     *                            false 隐藏窗体
     */
    _p._$$Frame = NEJ.C();
    _proFrame = _p._$$Frame._$extend(_i._$$Abstract);

    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
     * @return {Void}
     */
    _proFrame.__reset = function(_options) {
        this.__supReset(_options);
        _options.isclose = _options.isclose||false;
        this.__frame = _t._$$Frame._$allocate({isclose:_options.isclose,
                                               min:this.__min,
                                               max:this.__max,
                                               restoreclazz:'zrestore',
                                               maxclazz:'zmax',
                                               taskIcon:_options.taskIcon,
                                               sizelimit:_options.sizeLimit,
                                               icon:_options.icon,
                                               close:this.__close});
        if(_options.canResize){
            this.__resize = _p._$$Resize._$allocate({parent:document.body});
        }
    };
    /**
     * 控件外观
     * 
     * @return {Void}
     */
    _proFrame.__initXGui = function() {
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化节点
     * 
     * @return {Void}
     */
    _proFrame.__initNode = function() {
        this.__supInitNode();
        var _ntmp = _e._$getChildren(this.__body);
        this.__min = _ntmp[0];
        this.__max = _ntmp[1];
        this.__close = _ntmp[2];
    };
};
NEJ.define('{lib}native/cef/ui/frame.js', ['{patch}config.js'
                                       ,'{lib}ui/base.js'
                                       ,'{lib}native/cef/ui/resize.js'
                                       ,'{lib}native/cef/util/frame.js'
                                       ,'{lib}util/template/tpl.js'
                                       ,'{lib}native/cef/util/frame.js'], f);