/*
 * ------------------------------------------
 * 图片上传执行命令封装实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
/** util/editor/command/uploadimage */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'util/editor/command/card',
    'ui/editor/command/uploadimage'
],function(NEJ,_k,_u,_t0,_i0,_p,_o,_f,_r){
    var _pro;
    /**
     * 左对齐执行命令封装
     *
     * @class   module:util/editor/command/uploadimage._$$UploadImage
     * @extends module:util/editor/command/card._$$CardCommand
     * @param   {Object} arg0 - 可选配置参数
     */
    _p._$$UploadImage = _k._$klass();
    _pro = _p._$$UploadImage._$extend(_t0._$$CardCommand);
    /**
     * 命令名称
     *
     * @const {String} module:util/editor/command/uploadimage._$$UploadImage.command
     */
    _p._$$UploadImage.command = 'uploadImage';

    /**
     * 显示卡片，一般子类重写
     *
     * @protected
     * @method module:util/editor/command/uploadimage._$$UploadImage#__doShowCard
     * @return {Void}
     */
    _pro.__doShowCard = function(){
        this.__onShowCard();
    };

    /**
     * 子类实现显示具体卡片
     *
     * @protected
     * @method module:util/editor/command/uploadimage._$$UploadImage#__onShowCard
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
     *
     * @protected
     * @method module:util/editor/command/uploadimage._$$UploadImage#__onChange
     * @param  {Object} arg0 - 插入图片命令
     * @param  {Object} arg1 - 图片对象
     * @return {Void}
     */
    _pro.__onChange = function(_commend,_photoObj){
        this.__editor._$focus(2);
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
        var _html = '<img style="max-width:520px;" src=' + _url + ' id='+ _id +' />&nbsp;';
        this.__editor._$execCommand(_commend,_html);
    };

    // regist command implemention
    _p._$$UploadImage._$regist();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.cmd'),_p);
    }

    return _p;
});
