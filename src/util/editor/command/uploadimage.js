/*
 * ------------------------------------------
 * 图片上传执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _p = _('nej.ut.cmd'),
        _i = _('nej.ui.cmd'),
        _e = _('nej.e'),
        _proUploadImage;
    if (!!_p._$$UploadImage) return;
    /**
     * 左对齐执行命令封装
     * @class   {nej.ut.cmd._$$UploadImage} 左对齐执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$UploadImage = NEJ.C();
    _proUploadImage = _p._$$UploadImage._$extend(_p._$$CardCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$UploadImage.command = 'uploadImage';
    
    /**
     * 初始化方法
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _proUploadImage.__init = function(){
        this.__supInit();
    };
    
    /**
     * 显示卡片，一般子类重写
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _proUploadImage.__doShowCard = function(){
        if (!!this.__onShowCard){
            this.__onShowCard();
        }else{
            _i._$$UploadImageCard._$allocate({
                onchange:this.__onChange._$bind(this)
            })._$show();
        }
    };
    
    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onChange}
     * @param  {Object} 插入图片命令
     * @param  {Object} 图片对象
     * @return {Void}
     */
    _proUploadImage.__onChange = function(_commend,_photoObj){
        this.__editor._$focus();
        var _id = 0,_url;
        if(!!_photoObj.ourl && _photoObj.ourl.indexOf('.gif') > 0){
            //gif图片
            _url= _photoObj.ourl;
            if(!!_photoObj.photoGarbageIds){
                var _ids = _photoObj.photoGarbageIds.split(',');
                _u._$forEach(_ids,function(_item,_index){
                    if(_item.search('ourl') >= 0)
                        _id = _item.split(':')[1];
                },this);
            }
        }else{
            _url = _photoObj.userDef2Url;
            if(!!_photoObj.photoGarbageIds){
                var _ids = _photoObj.photoGarbageIds.split(',');
                _u._$forEach(_ids,function(_item,_index){
                    if(_item.search('userdef2url') >= 0)
                        _id = _item.split(':')[1];
                },this);
            }
        }
        var _html = '<img style="max-width:520px;" src=' + _url + ' id='+ _id +' />';
        this.__editor._$execCommand(_commend,_html);
    };
    
    // regist command implemention
    _p._$$UploadImage._$regist();
};
NEJ.define('{lib}util/editor/command/uploadimage.js',
      ['{lib}util/editor/command/card.js','{lib}ui/editor/command/uploadimage.js'],f);