define([
    'base/klass',
    'util/cache/abstract'
],function(_k,_d,_p,_pro){

    _p._$$Cache = _k._$klass();
    _pro = _p._$$Cache._$extend(_d._$$CacheListAbstract);

    /**
     * 从服务器端载入列表，子类实现具体逻辑
     *
     * @abstract
     * @method   module:util/cache/abstract._$$CacheListAbstract#__doLoadList
     * @param    {Object}   arg0   - 请求信息
     * @property {String}   key    - 列表标识
     * @property {Number}   offset - 偏移量
     * @property {Number}   limit  - 数量
     * @property {String}   data   - 请求相关数据
     * @property {Function} onload - 列表项载入回调
     * @return   {Void}
     */
    _pro.__doLoadList = function(_options){
        //var _ret = [];
        //for(var i= 0;i<_options.limit;i++){
        //    _ret.push({
        //        id:_options.offset+i,
        //        name:'test-'+(+new Date)
        //    });
        //}
        //_options.onload({
        //    result:_ret
        //});
        //console.log('request from server');
        //_options.onload(null);
        //this._$dispatchEvent('onerror');
        _options.onload([]);
    };

    return _p;
});