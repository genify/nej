/*
 * ------------------------------------------
 * 三级联动区域选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/region/zh */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'util/event'
],function(NEJ,_k,_e,_u,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 三级联动区域选择控件
     * 
     * 结构举例
     * ```html
     * <div>
     *   <select id="a"></select>
     *   <select id="b"></select>
     *   <select id="c"></select>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/region/zh',
     *     'util/data/region/zh'
     * ],function(_t,_d){
     *     var _region = _t._$$RegionSelector._$allocate({
     *         province:'a',
     *         city:'b',
     *         area:'c',
     *         data:{province:'浙江省',city:'杭州市',area:'滨江区'},
     *         cache:_d._$$CacheRegionZH._$allocate(),
     *         onchange:function(_type){
     *             // 触发3次type，从area到province，搜索条件可能用到
     *         }
     *     });
     * });
     * ```
     * 
     * @class   module:util/region/zh._$$RegionSelector
     * @extends module:util/event._$$EventTarget
     * 
     * @param    {Object}      config   - 可选配置参数
     * @property {String|Node} province - 省份选择控件
     * @property {String|Node} city     - 城市选择控件
     * @property {String|Node} area     - 地区选择控件
     * @property {module:util/cache/list._$$CacheList} cache - 数据缓存实例
     * @property {Object}      data     - 初始地区信息，如{province:'浙江省',city:'杭州市',area:'滨江区'}
     * @property {module:util/cache/abstract._$$CacheListAbstract} cache - 省市区数据缓存实例，默认可使用util/data/region/zh下的数据
     */
    /** 
     * 区域变化触发事件
     * 
     * @event module:util/region/zh._$$RegionSelector#onchange
     * @param {String} event - 变化类型(province/city/area)
     */
    _p._$$RegionSelector = _k._$klass();
    _pro = _p._$$RegionSelector._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__cache = _options.cache;
        if (!this.__cache) return;
        var _nmap = {
            province:_e._$get(_options.province),
            city:_e._$get(_options.city),
            area:_e._$get(_options.area)
        };
        this.__selectors = _nmap;
        this.__offset = _nmap.province.options.length||0;
        this.__doInitDomEvent([
            [_nmap.area,'change',this.__onChange._$bind(this,'area')]
           ,[_nmap.city,'change',this.__onChange._$bind(this,'city')]
           ,[_nmap.province,'change',this.__onChange._$bind(this,'province')]
        ]);
        this.__cache._$setEvent(
            'onlistload',
            this.__onListLoad._$bind(this)
        );
        this.__doClearSelect(_nmap.province);
        this._$setRegion(_options.data,!0);
        this.__cache._$getList({key:'province'});
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__cache){
            this.__cache._$recycle();
            delete this.__cache;
        }
        delete this.__cache;
        delete this.__data;
        delete this.__selectors;
    };
    /**
     * 清理选择器
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__doClearSelect
     * @param  {Node} arg0 - 选择器
     * @return {Void}
     */
    _pro.__doClearSelect = function(_selector){
        if (!!_selector){
            _selector.options.length = this.__offset;
        }
    };
    /**
     * 选择器填充数据
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__doFillList
     * @param  {Node}  arg0 - 选择器
     * @param  {Array} arg1 - 数据列表
     * @return {Void}
     */
    _pro.__doFillList = function(_selector,_list){
        if (!_selector) return;
        _u._$forEach(
            _list,function(_value){
                _selector.add(new Option(_value,_value));
            }
        );
        _e._$setStyle(
            _selector,'display',
            !_list||!_list.length?'none':''
        );
    };
    /**
     * 设置值
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__doSetValue
     * @param  {String} arg0 - 类型
     * @return {Void}
     */
    _pro.__doSetValue = function(_type){
        var _value = this.__data[_type]||'';
        if (!!_value){
            this.__selectors[_type].value = _value;
            delete this.__data[_type];
        }
        this.__onChange(_type);
    };
    /**
     * 选择变化
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__onChange
     * @param  {String} arg0 - 变化类型，province/city/area
     * @return {Void}
     */
    _pro.__onChange = function(_type){
        var _nmap = this.__selectors,
            _value = _nmap.province.value;
        switch(_type){
            case 'province':
                this.__doClearSelect(_nmap.city);
                this.__doClearSelect(_nmap.area);
                // init show e.g. municipality
                if (!this.__cache._$hasArea(_value)){
                    _e._$setStyle(_nmap.area,'display','none');
                    if (!_nmap.area){
                        _e._$setStyle(_nmap.city,'display','none');
                        break;
                    }else{
                        _e._$setStyle(_nmap.city,'display','');
                    }
                }else{
                    _e._$setStyle(_nmap.area,'display','');
                    _e._$setStyle(_nmap.city,'display','');
                }
                // get city list
                if (!!_nmap.city&&!!_value){
                    this.__cache._$getList({key:'city-'+_value});
                }
            break;
            case 'city':
                this.__doClearSelect(_nmap.area);
                var _city = _nmap.city.value;
                if (!_city) return;
                this.__cache._$getList({key:'area-'+_value+'-'+_city});
            break;
        }
        this._$dispatchEvent('onchange',_type);
    };
    /**
     * 区域列表载入回调
     * 
     * @protected
     * @method module:util/region/zh._$$RegionSelector#__onListLoad
     * @param  {Object} arg0 - 列表信息
     * @return {Void}
     */
    _pro.__onListLoad = function(_options){
        var _key  = _options.key,
            _type = _key.split('-')[0],
            _node = this.__selectors[_type];
        this.__doFillList(
            _node,this.__cache.
            _$getListInCache(_key)
        );
        this.__doSetValue(_type);
    };
    /**
     * 设置区域信息
     * 
     * 脚本举例
     * ```javascript
     * _region._$setRegion({
     *     province:'浙江省',
     *     city:'杭州市',
     *     area:'下城区'
     * });
     * ```
     * @method module:util/region/zh._$$RegionSelector#_$setRegion
     * @param    {Object} arg0     - 区域信息，如{province:'浙江省',city:'杭州市',area:'滨江区'}
     * @property {String} province - 省
     * @property {String} city     - 市
     * @property {String} area     - 区
     * @return   {Void}
     */
    _pro._$setRegion = function(_data,_nochange){
        this.__data = _data||_o;
        if (!_nochange){
            this.__doSetValue('province');
        }
    };
    
    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
