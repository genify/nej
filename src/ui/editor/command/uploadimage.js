/*
 * ------------------------------------------
 * 富媒体编辑器图片上传控件实现文件
 * @version  1.0
 * @author   cheng-lin(cheng-lin@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}ui/layer/window.wrapper.js',
    '{lib}util/tab/tab.js',
    '{lib}util/flash/flash.js',
    '{lib}util/template/tpl.js'
],function(NEJ,_k,_e,_v,_u,_u0,_t0,_t1,_t2,_p,_o,_f,_r){
    var _pro,
        _seed_css,
        _seed_html;
    /**
     * 图片上传控件
     * @class   {nej.ui.cmd._$$UploadImageCard} 图片上传控件
     * @uses    {nej.ut._$$Tab}
     * @extends {nej.ui.cmd._$$WindowWrapper}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {String|Node} parent            父容器
     * @config  {Boolean}     draggable        是否可拖拽
     * @config  {Boolean}     destroyable      关闭是否销毁
     * @config  {String}      title               卡片标题
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
     * @event  {onchange} 图片上传完成
     * @param  {String}   命令名称
     * @param  {Object}   Flash返回的图片对象
     *
     */
    _p._$$UploadImageCard = _k._$klass();
    _pro = _p._$$UploadImageCard._$extend(_u0._$$WindowWrapper);

    /**
     * 重置卡片
     * @protected
     * @method {__reset}
     * @param  {Object} 可配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        _options = _options || {};
        _options.parent = _options.parent || document.body; //默认以document为parent
        _options.draggable = _options.draggable || false;
        _options.destroyable = _options.destroyable || false;
        _options.title = _options.title || '选择图片';
        _options.mask  = true;
        this.__super(_options);
        this.__onShowErrorTips('');
    };

    /**
     * 初始化卡片
     * @protected
     * @method {__init}
     * @param {Object} 可配置参数
     * @return {Void}
     */
    _pro.__init = function(_options){
        _options = _options||{};
        this.__super(_options);
        this.__desc[0].innerText = _options.fDesc || '支持JPG、JPEG、GIF、BMP格式的图片，文件需小于10M';
        this.__desc[1].innerText = _options.oDesc || '网络图片不能超过2M';
        this._$setEvent('oninitflash',_options.oninitflash || _f);
        this._$setEvent('onflashinited',_options.onflashinited || _f);
        this._$dispatchEvent('oninitflash');
        this.__doRegiestFlashEvent(_options.namespace || 'nej.ui.cmd');
        var _url = encodeURIComponent(_options.baseUrl || "http://upload.photo.163.com/anony/web/upload/userdefinesize?"+
                          + "userdefinesize=" + _options.userdefinesize || '750x750x0x90;350x350x0x85'
                          + "&saveorigin=" + _options.saveorigin || 'false'
                          + "&responsetype=" + _options.responsetype || 'xml'
                          + "&rotatedegree=" + _options.rotatedegree || '0'
                          + "&stamptype=" + _options.stamptype || ''
                          + "&stampstring=" + encodeURIComponent(_options.stampstring || '')
                          + "&sitefrom=" + _options.sitefrom || 'study');
        this.__hopt = {
            src: _options.swfUrl || _c._$get('upload.image.swf'),
            hidden: false,
            parent: _e._$getByClassName(this.__body,'choose_file')[0],
            width: _options.flashWidth || 100,
            height: _options.flashHeight || 20,
            params: {
                flashvars: 'cbNameSpace=' + this.__namespace + '&uploadExif=true&uploadUrl=' + _url,
                allowscriptaccess: 'always',
                wmode: 'transparent'
            },
            onready: this.__onFlashReady._$bind(this)
        };
        _t1._$flash(this.__hopt);
    };

    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__super();
        this.__desc = _e._$getByClassName(this.__body,'j-desc');
        // 0 : 图片上传模式1
        // 1 ：图片上传模式2
        this.__cnts = _e._$getByClassName(this.__body,'j-cnt');
        var _nlist = _e._$getByClassName(this.__body,'j-ztag');
        // 0 : 检查网络图片的容器
        // 1 : 图片url
        // 2 : 确认按钮
        // 3 : 错误提示节点
        this.__nimgUrl = _nlist[1];
        this.__nerrorMsg = _nlist[3];
        this.__nimgBox = _nlist[0];
        this.__topt = {
            list:_e._$getByClassName(this.__body,'j-tab'),
            selected:'j-selected',
            onchange:this.__onTabChange._$bind(this)
        };
        this.__tabMg = _t0._$$Tab._$allocate(this.__topt);
        _v._$addEvent(_nlist[2],'click',this.__onSubmitImgUrl._$bind(this));
        _v._$addEvent(this.__nimgBox,'error',this.__onImgUrlError._$bind(this));
        _v._$addEvent(this.__nimgBox,'load',this.__onImgLoad._$bind(this));
        _v._$addEvent(this.__nimgUrl,'focus',this.__onShowErrorTips._$bind(this,''));
    };

    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };

    /**
     * 注册flash回调方法
     * @protected
     * @method {__doRegiestFlashEvent}
     * @param  {String} Flash回调方法的命名空间
     * @return {Void}
     */
    _pro.__doRegiestFlashEvent = function(_space){
        this.__namespace = _space + _u._$randNumberString(2);
        var _namespace = NEJ.P(this.__namespace);
        _namespace.uploadStart = this.__onUploadStart._$bind(this);
        _namespace.uploadComplete = this.__onUploadComplete._$bind(this);
        _namespace.uploadError = this.__uploadError._$bind(this);
        _namespace.showProgress = this.__showProgress._$bind(this);
    };

    /**
     * 图片上传完成的回调
     * @protected
     * @method {__onUploadComplete}
     * @param  {Number} flash的操作id
     * @param  {String} 图片上传状态码
     * @param  {Object} 相册返回的图片对象
     * @return {Void}
     */
    _pro.__onUploadComplete = function(_id,_code,_photoObj){
        if(_code != 999){
            this.__onShowErrorTips('图片上传失败');
        }else{
            this.__onShowErrorTips('');
            this._$dispatchEvent('onchange','inserthtml',_photoObj);
            this.__onafterupload();
            this._$hide();
        }
    };

    /**
     * 上传图片出错信息设置
     * @protected
     * @method {__onShowErrorTips}
     * @param  {String} 错误信息
     * @return {Void}
     */
    _pro.__onShowErrorTips = function(_message){
        this.__nerrorMsg.innerText = _message;
    };

    /**
     * 开始图片上传
     * @protected
     * @method {__onUploadStart}
     * @return {Void}
     */
    _pro.__onUploadStart = function(){
        this.__onbeforeupload();
    };

    /**
     * flash加载完成回调
     * @protected
     * @method {__onFlashReady}
     * @param  {Object} Flash对象
     * @return {Void}
     */
    _pro.__onFlashReady = function(_flash){
        this.__flashObj = _flash;
        this._$dispatchEvent('onflashinited');
    };

    /**
     * 提交网络图片
     * @protected
     * @method {__onSubmitImgUrl}
     * @return {Void}
     */
    _pro.__onSubmitImgUrl = function(){
        this.__nimgBox.src = this.__nimgUrl.value.trim();
    };

    /**
     * 图片链接错误
     * @protected
     * @method {__onImgUrlError}
     * @return {Void}
     */
    _pro.__onImgUrlError = function(){
        this.__nerrorMsg.innerText = '无法获取链接中的图片，请检查链接或稍后重试';
    };

    /**
     * 图片链接正确
     * @protected
     * @method {__onImgLoad}
     * @return {Void}
     */
    _pro.__onImgLoad = function(){
        var _photoObj = {
            resultcode:999,
            userDef2Url:this.__nimgUrl.value
        };
        this.__onUploadComplete('webimg',_photoObj.resultcode,_photoObj);
    };

    /**
     * 图片上传前操作，子类实现
     * @protected
     * @method {__onbeforeupload}
     * @return {Void}
     */
    _pro.__onbeforeupload = _f;

    /**
     * 图片上传后操作，子类实现
     * @protected
     * @method {__onafterupload}
     * @return {Void}
     */
    _pro.__onafterupload = _f;

    /**
     * 图片上传错误，子类实现
     * @protected
     * @method {__uploadError}
     * @return {Void}
     */
    _pro.__uploadError = _f;

    /**
     * 图片上传进程回调，子类实现
     * @protected
     * @method {__showProgress}
     * @return {Void}
     */
    _pro.__showProgress = _f;

    /**
     * 切换tab
     * @protected
     * @method {__onTabChange}
     * @param  {Object} 当前Tab对象
     * @return {Void}
     */
    _pro.__onTabChange = function(_event){
        this.__onShowErrorTips('');
        var _index = _event.index;
        this.__nimgUrl.value = '';
        _e._$setStyle(this.__cnts[_index],'display','');
        _e._$setStyle(this.__cnts[(_index+1)%2],'display','none');
    };

    // ui css text
    _seed_css = _e._$pushCSSText('\
      .#<uispace>{width:336px;}\
      .#<uispace> .m-iframe{position:absolute;height:0px;width:0px;left:-9000px;}\
      .#<uispace> .u-upload-file{height:0px;width:0px;font-size:0px;}\
      .#<uispace> .u-error{color:red;padding-top:10px;}\
      .#<uispace> .choose_file{position:relative;margin-bottom:10px;}\
      .#<uispace> .choose_file object{position:absolute;left:0;top:0;}\
      .#<uispace> .web_img{margin-bottom:8px;}\
      .#<uispace> .web_img .u-edit{margin-bottom:10px;}\
      .#<uispace> .u-desc{color:#ccc;}\
      .#<uispace> .middle{color:#528CE0;}\
      .#<uispace> .u-btn{cursor:pointer;color:#528CE0;}\
      .#<uispace> .u-image{width:0px;height:0px;visibility:hidden;}');
    // ui html code
    _seed_html = _t2._$addNodeTemplate('\
      <div>\
        <div>\
          <a class="u-btn f-ib upload j-tab f-fl" name="upload"><span class="img-upload">上传图片</span></a>\
          <a class="u-btn f-ib extern j-tab" name="extern"><span class="img-extern">引用站外图片</span></a>\
          <image class="j-ztag u-image" />\
        </div>\
        <div class="j-cnt">\
          <div class="choose_file" name="select_image">\
            <div class="btn2">\
              <a class="main middle"><span>选择图片</span></a>\
            </div>\
          </div>\
          <p class="u-desc j-desc"></p>\
        </div>\
        <div class="j-cnt">\
          <div class="f-cb web_img">\
              <div class="f-fl u-edit"><input class="ipt j-ztag" type="text" /></div>\
              <div class="btn2 f-fl j-ztag">\
                <a class="main small"><span>确定</span></a>\
              </div>\
          </div>\
          <p class="u-desc j-desc"></p>\
        </div>\
        <div class="u-error j-ztag"></div>\
      </div>');

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui.cmd'),_p);
    }

    return _p;
});