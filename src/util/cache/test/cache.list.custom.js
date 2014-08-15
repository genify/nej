var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _p = _('nej.ut'),
        _j = _('nej.j'),
        _v = _('nej.v'),
        _proCacheListCustom,
        _supCacheListCustom;
    _p._$$CacheListCustom = NEJ.C();
    _proCacheListCustom = _p._$$CacheListCustom._$extend(_p._$$AbstractListCache);
    _supCacheListCustom = _proCacheListCustom._$supro;
	
	_proCacheListCustom.__doLoadList = function(_options){
		var _key    = _options.key;
		var _data   = _options.data;
		var _offset = _options.offset;
		var _limit  = _options.limit;
		var _rkey   = _options.rkey;
		var _onload = _options.onload;
        // for test
        var _arr = [];
        var _len = _options.offset>=30?4:_options.limit;
        for(var i=0;i<_len;i++){
            _arr.push({id:+new Date+i,name:'user-'+(+new Date +i),loginTime:+new Date});
        }
        if (_options.offset==0){
            this._$setTotal(_options.key,34);
        }
        window.setTimeout(_options.onload._$bind(_options,_arr),1000);
//		_j._$request('http://123.163.com:3000/xhr/getLog',{
//                type:'json',
//                method:'POST',
//                data:{offset:_offset,limit:_limit},
//                timeout:1000,
//                onload:_onload._$bind(this),
//                onerror:function(_error){
//				}
//            }
//        );
	};
	
	/**
     * 从服务器中获取一项
     * @param {Object} _options
     */
	_proCacheListCustom.__doLoadItem = function(_options){
        var _id     = _options.id;
        var _key    = _options.key;
        var _rkey   = _options.rkey;
        var _onload = _options.onload;
        _j._$request('http://123.163.com:3000/xhr/getLog',{
                type:'json',
                method:'POST',
                data:{rkey:_rkey},
                timeout:1000,
                onload:_onload._$bind(this),
                onerror:function(_error){}
            }
        );
    };
	
    /**
     * 增加一项到服务器
     * @param {Object} _options
     */
	_proCacheListCustom.__doAddItem = function(_options){
        var _key  = _options.key;
        var _item = _options.item;
		var _push = _options.push;
        var _onload = _options.onload;
        _j._$request('http://123.163.com:3000/xhr/getLog',{
                type:'json',
                method:'POST',
                data:{},
                timeout:1000,
                onload:_onload._$bind(this),
                onerror:function(_error){}
            }
        );
    };
	
	/**
     * 从服务器中删除一项
     * @param {Object} _options
     */
	_proCacheListCustom.__doDeleteItem = function(_options){
        // var _id     = _options.id;
        // var _key    = _options.key;
        // var _rkey   = _options.rkey;
        // var _onload = _options.onload;
        // _j._$request('http://123.163.com:3000/xhr/getLog',{
        //         type:'json',
        //         method:'POST',
        //         data:{rkey:_rkey},
        //         timeout:1000,
        //         onload:_onload._$bind(this),
        //         onerror:function(_error){}
        //     }
        // );
        // for test
        window.setTimeout(function(){
            var _event = _options.onload(!0);
            // _v._$dispatchEvent(
            //     _p._$$CacheListCustom,'listchange',_event);
        },500);
    };
	
	/**
     * 更新服务器中的一项
     * @param {Object} _options
     */
	_proCacheListCustom.__doUpdateItem = function(_options){
        var _id     = _options.id;
        var _key    = _options.key;
        var _rkey   = _options.rkey;
        var _onload = _options.onload;
        _j._$request('http://123.163.com:3000/xhr/getLog',{
                type:'json',
                method:'POST',
                data:{rkey:_rkey},
                timeout:1000,
                onload:_onload._$bind(this),
                onerror:function(_error){}
            }
        );
    };
    
}
define('{pro}cache.list.custom.js',['{lib}util/event/event.js','{lib}util/cache/abstract.js'],f);

