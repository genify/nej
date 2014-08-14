/*
 * ------------------------------------------
 * 图片上传执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/util.js',
    '{lib}util/editor/command/card.js',
    '{lib}ui/editor/command/uploadimage.js'
],function(NEJ,_k,_u,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 左对齐执行命令封装
     * @class   {nej.ut.cmd._$$UploadImage} 左对齐执行命令封装
     * @extends {nej.ut.cmd._$$SimpleCommand}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$UploadImage = _k._$klass();
    _pro = _p._$$UploadImage._$extend(_t0._$$CardCommand);
    /**
     * 命令名称
     * @type String
     */
    _p._$$UploadImage.command = 'uploadImage';

    /**
     * 显示卡片，一般子类重写
     * @protected
     * @method {__doShowCard}
     * @return {Void}
     */
    _pro.__doShowCard = function(){
        this.__onShowCard();
    };

    /**
     * 子类实现显示具体卡片
     * @return {Void}
     */
    _pro.__onShowCard = function(){
        if (!this.__uploadCard)
        this.__uploadCard = _i0._$$UploadImageCard._$allocate({
                onchange:this.__onChange._$bind(this)
            });
        this.__uploadCard._$show();
    };

    /**
     * 卡片内容变化回调，子类实现具体业务逻辑
     * @protected
     * @method {__onChange}
     * @param  {Object} 插入图片命令
     * @param  {Object} 图片对象
     * @return {Void}
     */
    _pro.__onChange = function(_commend,_photoObj){
        this.__editor._$focus();
        var _id = 0,_url;
        if(!!_photoObj.ourl && _photoObj.ourl.indexOf('.gif') > 0){
            //gif图片
            _url = _photoObj.ourl;
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

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});