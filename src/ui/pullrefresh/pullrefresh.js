/*
 * ------------------------------------------
 * 下拉刷新控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        p = NEJ.P('nej.ui'),
        __proPullRefresh,
        __supPullRefresh;
    if (!!p._$$PullRefresh) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     .#<uispace>{height:60px;line-height:20px;overflow:hidden;text-align:center;background:#fff;}\
                     .#<uispace> .z-icon{float:left;width:30%;}\
                     .#<uispace> .z-icon > div{margin:0 auto;}\
                     .#<uispace> .z-icon .z-loading{font-size:350%;margin-top:6px;}\
                     .#<uispace> .z-hint,#<uispace> .z-time{margin-left:30%;}\
                     .#<uispace> .z-hint{font-size:14px;font-weight:bold;margin-top:10px;}\
                     .#<uispace> .z-time{font-size:12px;}');
    // ui html code
    var _seed_html = e._$addNodeTemplate('\
                     <div class="'+_seed_css+'">\
                       <div class="z-icon"></div>\
                       <div class="z-hint"></div>\
                       <div class="z-time"></div>\
                     </div>');
    /**
     * 下拉刷新控件
     * @class   {nej.ui._$$PullRefresh} 下拉刷新控件
     * @extends {nej.ui._$$Puller}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     * 
     */
    p._$$PullRefresh = NEJ.C();
    __proPullRefresh = p._$$PullRefresh._$extend(p._$$Puller);
    __supPullRefresh = p._$$PullRefresh._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proPullRefresh.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    __proPullRefresh.__initNode = function(){
        this.__supInitNode();
        var _ntmp = e._$getChildren(this.__body);
        this.__nopt  = {parent:_ntmp[0]};
        this.__nhint = _ntmp[1];
        this.__ntime = _ntmp[2];
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    __proPullRefresh.__reset = function(_options){
        this.__loading = p._$$Loading._$allocate(this.__nopt);
        this.__loading._$hide();
        this.__arrows = p._$$ArrowsY._$allocate(this.__nopt);
        this.__arrows._$hide();
        this.__supReset(_options);
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    __proPullRefresh.__destroy = function(){
        this.__supDestroy();
        this.__arrows = p._$$ArrowsY._$recycle(this.__arrows);
        this.__loading = p._$$Loading._$recycle(this.__loading);
    };
    /**
     * 改变状态
     * @protected
     * @method {__doStateChange}
     * @param  {Number} 状态
     * @return {Void}
     */
    __proPullRefresh.__doStateChange = (function(){
        // t - hint text
        // d - arrows direction
        // c - arrows/loading class name
        var _config = [{t:'Pull down to refresh ...',d:1}
                      ,{t:'Release to refresh ...',d:-1}
                      ,{t:'Loading ...',c:'z-loading'}];
        return function(_state){
            var _cfg = _config[this.__state%3];
            if (!_cfg){
                this.__state = 0;
                _cfg = _config[this.__state];
            }
            this.__nopt.style = _cfg.c;
            this.__nhint.innerText = _cfg.t;
            if (_state==3)
                this.__ntime.innerText = 'Last Updated:'+
                    u._$format(new Date(),'yyyy-MM-dd HH:mm:ss');
            if (_state==2){
                this.__arrows._$hide();
                this.__loading._$show();
            }else{
                this.__loading._$hide();
                this.__arrows._$show();
                this.__arrows._$direction(_cfg.d);
            }
        };
    })();
};
define('{lib}ui/pullrefresh/pullrefresh.js',
      ['{lib}ui/pullrefresh/puller.js'
      ,'{lib}ui/loading/loading.js'
      ,'{lib}ui/arrows/arrows.y.js'],f);