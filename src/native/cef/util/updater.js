/**
 * ------------------------------------------
 * 更新控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _u = _('nej.u'),
        _j = _('nej.j'),
        _t = _('nej.ut'),
        _n = _('nej.n'),
        _p = _('nej.cef.ut'),
        _updater = _('window.update'),
        _proUpdater;
    /**
     * 更新控件
     * 
     * 脚本举例：
     * [code]
     *     nej.cef.ut._$$Updater._$allocate({
     *         url:'http://igame.163.com/api/pc/version'
     *         files:{
     *             core:'orpheus_install.exe',
     *             orpheus:'orpheus.ntpk',
     *             native:'native.ntpk'
     *         },
     *         onbeforeupdate:function(_event){
     *             // _event.version
     *             // _event.content
     *             _event.stopped = window.confirm('检测到新版本，是否立即更新?');
     *         },
     *         onprogress:function(_event){
     *             // _event.loaded
     *             // _event.total
     *         },
     *         onstatechange:function(_event){
     *             // _event.state==4 -> update success
     *         }
     *     })._$check();
     * [/code]
     * 
     * @class   {nej.cef.ut._$$Updater}
     * @extends {nej.ut._$$Event}
     * 
     * @param   {Object} 可选配置参数
     * @config  {String} url   更新服务器版本检查地址
     * @config  {Object} files 需更新的文件ID和名称映射关系，如 {'core':'orpheus_install.exe'}
     * 
     * [hr]
     * 更新状态变化触发事件，状态值信息表：
     * [ntb]
     *   状态值  |  描述
     *   ---------------------
     *   0    |  更新失败
     *   1    |  更新中
     *   2    |  暂停
     *   3    |  取消
     *   4    |  更新成功
     *   5    |  没有更新
     * [/ntb]
     * @event   {onstatechange}
     * @param   {Object} 状态信息
     * @config  {Number} state   状态值，见描述
     * @config  {String} version 版本信息
     * @config  {String} content 版本更新内容
     * 
     * [hr]
     * 开始更新之前触发事件
     * @event   {onbeforeupdate}
     * @param   {Object} 更新信息
     * @config  {String} version 版本信息
     * @config  {String} content 更新内容
     * 
     * [hr]
     * 更新过程触发事件
     * @event   {onprogress}
     * @param   {Object} 过程信息
     * @config  {String} file    当前下载的文件名
     * @config  {Number} percent 当前文件下载进度，1-100
     * @config  {Number} loaded  总进度，1-100
     * @config  {Number} total   总共需要下载文件个数
     * 
     */
    _p._$$Updater = NEJ.C();
      _proUpdater = _p._$$Updater._$extend(_t._$$Event);
    /**
     * 控件初始化
     * @return {Void}
     */
    _proUpdater.__init = function(){
        update.onupdateprogress =this.__onNativeEvent._$bind(this);
        this.__supInit();
    };
    /**
     * 控件重置
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proUpdater.__reset = function(_options) {
        this.__supReset(_options);
        this.__url = _options.url||'';
        this.__map = _options.files||_o;
    };
    /**
     * 服务器端获取版本回调
     * @param  {Object} 版本信息
     * @return {Void}
     */
    _proUpdater.__cbVersionCheck = (function(){
        // check version
        var _doCheckVersion = function(_item){
            // illegal module
            var _mid = _item.id,
                _file = this.__map[_item.id].name,
                _type = this.__map[_item.id].type;
            if (!_file) return;
            // check module update
            if (_hasUpdate(_mid,_item.versionNum)){
                this.__upcount++;
                this.__updateItem.push({
                    filename:_file,
                    url:_item.downloadUrl,
                    md5:_item.md5||'md5',
                    installtype:_type
                });
                /*
                _n._$exec(
                    'startUpdate',{}
                    _file,_item.downloadUrl,
                    _item.md5||'md5',_mid=='core'?1:0
                );
                */
            }
        };
        // check version match
        var _hasUpdate = function(_id,_version){
            var _ver = _n._$exec('update.getVersion',_id)||'';
            if (_u._$isObject(_ver)){
                _ver = [_ver.build,_ver.major,_ver.revision].join('.');
            }
            var _big = !0,
                _arr1 = _ver.split('.'),     // local
                _arr2 = _version.split('.'), // server
                _index = _u._$indexOf(_arr2,function(_number,_idx){
                    _big = _big&&(Number(_number)>=Number(_arr1[_idx]));
                    return _big&&(Number(_number)>Number(_arr1[_idx]));
                });
            return _index>=0;
        };
        return function(_json){
            if (_json.code!=200){
                this._$dispatchEvent('onstatechange',{
                    state:0
                });
                return;
            }
            // save version
            this.__version = {
                version:_json.version,
                content:_json.updateContent
            };
            // check update
            this.__upcount = 0;
            this.__updateItem =[];
            _u._$forEach(
                _json.fileContents,
                _doCheckVersion,this
            );
            if (!this.__upcount){
                    var _event = NEJ.X({state:5},this.__version);
                this._$dispatchEvent('onstatechange',_event);
                return;
            }
            // confirm update
            var _event = NEJ.X({},this.__version);
            this._$dispatchEvent('onbeforeupdate',_event);
            if (!_event.stopped) this._$start();
        };
    })();
    /**
     * 更新回调
     * @param  {String} 事件名
     * @return {Void}
     */
     _proUpdater.__onNativeEvent = function(_curfile, _filePercent, _totalPercent, _end, _suc){
             this._$dispatchEvent('onprogress',{file:_curfile,percent:_filePercent,totalPercent:_totalPercent,end:_end,suc:_suc});
             if(_end)
                    console.log('updatend');
        }
    
    /**
     * 检查更新
     * @return {Void}
     */
    _proUpdater._$check = function(){
        _j._$request(this.__url,{
            type:'json',
            method:'GET',
            onload:this.__cbVersionCheck._$bind(this),
            onerror:this.__cbVersionCheck._$bind(this,_o)
        });
    };
    /**
     * 开始更新
     * @return {Void}
     */
    _proUpdater._$start = function(){
        var _event = NEJ.X({state:1},this.__version);
        this._$dispatchEvent('onstatechange',_event);
        _n._$exec('update.startUpdate',this.__updateItem);
    };
    /**
     * 暂停更新
     * @return {Void}
     */
    _proUpdater._$pause = function(){
        _n._$exec('update.setUpdateState',1);
    };
    /**
     * 继续更新
     * @return {Void}
     */
    _proUpdater._$resume = function(){
        _n._$exec('update.setUpdateState',3);
    };
    /**
     * 取消更新
     * @return {Void}
     */
    _proUpdater._$cancel = function(){
        _n._$exec('update.setUpdateState',2);
    };
};
NEJ.define('{lib}native/cef/util/updater.js', 
          ['{lib}util/event.js'
          ,'{lib}util/ajax/xdr.js'
          ,'{lib}native/command.js'
          ,'{lib}base/util.js'
          ,'{lib}native/cef/api.js'], f);