/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './history.js',
    '{lib}base/element.js'
],function(_h,_e,_p,_o,_f,_r){
	// for ie8-
	NEJ.patch('TR<=4.0',function(){
	    window.hst_lock = {};
		/**
	     * 将Hash推入历史
	     * @param  {String} HASH值
	     * @return {Void}
	     */
	    _h.__pushHistory = (function(){
	        var _timer,
	            _iframe,
	            _queue = [],
	            _hflag = 'cb-'+(+new Date),
	            _content = '<script>parent.hst_lock["'+_hflag+'"] = !0;parent.location.hash = decodeURIComponent("#<HASH>");</scr'+'ipt>';
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
	                _document.write(
	                    _content.replace(
	                        '#<HASH>',
	                        encodeURIComponent(_hash)
	                    )
	                );
	                _document.write('</head><body></body>');
	                if (location.hostname!=document.domain){
	                    _document.domain = document.domain;
	                }
	                _document.close();
	                hst_lock[_hflag] = !1;
	            }catch(ex){
	                console.log(ex.message||ex);
	                _queue.unshift(_hash);
	            }
	            _timer = window.setTimeout(_doCheckQueue,50);
	        };
	        return function(_hash){
               if (!!_h[_hflag]||(!_iframe&&!_hash)){
                   return;
               }
               _queue.push(_hash);
               if (!_iframe){
                   _iframe = _e._$createXFrame();
               }
               _doCheckQueue();
            };
	    })();
	});
    
    return _h;
});
