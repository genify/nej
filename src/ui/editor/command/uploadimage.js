/*
 * ------------------------------------------
 * 富媒体编辑器图片上传控件实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ui.cmd'),
        _u = _('nej.ui'),
        _ut= _('nej.ut'),
        _ul= _('nej.u'),
        _proUploadImageCard,
        _supUploadImageCard;
    if (!!_p._$$UploadImageCard) return;
    // ui css text
    var _seed_css = _e._$pushCSSText('.#<uispace>{}\
                                      .#<uispace> .m-iframe{position:absolute;height:0px;width:0px;left:-9000px;}\
                                      .#<uispace> .u-upload-file{height:0px;width:0px;font-size:0px;}\
                                      .#<uispace> .u-error{color:red;padding-top:10px;}\
                                      .#<uispace> .choose_file{position:relative;margin-bottom:10px;}\
                                      .#<uispace> .choose_file object{position:absolute;left:0;top:0;}\
                                      .#<uispace> .web_img{margin-bottom:8px;}\
                                      .#<uispace> .web_img .u-edit{margin-bottom:10px;}\
                                      .#<uispace> .u-desc{color:#ccc;}\
                                      .#<uispace> .u-image{width:0px;height:0px;visibility:hidden;}\
                                      ');
    // ui html code
    var _seed_html = _e._$addNodeTemplate('<div>\
            <div class="tab">\
                <a class="u-btn f-ib upload j-tab f-fl" name="upload"><span class="img-upload">上传图片</span></a>\
                <a class="u-btn f-ib extern j-tab" name="extern"><span class="img-extern">引用站外图片</span></a>\
                <image class="j-image u-image" />\
            </div>\
            <div class="cnt">\
                <div class="choose_file" name="select_image">\
                    <div class="btn2">\
                        <a class="main middle"><span>选择图片</span></a>\
                    </div>\
                </div>\
                <p class="u-desc j-desc"></p>\
            </div>\
            <div class="cnt">\
                <div class="f-cb web_img">\
                    <div class="f-fl u-edit"><input class="ipt ipt-url" type="text" /></div>\
                    <div class="btn2 f-fl smt-url">\
                            <a class="main small"><span>确定</span></a>\
                    </div>\
                </div>\
                <p class="u-desc j-desc"></p>\
            </div>\
            <div class="u-error j-error"></div>\
        </div>');
    /**
     * 图片上传控件
     * @class   {nej.ui.cmd._$$UploadImageCard} 图片上传控件
     * @uses    {nej.ut._$$Tab}
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node} parent            父容器
     * @config  {Boolean}       draggable        是否可拖拽
     * @config  {Boolean}       destroyable      关闭是否销毁
     * @config  {String}       title               卡片标题
     * @config  {String}      fDesc             自定义错误提示1
     * @config  {String}      oDesc            自定义错误提示2
     * @config  {String}      swfUrl           Flash文件路径
     * @config  {String}      baseUrl          Flash文件路径的前缀
     * @config  {Number}      flashWidth       Flash宽度
     * @config  {Number}      flashHeight      Flash高度
     * @config  {String}      userdefinesize 图片尺寸，默认750x750x0x90;350x350x0x85
     * @config  {String}      saveorigin     是否保存源文件,默认false
     * @config  {String}      responsetype   响应格式,默认xml
     * @config  {String}      rotatedegree   旋转角度，默认0
     * @config  {String}      stamptype      水印类型，默认无
     * @config  {String}      stampstring    水印内容，默认无
     * @config  {String}      sitefrom         产品名称
     * 
     * [hr]
     * 
     * @event  {oninitflash} Flash开始初始化
     * 
     * [hr]
     * 
     * @event  {onflashinited} Flash初始化完成
     * 
     * [hr]
     * 
     * @event  {onchange} Flash初始化完成
     * @param  {String}   命令名称
     * @param  {Object}   Flash返回的图片对象
     * 
     */
    _p._$$UploadImageCard = NEJ.C();
      _proUploadImageCard = _p._$$UploadImageCard._$extend(_u._$$WindowWrapper);
      _supUploadImageCard = _p._$$UploadImageCard._$supro;
    
    /**
     * 注册flash回调方法
     * @protected
     * @method {__regiestFlashEvent}
     * @param  {String} Flash回调方法的命名空间 
     * @return {Void}
     */
    _proUploadImageCard.__regiestFlashEvent = function(_space){
        this.__randomId = _ul._$randNumberString(2);
        this.__namespace = _space + this.__randomId;
        var _namespace = NEJ.P(this.__namespace);
        _namespace.uploadStart = this.__uploadStart._$bind(this);
        _namespace.uploadComplete = this.__uploadComplete._$bind(this);
        _namespace.uploadError = this.__uploadError._$bind(this);
        _namespace.showProgress = this.__showProgress._$bind(this);
    }
    
    /**
     * 重置卡片
     * @protected
     * @method {__reset}
     * @param  {Object} 可配置参数
     * @return {Void}
     */
    _proUploadImageCard.__reset = function(_options){
        _options = _options || {};
        _options.parent = _options.parent || document.body; //默认以document为parent
        _options.draggable = _options.draggable || false;
        _options.destroyable = _options.destroyable || false;
        _options.title = _options.title || '选择图片';
        _options.mask  = true;
        this.__supReset(_options);
        this.__showErrorTips('');
    };
    
    /**
     * 初始化卡片
     * @protected
     * @method {__init}
     * @param {Object} 可配置参数
     * @return {Void}
     */
    _proUploadImageCard.__init = function(_options){
        _options = _options||{};
        this.__supInit(_options);
        this.__desc[0].innerText = _options.fDesc||'支持JPG、JPEG、GIF、BMP格式的图片，文件需小于10M';
        this.__desc[1].innerText = _options.oDesc||'网络图片不能超过2M';
        this.__swf = _options.swfUrl||'/res/swf/imageUpload.swf';
        this.__baseUrl = _options.baseUrl||"http://upload.photo.163.com/anony/web/upload/userdefinesize?";
        this.__flashW = _options.flashWidth||100;
        this.__flashH = _options.flashHeight||20;
        this._$setEvent('oninitflash',_options.oninitflash||_f);
        this._$setEvent('onflashinited',_options.onflashinited||_f);
        this._$dispatchEvent('oninitflash');
        this.__photoUrl = this.__baseUrl
                          + "userdefinesize=" + _options.userdefinesize||this.__userdefinesize
                          + "&saveorigin=" + _options.saveorigin||this.__saveorigin
                          + "&responsetype=" + _options.responsetype||this.__responsetype
                          + "&rotatedegree=" + _options.rotatedegree||this.__rotatedegree
                          + "&stamptype=" + _options.stamptype||this.__stamptype
                          + "&stampstring=" + encodeURIComponent(_options.stampstring||this.__stampstring)
                          + "&sitefrom=" + _options.sitefrom||this.__sitefrom;
        this.__regiestFlashEvent(_options.namespace||'nej.ui.cmd');
        _e._$flash({
            src: this.__swf,
            hidden: false,
            parent: this.__choose,
            width: this.__flashW,
            height: this.__flashH,
            params: {
                flashvars: 'cbNameSpace=' + this.__namespace + '&uploadExif=true&uploadUrl=' + encodeURIComponent(this.__photoUrl),
                allowscriptaccess: 'always',
                wmode: 'transparent'
            },
            onready: this.__onFlashReady._$bind(this)
        });
    }
    
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _proUploadImageCard.__initNode = function(){
        this.__supInitNode();
        this.__desc = _e._$getByClassName(this.__body,'j-desc');
        this.__tab = _e._$getByClassName(this.__body,'tab')[0];
        this.__tabs= _e._$getChildren(this.__tab);
        this.__choose = _e._$getByClassName(this.__body,'choose_file')[0];
        this.__cnts = _e._$getByClassName(this.__body,'cnt');
        this.__imgUrl = _e._$getByClassName(this.__body,'ipt-url')[0];
        this.__smtImgUrl = _e._$getByClassName(this.__body,'smt-url')[0];
        this.__errorMsg = _e._$getByClassName(this.__body,'j-error')[0];
        this.__imgBox = _e._$getByClassName(this.__body,'j-image')[0];
        this.__tabMg = _ut._$$Tab._$allocate({list:this.__tabs,selected:'j-selected',onchange:this.__tabChange._$bind(this)})
        _v._$addEvent(this.__smtImgUrl,'click',this.__onSubmitImgUrl._$bind(this));
        _v._$addEvent(this.__imgBox,'error',this.__imageUrlError._$bind(this));
        _v._$addEvent(this.__imgBox,'load',this.__imageOnLoad._$bind(this));
        _v._$addEvent(this.__imgUrl,'focus',this.__showErrorTips._$bind(this,''));
        this.__userdefinesize = '750x750x0x90;350x350x0x85';
        this.__saveorigin     = 'false';
        this.__responsetype   = 'xml';
        this.__rotatedegree   = '0';
        this.__stamptype      = '';
        this.__stampstring    = '';
        this.__sitefrom       = 'study';
    };
    
    /**
     * 图片上传完成的回调
     * @protected
     * @method {__uploadComplete}
     * @param  {Number} flash的操作id
     * @param  {String} 图片上传状态码
     * @param  {Object} 相册返回的图片对象
     * @return {Void}
     */
    _proUploadImageCard.__uploadComplete = function(_id,_code,_photoObj){
        if(_code != 999){
            this.__showErrorTips('图片上传失败');
        }else{
            this.__showErrorTips('');
            this._$dispatchEvent('onchange','inserthtml',_photoObj);
            this.__onafterupload();
            this._$hide();
        }
    };
    
    /**
     * 上传图片出错信息设置
     * @protected
     * @method {__showErrorTips}
     * @param  {String} 错误信息
     * @return {Void}
     */
    _proUploadImageCard.__showErrorTips = function(_message){
        this.__errorMsg.innerText = _message;
    };
    
    /**
     * 开始图片上传
     * @protected
     * @method {__uploadStart}
     * @return {Void}
     */
    _proUploadImageCard.__uploadStart = function(){
        this.__onbeforeupload();
    };
    
    /**
     * flash加载完成回调
     * @protected
     * @method {__onFlashReady}
     * @param  {Object} Flash对象
     * @return {Void}
     */
    _proUploadImageCard.__onFlashReady = function(_flash){
        this.__flashObj = _flash;
        this._$dispatchEvent('onflashinited');
    };
    
    /**
     * 提交网络图片
     * @protected
     * @method {__onSubmitImgUrl}
     * @return {Void}
     */
    _proUploadImageCard.__onSubmitImgUrl = function(){
        this.__imgBox.src = this.__imgUrl.value.trim();
    };
    
    /**
     * 图片链接错误
     * @protected
     * @method {__imageUrlError}
     * @return {Void}
     */
    _proUploadImageCard.__imageUrlError = function(){
        this.__errorMsg.innerText = '无法获取链接中的图片，请检查链接或稍后重试';
    };
    
    /**
     * 图片链接正确
     * @protected
     * @method {__imageOnLoad}
     * @return {Void}
     */
    _proUploadImageCard.__imageOnLoad = function(){
        var _photoObj = {};
        _photoObj.resultcode = 999;
        _photoObj.userDef2Url = this.__imgUrl.value;
        this.__uploadComplete('webimg',_photoObj.resultcode,_photoObj);
    };
    
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _proUploadImageCard.__initNodeTemplate = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    
    /**
     * 图片上传前操作，子类实现
     * @protected
     * @method {__onbeforeupload}
     * @return {Void}
     */
    _proUploadImageCard.__onbeforeupload = _f;
    
    /**
     * 图片上传后操作，子类实现
     * @protected
     * @method {__onafterupload}
     * @return {Void}
     */
    _proUploadImageCard.__onafterupload = _f;
    
    /**
     * 图片上传错误，子类实现
     * @protected
     * @method {__uploadError}
     * @return {Void}
     */
    _proUploadImageCard.__uploadError = _f;
    
    /**
     * 图片上传进程回调，子类实现
     * @protected
     * @method {__showProgress}
     * @return {Void}
     */
    _proUploadImageCard.__showProgress = _f;
    
    /**
     * 切换tab
     * @protected
     * @method {__tabChange}
     * @param  {Object} 当前Tab对象
     * @return {Void}
     */
    _proUploadImageCard.__tabChange = function(_event){
        this.__showErrorTips('');
        var _index = _event.index;
        if(!_index){
            this.__cnts[0].style.display = '';
            this.__cnts[1].style.display = 'none';
        }else{
            this.__imgUrl.value = '';
            this.__cnts[1].style.display = '';
            this.__cnts[0].style.display = 'none';
        }
    };
};
NEJ.define('{lib}ui/editor/command/uploadimage.js',
      ['{lib}ui/layer/window.wrapper.js','{lib}util/tab/tab.js','{lib}util/flash/flash.js'],f);