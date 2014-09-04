var f = function(){
	var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _p = _('nej.ut'),
		_j = _('nej.j'),
        _proCacheCustom;
	_p._$$CacheCustom = NEJ.C();
    _proCacheCustom = _p._$$CacheCustom._$extend(_p._$$CacheAbstract);

	_proCacheCustom.__reset = function(_options){
		this.__supReset(_options);
		this.__getCache(_options._id);
	};

	_proCacheCustom.__getCache = function(_id){
		var _cache = {};
		if (!!_id){
            _cache = this.__cache[_id];
            if (!_cache){
                _cache = {};
                this.__cache[_id] = _cache;
            }
        }
		this.__myCache = _cache;
	};

	/**
	 * 从cache中获取数据
	 * @param {Object} _id
	 */
	_proCacheCustom._$getItemInCache = function(_rkey){
		// 这里去缓存中拿
		return this.__myCache[_rkey];
	}

	/**
	 * 对外保留的获取数据接口
	 */
	_proCacheCustom._$getData = (function(){
		return function(_id,_key){
            var _rkey = _id+_key;
            var _ropt = {id:_id,key:_key||''},
                _item = this._$getItemInCache(_rkey);
            if (!!_item){
                this._$dispatchEvent('ondataload',_ropt);
                return this;
            }
            if (!this.__doQueueRequest(_rkey,
                 this._$dispatchEvent._$bind(this,'ondataload'))){
                _ropt.rkey = _rkey;
                _ropt.onload = this.__getData._$bind(this,_ropt);
                this._$dispatchEvent('dodataload',_ropt);
            }
            return this;
        };
	})();

	_proCacheCustom.__doSaveToCache = function(_rkey,_data){
		if(!this.__myCache[_rkey])
		  this.__myCache[_rkey] = _data;
	}

	/**
	 * 请求返回数据后处理
	 * @param {Object} _ropt
	 * @param {Object} _data
	 */
	_proCacheCustom.__getData = function(_ropt,_data){
		_ropt = _ropt||_o;
		// 这里缓存到列表中去
        this.__doSaveToCache(_ropt.rkey,_data);
        this.__doCallbackRequest(_ropt.rkey,_ropt);
	};
}
define('{pro}cache.custom.js',['{lib}util/cache/cache.js'],f);
