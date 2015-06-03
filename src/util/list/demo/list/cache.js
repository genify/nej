NEJ.define([
	'base/klass',
	'base/event',
	'util/event/event',
	'util/cache/abstract'
],function(_k,_v,_z,_t,_p,_pro){
	/**
	 *
	 */
	_p._$$CustomCache = _k._$klass();
	_pro = _p._$$CustomCache._$extend(_t._$$CacheListAbstract);
	/**
	 *
	 * @param _options
	 * @private
	 */
	_pro.__doLoadList = function(_options){

		// for test
		var _arr = [],
			_total = 104,
			_count = Math.floor(_total/_options.limit),
			_number = _count*_options.limit;
		var _len = _options.offset>=_number?_total-_number:_options.limit;
		for(var i=0;i<_total;i++){
			_arr.push({id:+new Date+i,name:'user-'+(+new Date+i),loginTime:+new Date});
		}
		if (_options.offset==0){
			this._$setTotal(_options.key,_total);
		}
		window.setTimeout(_options.onload._$bind(_options,_arr),1000);

	};
	/**
	 * 从服务器上删除列表项，子类实现具体逻辑
	 * @protected
	 * @method {__doDeleteItem}
	 * @param   {Object}   请求信息
	 * @config  {String}   key      列表标识
	 * @config  {Number}   id       列表项标识
	 * @config  {String}   data     请求相关数据
	 * @config  {Function} onload   列表项载入回调
	 * @return {Void}
	 */
	_pro.__doDeleteItem = function(_options){
		/*
		 _j._$request(
		 '/rest/data/delete',{
		 // ...
		 onload:function(_json){
		 // remove from cache
		 var _event = _options.onload(!0);
		 // refresh list view
		 _v._$dispatchEvent(
		 _p._$$CustomCache,
		 'listchange',_event
		 );
		 }
		 }
		 );
		 */
		// for test
		window.setTimeout(function(){
			var _event = _options.onload(!0);
			_v._$dispatchEvent(
				_p._$$CustomCache,
				'listchange',_event
			);
		},500);
	};

	/**
	 * 从服务器上删除列表项，子类实现具体逻辑
	 * @protected
	 * @method {__doDeleteItem}
	 * @param   {Object}   请求信息
	 * @config  {String}   key      列表标识
	 * @config  {Number}   id       列表项标识
	 * @config  {String}   data     请求相关数据
	 * @config  {Function} onload   列表项载入回调
	 * @return {Void}
	 */
	_pro.__doUpdateItem = function(_options){

		// for test
		window.setTimeout(function(){
			_options.data.name = 'up-'+(+new Date);
			var _event = _options.onload(_options.data);
			_v._$dispatchEvent(
			    _p._$$CustomCache,
				'listchange',_event
			);
		},500);

	};

	_z._$$CustomEvent._$allocate({
		element:_p._$$CustomCache,
		event:'listchange'
	});

	return _p;
});
