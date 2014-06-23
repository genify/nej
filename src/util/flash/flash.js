/*
 * ------------------------------------------
 * Flash对象支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _h = _('nej.h'),
        _x = _('nej.x'),
        _seed_html;
    if (!!_e._$flash) return;
    /**
     * 页面嵌入flash<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id='flash'></div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _swf = '../../qunit/res/FlexChart.swf';
     *   _onFlashReady = function(_flash){
     *      // 返回准备好的flash对象
     *   }
     *   // 生成flash对象，可以设置宽高，地址，父节点，flash参数在params中设置
     *   // flash需要提供inited接口，返回falsh已经准备好的状态
     *   _e._$flash({
     *       src:_swf,
     *       hidden:false,
     *       parent:'flash',
     *       width:900,
     *       height:600,
     *       params:{
     *           flashvars:'',
     *           wmode:'transparent',
     *           allowscriptaccess:'always'
     *       },
     *       onready:_onFlashReady._$bind(this)
     *   });
     * [/code]
     * @api    {nej.e._$flash}
     * @param  {Object} 可选配置参数，已处理参数列表如下
     * @config {String}      src     Flash文件地址，必须指定地址
     * @config {Boolean}     hidden  Flash是否不可见
     * @config {Number}      width   Flash显示宽度，设为不可见时可以不设此参数
     * @config {Number}      height  Flash显示高度，设为不可见时可以不设此参数
     * @config {String|Node} parent  容器节点，默认为document.body
     * @conifg {Object}      params  设置参数
     * @config {String|Node} target  触发事件的源节点
     * @return {Void}
     * 
     * [hr]
     * Flash初始化完毕触发事件
     * @event  {onready} 
     * @param  {Flash} Flash对象
     * 
     */
    _e._$flash = 
    _x._$flash = (function(){
        var _cache = {},
            _reg0 = /^(?:mouse.*|(?:dbl)?click)$/i;
        // flash event
        window.onflashevent = function(_event){
            var _id = decodeURIComponent(_event.target),
                _type = _event.type.toLowerCase();
            // check mouse event bubble
            var _target = _cache[_id+'-tgt'];
            if (!!_target&&_reg0.test(_type)){
                _doMouseEventBubble(
                    _target,_event
                );
            }
            // check id-type handler
            var _handler = _cache[_id+'-on'+_type];
            if (!!_handler){
                var _result = '';
                try{
                    _result = _handler(_event);
                }catch(e){
                    // ignore
                }
                return _result;
            }
        };
        // append flash element
        var _doInitDOM = function(_options){
            var _parent = _e._$get(_options.parent)||document.body,
                _html = _e._$getHtmlTemplate(_seed_html,_options);
            _parent.insertAdjacentHTML(
               !_options.hidden?'beforeEnd':'afterBegin',_html
            );
        };
        // listen flash mouse event
        var _doMouseEventBubble = function(_id,_event){
            var _type = _event.type.toLowerCase();
            requestAnimationFrame(function(){
                _v._$dispatchEvent(_id,_type);
            });
        };
        // check flash init state
        var _doCheckFlashInit = function(_flash){
            return !!_flash&&!!_flash.inited&&!!_flash.inited();
        };
        var _doCheckFlash = function(_id){
            var _arr = [document.embeds[_id],
                       _e._$get(_id),document[_id],window[_id]],
                _index = _u._$forIn(_arr,_doCheckFlashInit),
                _flash = _arr[_index],
                _ctkey = _id+'-count';
            _cache[_ctkey]++;
            if (!!_flash||_cache[_ctkey]>100){
                _cache[_id](_flash);
                delete _cache[_id];
                delete _cache[_ctkey];
                return;
            }
            window.setTimeout(_doCheckFlash._$bind(null,_id),300);
        };
        // init flash event
        var _doInitFlashEvent = function(_options){
            // init flash vars
            var _id = _options.id,
                _params = _options.params;
            if (!_params){
                _params = {};
                _options.params = _params;
            }
            var _vars = _params.flashvars||'';
            _vars += (!_vars?'':'&')+('id='+_id);
            // delegate mouse event bubble
            if (!_options.hidden&&(!!_options.target||
                 _h.__canFlashEventBubble(_params.wmode))){
                var _tid = _e._$id(_options.target)||
                           _e._$id(_options.parent);
                _cache[_id+'-tgt'] = _tid;
            }
            _params.flashvars = _vars;
            // check event callback
            _u._$forIn(_options,function(_value,_key){
                if (_u._$isFunction(_value)&&_key!='onready'){
                    _cache[_id+'-'+_key] = _value;
                }
            });
        };
        return function(_options){
            _options = NEJ.X({},_options);
            if (!_options.src) return;
            var _id = _u._$uniqueID();
            _options.id = _id;
            // delegate event
            _doInitFlashEvent(_options);
            // append flash
            _doInitDOM(_options);
            // check flash ready
            if (!_options.onready) return;
            _cache[_id] = _options.onready;
            _cache[_id+'-count'] = 0;
            _doCheckFlash(_id);
        };
    })();
    _seed_html = _e._$addHtmlTemplate('\
        {var hide  = defined("hidden")&&!!hidden}\
        {var param = defined("params")&&params||NEJ.O}\
        {var width = !hide?width:"1px",height = !hide?height:"1px"}\
        {if hide}<div style="position:absolute;top:0;left:0;width:1px;height:1px;z-index:10000;overflow:hidden;">{/if}\
        <object classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"\
                codebase = "http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"\
                width = "${width|default:"100px"}"\
                height = "${height|default:"100px"}" id="${id}">\
            <param value="${src}" name="movie">\
            {for x in param}\
            <param value="${x}" name="${x_key}"/>\
            {/for}\
            <embed src="${src}" name="${id}"\
                   width="${width|default:"100px"}"\
                   height="${height|default:"100px"}"\
                   pluginspage="http://www.adobe.com/go/getflashplayer"\
                   type="application/x-shockwave-flash"\
                   {for x in param}${x_key}="${x}" {/for}></embed>\
        </object>\
        {if hide}</div>{/if}\
    ');
    _x.isChange = !0;
};
NEJ.define(
    '{lib}util/flash/flash.js',[
    '{lib}util/template/jst.js',
    '{lib}util/timer/animation.js'
],f);
