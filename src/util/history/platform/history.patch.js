var f = function(){
	// ie6-8
	NEJ.patch('2.0<TR<=4.0',function(){
		var _  = NEJ.P,
			_e = _('nej.e'),
			_h = _('nej.h');
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
	                _document.write('</head><body></body>');
	                if (location.hostname!=document.domain)
	                    _document.domain = document.domain;
	                _document.close();
	                _h[_hflag] = !1;
	            }catch(ex){
	                console.log(ex.message||ex);
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
	                       _iframe = 
	                   	_e = _e._$createXFrame();
	                   _doCheckQueue();
	                });
	    })();
	});
};
define(['./history.js'],f);