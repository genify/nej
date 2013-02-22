/**
 * ------------------------------------------
 * 窗体框架控件实现文件
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _e = _('nej.e'), 
        _u = _('nej.u'), 
        _t = _('nej.ut'), 
        _c = _('nej.c'), 
        _n = _('nej.n'),
        _p = _('nej.cef.ut'), 
        _proFrame;
    /**
     * 窗体框架控件封装
     * <pre>
     *   <ul class="w-frame">
     *       <li class="zbg zmin zact" title="最小化">&nbsp;</li>
     *       <li class="zbg zmax zact" title="最大化">&nbsp;</li>
     *       <li class="zbg zclose zact" title="关闭">&nbsp;</li>
     *   </ul>
     * </pre>
     * @class 分页器控件封装
     * @extends {nej.ui._$$Event}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                        isclose         窗体的关闭按钮是关闭窗体还是隐藏窗体 
     *                        min             最小化窗体节点 
     *                        max                最大化窗体节点
     *                        maxClazz        最大化样式
     *                        restoreclazz    最大化窗体后，恢复原态的样式
     *                        close            关窗窗体节点
     */
    _p._$$Frame = NEJ.C();
    _proFrame = _p._$$Frame._$extend(_t._$$Event);

    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
     *                        max                最大化节点
     *                        min                最小化节点
     *                        close            关闭节点
     *                        restoreclazz    恢复样式
     *                        maxclazz        最大化样式
     *                        isclose            关闭按钮是关闭窗体，还是隐藏窗体
     *                        taskIcon        任务栏对象
     *                                    url        窗体图标
     *                                    title    窗体名称
     * @return {Void}
     */
    _proFrame.__reset = function(_options) {
        this.__supReset(_options);
        this.__max = _options.max;
        this.__restoreClazz = _options.restoreclazz;
        this.__maxClazz = _options.maxclazz;
        this.__isClose = _options.isclose;
        if(_options.taskIcon)
            _n._$setTaskIcon(_options.taskIcon);
        this.__doInitDomEvent([
                               [_options.min,'click',this.__onMinClick._$bind(this)]
                              ,[this.__max,'click',this.__onMaxClick._$bind(this)]
                              ,[_options.close,'click',this.__onCloseClick._$bind(this)]
                          ]);
    };
    /**
     * 最小化点击响应
     */
    _proFrame.__onMinClick = function(_event){
        _n._$exec('winhelper.showWindow', 'minimize');
    };
    /**
     * 最大化点击响应
     */
    _proFrame.__onMaxClick = function(_event){
        var _status = _n._$exec('winhelper.getWindowInfo', 'status');
        var _maximize  = false;
        if (!!_status)
            _maximize = _status.status == 'restore' ? false : true;
        if(!_maximize){
            _e._$replaceClassName(this.__max, this.__maxClazz,this.__restoreClazz);
            _n._$exec('winhelper.showWindow', 'maximize');
            this.__max.title ='还原';
        }
        else{
            this.__max.title ='最大化';
            _n._$exec('winhelper.showWindow', 'restore');
            _e._$replaceClassName(this.__max, this.__restoreClazz,this.__maxClazz);
        }
                
    };
    /**
     * 最小化点击响应
     */
    _proFrame.__onCloseClick = function(_event){
        if(!!this.__isClose)
            _n._$exec('window.close');
        else
            _n._$exec('winhelper.showWindow', 'hide');
    };
};
NEJ.define('{lib}native/cef/util/frame.js', ['{lib}util/event.js','{lib}native/command.js'], f);