/*
 * ------------------------------------------
 * 文件下载接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _cache = {};
    /*
     * 执行另存为
     * @param  {Event} 节点标识
     * @return {Void}
     */
    var _doSaveAs = (function(){
        var _getFileInfo = function(_id){
            var _conf = _cache[_id];
            if (!_conf) return;
            var _url = _conf.url,
                _name = _conf.name;
            if (_u._$isFunction(_url)){
                _url = _url();
            }
            if (!_name){
                var _arr = _url.split('/');
                _name = _arr.pop();
            }
            return {
                url:_url,
                name:_name
            };
        };
        return function(_event){
            var _el = _v._$getElement(_event),
                _id = _e._$id(_el),
                _info = _getFileInfo(_id);
            if (!!_info){
                _el.href = _info.url;
                if ('download' in _el){
                    _el.download = _info.name;
                }else{
                    _el.target = '_blank';
                }
            }
        };
    })();
    /**
     * 绑定文件下载行为
     * 
     * 脚本举例
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e');
     *   // 绑定文件下载行为
     *   _e._$bindSaveAsAction('button_id');
     * [/code]
     * 
     * @api    {nej.e._$bindSaveAsAction}
     * @param  {String|Node} 下载点击链接节点，必须是A节点
     * @param  {Object}      可选配置参数
     * @config {String|Function} url  下载文件地址或者地址生成函数
     * @config {String}          name 保存的文件名称，没有指定name则取url中文件名
     * @return {Void}
     */
    _e._$bindSaveAsAction = function(_button,_options){
        var _id = _e._$id(_button);
        if (!!_cache[_id]) return;
        var _node = _e._$get(_button);
        if (_node.tagName!='A') return;
        _cache[_id] = NEJ.X({},_options);
        _v._$addEvent(_id,'click',_doSaveAs);
    };
    /**
     * 解绑文件下载行为
     * 
     * 脚本举例
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e');
     *   // 文件另存为
     *   _e._$unbindSaveAsAction('button_id');
     * [/code]
     * 
     * @api    {nej.e._$unbindSaveAsAction}
     * @param  {String|Node} 下载点击按钮节点
     * @return {Void}
     */
    _e._$unbindSaveAsAction = function(_button){
        var _id = _e._$id(_button);
        if (!_cache[_id]) return;
        delete _cache[_id];
        _v._$delEvent(_id,'click',_doSaveAs);
    };
};
NEJ.define(
    '{lib}util/file/save.js',[
    '{lib}base/platform.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js'
],f);