var f = function(_h,_u,_v,_t,_p){
	// ie6-9
	NEJ.patch('2.0<=TR<=5.0',['{lib}base/util.js',
					    	  '{lib}util/event/event.js',
					    	  '{lib}util/encode/json.js'],
	function(){
		if (CMPT){
			var _  = NEJ.P,
		        _h = _('nej.h'),
		        _u = _('nej.u'),
		        _v = _('nej.v'),
		        _t = _('nej.ut');
		}
	    // ie8-9 only support string data
	    if (!!window.postMessage){
	        /**
	         * 解析消息传递数据
	         * @param  {Variable} 数据
	         * @return {Variable} 数据
	         */
	        _h.__formatPassData = 
	        _h.__formatPassData._$aop(function(_event){
	            _event.stopped = !0;
	            _event.value = JSON.stringify(_event.args[0]);
	        });
	        return;
	    } 
	    var _key = 'MSG|',
	        _queue = [];
	    /*
	     * 检测window.name变化情况
	     * @return {Void}
	     */
	    var _doCheckWindowName = function(){
	        // check name
	        var _name = unescape(window.name||'').trim();
	        if (!_name||_name.indexOf(_key)!=0) return;
	        window.name = '';
	        // check result
	        var _result = _u._$string2object(_name.replace(_key,''),'|'),
	            _origin = (_result.origin||'').toLowerCase();
	        // check origin
	        if (!!_origin&&_origin!='*'&&
	            location.href.toLowerCase().indexOf(_origin)!=0)
	            return;
	        // dispatch onmessage event
	        _v._$dispatchEvent(window,'message',{
	            data:JSON.parse(_result.data||'null'),
	            source:window.frames[_result.self]||_result.self,
	            origin:_h.__formatOrigin(_result.ref||document.referrer)
	        });
	    };
	    /*
	     * 检测window.name设置队列
	     * @return {Void}
	     */
	    var _doCheckNameQueue = (function(){
	        var _checklist;
	        // set window.name
	        var _doSetWindowName = function(_map,_index,_list){
	            if (_u._$indexOf(_checklist,_map.w)<0){
	                _checklist.push(_map.w);
	                _list.splice(_index,1);
	                _map.w.name = _map.d;
	            }
	        };
	        return function(){
	            _checklist = [];
	            _u._$reverseEach(_queue,_doSetWindowName);
	            _checklist = null;
	        };
	    })();
	    /**
	     * 跨文档发送数据
	     * @param  {Window} 窗体对象
	     * @param  {Object} 发送配置
	     * @return {Void}
	     */
	    _h.__postMessage = (function(){
	        // serialize send data
	        var _doSerialize = function(_data){
	            var _result = {};
	            _data = _data||_o;
	            _result.origin = _data.origin||'';
	            _result.ref  = location.href;
	            _result.self = _data.source;
	            _result.data = JSON.stringify(_data.data);
	            return _key+_u._$object2string(_result,'|',!0);
	        };
	        // function body
	        return _h.__postMessage._$aop(function(_event){
	            _event.stopped = !0;
	            var _args = _event.args;
	            _queue.unshift({w:_args[0],d:escape(_doSerialize(_args[1]))});
	        });
	    })();
	    // init window onmessage event
	    _t._$$CustomEvent._$allocate({
	        element:window,
	        event:'message'
	    });
	    window.setInterval(_doCheckNameQueue,100);
	    window.setInterval(_doCheckWindowName,20);
	});
};
define(['./message.js'],f);