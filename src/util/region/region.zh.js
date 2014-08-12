/*
 * ------------------------------------------
 * 三级联动区域选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pro;
    if (!!_p._$$RegionSelector) return;
    /**
     * 三级联动区域选择控件<br />
     * 页面结构举例
     * [code type="html"]
     *   <div>
     *       <select id="a"></select>
     *       <select id="b"></select>
     *       <select id="c"></select>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *  var _rsr = _p._$$RegionSelector._$allocate({
     *       province:'a',
     *       city:'b',
     *       area:'c',
     *       data:{province:'浙江省',city:'杭州市',area:'滨江区'},
     *       onchange:function(_type){
     *           // 触发3次type，从area到province，搜索条件可能用到
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$RegionSelector} 三级联动区域选择控件
     * @extends {nej.ut._$$EventTarget}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node}                   province 省份选择控件
     * @config  {String|Node}                   city     城市选择控件
     * @config  {String|Node}                   area     地区选择控件
     * @config  {nej.ut._$$AbstractListCache}   cache    数据缓存实例
     * @config  {Object}                        data     初始地区信息，如{province:'浙江省',city:'杭州市',area:'滨江区'}
     * 
     * [hr]
     * 区域变化触发事件
     * @event   {onchange} 
     * @param   {String}   变化类型(province/city/area)
     * 
     */
    _p._$$RegionSelector = NEJ.C();
    _pro = _p._$$RegionSelector._$extend(_p._$$EventTarget);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        var _nmap = {
            province:_e._$get(_options.province)
           ,city:_e._$get(_options.city)
           ,area:_e._$get(_options.area)
        };
        this.__selectors = _nmap;
        this.__offset = _nmap.province.options.length||0;
        this.__doInitDomEvent([
            [_nmap.area,'change',this.__onChange._$bind(this,'area')]
           ,[_nmap.city,'change',this.__onChange._$bind(this,'city')]
           ,[_nmap.province,'change',this.__onChange._$bind(this,'province')]
        ]);
        this.__cache = _options.cache||
            _p._$$RegionCacheZH._$allocate();
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
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
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
     * @protected
     * @method {__doClearSelect}
     * @param  {Node} 选择器
     * @return {Void}
     */
    _pro.__doClearSelect = function(_selector){
        if (!!_selector){
            _selector.options.length = this.__offset;
        }
    };
    /**
     * 选择器填充数据
     * @protected
     * @method {__doFillList}
     * @param  {Node}  选择器
     * @param  {Array} 数据列表
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
     * @protected
     * @method {__doSetValue}
     * @param  {String} 类型
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
     * @protected
     * @method {__onChange}
     * @param  {String} 变化类型，province/city/area
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
     * @protected
     * @method {__onListLoad}
     * @param  {Object} 列表信息
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
     * 设置区域信息<br/>
     * 脚本举例
     * [code]
     *   _rsr._$setRegion({province:'浙江省',city:'杭州市',area:'下城区'})
     * [/code]
     * @method {_$setRegion}
     * @param  {Object} 区域信息，如{province:'浙江省',city:'杭州市',area:'滨江区'}
     * @config {String} province 省
     * @config {String} city     市
     * @config {String} area     区
     * @return {nej.ut._$$RegionSelector}
     */
    _pro._$setRegion = function(_data,_nochange){
        this.__data = _data||_o;
        if (!_nochange)
            this.__doSetValue('province');
        return this;
    };
};
NEJ.define(
    '{lib}util/region/region.zh.js',[
    '{lib}util/event.js'
],f);
