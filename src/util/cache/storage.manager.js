/*
 * ------------------------------------------
 * 持久化数据管理器实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _f = NEJ.F,
        _u = _('nej.u'),
        _j = _('nej.j'),
        _p = _('nej.ut'),
        _proStorageManager;
    if (!!_p._$$StorageManager) return;
    /**
     * 分块持久化数据管理器
     * 
     * @class   {nej.ut._$$StorageManager}
     * @extends {nej.ut._$$Cache}
     * 
     * @param   {Object} 配置参数
     * @config  {String} key	数据标识键名称，默认为id
     * @config  {String} prefix 存储键前缀，也用于标识数据块，相同前缀的数据为同一份
     * 
     * 
     */
    _p._$$StorageManager = NEJ.C();
      _proStorageManager = _p._$$StorageManager._$extend(_p._$$Cache);
    /**
     * 控件重置
     * @param  {Object} 配置参数
     * @return {Void}
     */
    _proStorageManager.__reset = function(_options){
    	this.__supReset(_options);
    	this.__seed = +new Date;
    	this.__pkey = _options.key||'id';
    	this.__prefix = ''+(_options.prefix||'');
    	this.__doBuildStorage();
    };
    /**
     * 控件销毁
     * @return {Voie}
     */
    _proStorageManager.__destroy = function(){
    	this.__supDestroy();
    	
    };
    /**
     * 取索引块数据，索引数据结构：
     * [code]
     *   {
     *      'id':{
     *          r:1,        // 引用计数
     *          b:'block'   // 所在块名称
     *      }
     *   }
     * [/code]
     * @return {Object} 索引块数据
     */
    _proStorageManager.__getIndexMap = function(){
        return this.__getDataLocalWithDefault(this.__prefix+'index',{});
    };
    /**
     * 持久化索引块数据
     * @return {Void}
     */
    _proStorageManager.__doFlushIndexMap = function(){
        this.__setDataInStorage(
            this.__prefix+'index',
            this.__getIndexMap()
        );
    };
    /**
     * 取数据缓存集合，数据缓存
     * @return {Object} 数据缓存集合
     */
    _proStorageManager.__getDataMap = function(){
        return this.__getDataInCacheWithDefault(_prefix+'data',{});
    };
    /**
     * 取块信息集合
     * @return {Object} 块信息集合
     */
    _proStorageManager.__getBlockMap = function(){
        return this.__getDataInCacheWithDefault(_prefix+'block',{});
    };
    /**
     * 构建存储结构
     * @return {Void}
     */
    _proStorageManager.__doBuildStorage = function(){
    	// index data map: {id:{r:2,b:'xx'}}
    	// r - data reference count
    	// b - block key name flag
    	var _prefix = this.__prefix,
    	    _data = this.__getDataInCacheWithDefault(_prefix+'data',{}),
    	    _blok = this.__getDataInCacheWithDefault(_prefix+'block',{});
    	_u._$forIn(
    		this.__getDataLocalWithDefault(_prefix+'index',{}),
    		function(_item,_id,_map){
    			if (!_data[_id]){
    				NEJ.X(_data,this.__getDataInStorage(_prefix+_item.b));
    			}
    			// remove error data
    			if (!_data[_id]){
    				delete _map[_id];
    				return;
    			}
    			// remove redundancy
    			if (_item.r==0){
    				this._$delete(_data[_id]);
    				return;
    			}
    			// init block data list
    			var _list = _blok[_item.b]||[];
    			_list.push(_id);
    			_blok[_item.b] = _list;
    		},this
    	);
    };
    /**
     * 生成块标识
     * @return {Void}
     */
    _proStorageManager.__doGenBlockKey = function(_data){
        var _event = {data:_data};
        this._$dispatchEvent('onhash',_event);
        if (_event.value!=null){
            return _event.value;
        }
        return crc32(_data[this.__pkey])%this.__size;
    };
    /**
     * 添加ID至块队列中
     * @return {Void}
     */
    _proStorageManager.__doAddID2BlockList = function(_key,_id){
        var _block = this.__getDataInCache(this.__prefix+'block'),
            _list = _block[_key];
        if (!_list){
            _list = [];
            _block[_key] = _list;
        }
        var _index = _u._$indexOf(_list,_id);
        if (_index<0){
            _list.push(_id);
            this.__doFlushBlock2Storage(_key);
        }
    };
    /**
     * 持久化某块数据
     * @return {Void}
     */
    _proStorageManager.__doFlushBlock2Storage = function(_key){
        var _map = {},
            _prfx = this.__prefix,
            _data = this.__getDataInCache(_prfx+'data');
        _u._$forEach(
            this.__getDataInCache(_prfx+'block')[_key],
            function(_id){
                var _item = _data[_id];
                if (!!_item) _map[_id] = _item;
            },this
        );
        this.__setDataInStorage(_prfx+_key,_map);
    };
    /**
     * 取单项数据
     * @param  {String} 项标识
     * @return {Object} 项数据
     */
    _proStorageManager._$get = function(_id){
    	return this.__getDataInCacheWithDefault(this.__prefix+'data',{})[_id];
    };
    /**
     * 添加数据
	 * @param  {Object|Array} 数据或列表
	 * @return {Void}
     */
    _proStorageManager._$add = function(_data){
        if (!_data) return;
    	var _id = _data[this.__pkey],
    	    _ikey = this.__prefix+'index',
    	    _imap = this.__getDataInCache(_ikey),
    	    _iref = _imap[_id];
    	if (!!_iref){
    	    _iref.r++;
    	}else{
    	    var _bkey = this.__doGenBlockKey(_data);
    	    _imap[_id] = {r:1,b:_bkey};
    	    this.__doAddID2BlockList(_bkey,_id);
    	}
    	this.__setDataLocal(_ikey,_imap);
    };
    /**
     * 删除数据
     * @param  {String|Array} 数据标识列表
     * @return {Void}
     */
    _proStorageManager._$delete = function(_data){
    	
    };
    
};
NEJ.define('{lib}util/cache/storage.manager.js',
          ['{lib}util/cache/cache.js'
          ,'{lib}util/encode/crc32.js'],f);