/**
 * ------------------------------------------
 * Trident引擎(ie6)对API增强实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.p'),
        _h = _('nej.h');
    if (_p._$NOT_PATCH.trident0) return;
    var _seed  = +new Date;
        _cache = {};
    /**
     * 节点hover行为，高版本浏览器用样式处理
     * @param  {String|Node} _element 节点
     * @param  {String}      _clazz   样式
     * @return {Void}
     */
    _h.__hoverElement = 
    _h.__hoverElement._$aop(function(_event){
        _event.stopped = !0;
        var _args = _event.args,
            _id   = _e._$id(_args[0]),
            _key  = 'hover-'+_id;
        // cache hovered element
        if (!_id||!!_cache[_key]) 
            return;
        _cache[_key] = !0;
        // hover element
        _v._$addEvent(_id,'mouseenter',
           _e._$addClassName._$bind(_e,_id,_args[1]));
        _v._$addEvent(_id,'mouseleave',
           _e._$delClassName._$bind(_e,_id,_args[1]));
    });
    /**
     * 节点fixed定位，高版本浏览器用样式处理
     * @param  {Node} 节点
     * @return {Void}
     */
    _h.__fixedElement = (function(){
        // 
        var _doScrollCheck = function(){
            
        };
        return _h.__fixedElement._$aop(
               function(_event){
                   _event.stopped = !0;
                   var _element = _event.args[0],
                       _id = 'fixed-'+_e._$id(_element);
                   // check cache
                   if (!!_cache[_id])
                       return;
                   var _conf = {};
                   _cache[_id] = _conf;
                   // init position
                   
                   
               });
    })();
    
    /**
     * 节点占全屏
     * @param  {Node} _element 节点
     * @return {Void}
     */
    _h.__fullScreen =
    _h.__fullScreen._$aop(function(_event){
        _event.stopped = !0;
        var _element  = _event.args[0],
            _style    = _element.style,
            _viewport = _e._$getPageBox();
        _style.width  = _viewport.scrollWidth+'px';
        _style.height = _viewport.scrollHeight+'px';
    });
    /**
     * 为节点增加用于盖select/flash等控件的层
     * @param  {Node} _element 节点
     * @return {Node}          盖层节点
     */
    _h.__mask = 
    _h.__mask._$aop(function(_event){
        _event.stopped = !0;
        var _element = _event.args[0],
            _mask = _cache[_element.msk];
        if (!_mask){
            _element.msk = _seed++;
            _mask = _e._$create('iframe');
            _mask.style.position = 'absolute';
            _cache[_element.msk] = _mask;
        }
        _event.value = _mask;
        var _style = _mask.style;
        _style.top = (parseInt(_e._$getStyle
                     (_element,'top'))||0)+'px';
        _style.left = (parseInt(_e._$getStyle
                      (_element,'left'))||0)+'px';
        _style.width = _element.offsetWidth+'px';
        _style.height = _element.offsetHeight+'px';
        _element.insertAdjacentElement('beforeBegin',_mask);
    });
    /**
     * 去除用于盖select/flash等控件的层
     * @param  {Object} _element 节点
     * @return {Void}
     */
    _h.__unmask = 
    _h.__unmask._$aop(function(_event){
        _event.stopped = !0;
        var _mask = _cache[_event.args[0].msk];
        if (!!_mask) _e._$removeByEC(_mask);
    });
    /**
     * 将Hash推入历史
     * @param  {String} _hash HASH值
     * @return {Void}
     */
    _h.__pushHistory = (function(){
        var _timer,
            _iframe,
            _queue = [],
            _hflag = 'cb-'+(+new Date),
            _content = '<script>parent.nej.h["'+_hflag+'"] = !0;parent.location.hash = decodeURIComponent("#<HASH>");</scr'+'ipt>';
        var _doCheckQueue = function(){
            _timer = window.clearTimeout(_timer);
            if (!_queue.length) return;
            var _hash = _queue.shift();
            try{
                var _document = _iframe.contentWindow.document;
                _document.open();
                _document.write('<head><title>');
                _document.write(document.title);
                _document.write('</title>');
                _document.write(_content.replace('#<HASH>'
                               ,encodeURIComponent(_hash)));
                _document.write('</head>');
                if (location.hostname!=document.domain)
                    _document.domain = document.domain;
                _document.close();
                _h[_hflag] = !1;
            }catch(ex){
                alert(ex.message||ex);
                _queue.unshift(_hash);
            }
            _timer = window.setTimeout(_doCheckQueue,50);
        };
        return _h.__pushHistory._$aop(
               function(_event){
                   _event.stopped = !0;
                   var _hash = _event.args[0];
                   if (!!_h[_hflag]||
                      (!_iframe&&!_hash)) return;
                   _queue.push(_hash);
                   if (!_iframe)
                       _iframe = _e._$createXFrame();
                   _doCheckQueue();
               });
    })();
};
define('{lib}patched/trident-0/api.js',
      ['{lib}patched/api.js'],f);