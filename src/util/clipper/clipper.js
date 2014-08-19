/*
 * ------------------------------------------
 * 图片裁剪器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/clipper/clipper */
NEJ.define([
    'base/global',
    'base/klass',
    'base/constant',
    'base/element',
    'base/util',
    'util/event',
    'ui/resizer/resizer'
],function(NEJ,_k,_g,_e,_u,_t,_i,_p,_o,_f,_r){
    var _pro;
    /**
     * 图片裁剪器封装对象
     *
     * 样式举例
     * ```css
     * .test{padding:20px;overflow:hidden;}
     * .box{border:1px solid #aaa;}
     * .mbox{position:relative;float:left;width:500px;height:500px;margin-right:-500px;}
     * .prev{margin-left:500px;padding-left:20px;}
     * .pbox{position:relative;margin-bottom:10px;overflow:hidden;}
     * .pbox-0{width:80px;height:80px;}
     * .pbox-1{width:120px;height:120px;}
     * .pbox-2{width:200px;height:200px;}
     * ```
     * 
     * 结构举例
     * ```html
     * <div class="test">
     *   <!-- 裁剪区 -->
     *   <div class="box mbox" id="clip-main"></div>
     *   <!-- 预览区 -->
     *   <div class="prev">
     *     <div class="box pbox pbox-0" id="clip-preview-0"></div>
     *     <div class="box pbox pbox-1" id="clip-preview-1"></div>
     *     <div class="box pbox pbox-2" id="clip-preview-2"></div>
     *   </div>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/clipper/clipper'
     * ],function(_t){
     *     var _clipper = _t._$$Clipper._$allocate({
     *         url:'./4.jpg',
     *         mbox:'clip-main',
     *         lock:!0,
     *         pbox:[
     *             'clip-preview-0',
     *             'clip-preview-1',
     *             'clip-preview-2'
     *         ],
     *         size:{
     *             ratio:1,
     *             width:80
     *         }
     *     });
     * });
     * ```
     * 
     * @class    module:util/clipper/clipper._$$Clipper
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}            config - 可选配置参数
     * @property {String|Node}       mbox   - 裁剪容器节点
     * @property {String|Node|Array} pbox   - 预览容器节点 
     * @property {String}            url    - 图片地址
     * @property {Boolean}           lock   - 是否锁定比例
     * @property {Object}            size   - 裁剪缩放器初始大小
     */
    /** 
     * 图片载入之前事件
     * 
     * @event    module:util/clipper/clipper._$$Clipper#onbeforeimageload
     * @param    {Object}  event  - 事件信息
     * @property {Node}    parent - 容器节点
     */
    /** 
     * 图片载入之后事件
     * 
     * @event    module:util/clipper/clipper._$$Clipper#onafterimageload
     * @param    {Object}  event  - 事件信息
     * @property {Node}    parent - 容器节点
     * @property {Boolean} loaded - 图片是否成功载入
     */
    /** 
     * 图片显示之后事件
     * 
     * @event    module:util/clipper/clipper._$$Clipper#onafterimageshow
     * @param    {Object}  event  - 事件信息
     * @property {Node}    parent - 容器节点
     * @property {Float}   ratio  - 图片缩放比例，显示大小/原始大小
     * @property {Object}  value  - 大小调整对象或者大小调整对象配置信息
     */
    /** 
     * 裁剪位置变化事件
     * 
     * @event    module:util/clipper/clipper._$$Clipper#onchange
     * @param    {Object} event  - 裁剪信息
     * @property {Float}  ratio  - 图片缩放比例
     * @property {NUmber} top    - 裁剪距顶部位置
     * @property {NUmber} left   - 裁剪距左侧位置
     * @property {NUmber} width  - 裁剪宽度
     * @property {NUmber} height - 裁剪高度
     */
    _p._$$Clipper = _k._$klass();
    _pro = _p._$$Clipper._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__init
     * @return {Void}
     */
    _pro.__init = function(){
        this.__image = new Image();
        this.__ropt = {
            onmove:this.__onClipping._$bind(this),
            onresize:this.__onClipping._$bind(this)
        };
        this.__super();
    };
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        // init event
        this.__doInitDomEvent([[
            this.__image,'load',
            this.__onImageLoad._$bind(this,!0)
        ],[
            this.__image,'error',
            this.__onImageLoad._$bind(this,!1)
        ]]);
        // init node
        this.__pbox = {};
        this.__mbox = _e._$get(_options.mbox);
        this.__sopt = _u._$fetch({
            lock:!1,
            size:null
        },_options);
        var _preview = _options.pbox;
        if (!_u._$isArray(_preview)){
            this._$addPreview(_preview);
        }else{
            _u._$forEach(
                _preview,this._$addPreview,this
            );
        }
        this._$setURL(_options.url);
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__doClearResizer();
        this.__doClearPreview();
        this.__image.src = _g._$BLANK_IMAGE;
    };
    /**
     * 清除缩放器
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__doClearResizer
     * @return {Void}
     */
    _pro.__doClearResizer = function(){
        _e._$remove(this.__cbox);
        delete this.__cbox;
        if (!!this.__resizer){
            this.__resizer._$recycle();
            delete this.__resizer;
        }
    };
    /**
     * 清除预览图片
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__doClearPreview
     * @return {Void}
     */
    _pro.__doClearPreview = function(_keeped){
        _u._$forIn(
            this.__pbox,function(_conf){
                var _img = _e._$get(_conf.img);
                if (!_img) return;
                if (!_keeped){
                    _e._$remove(_img);
                }else{
                    _img.src = _g._$BLANK_IMAGE;
                }
            }
        );
    };
    /**
     * 计算图片位置
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__doCalImagePosition
     * @param  {Object} arg0 - 图片尺寸，{width:10,height:20}
     * @param  {Object} arg1 - 容器尺寸，{width:200,height:300}
     * @return {Object}        图片位置，{left:0,top:0,width:10,height:20}
     */
    _pro.__doCalImagePosition = function(_simg,_sbox){
        var _irat = _simg.width/_simg.height,
            _brat = _sbox.width/_sbox.height,
            _result = {};
        if (_brat<_irat&&_sbox.width<_simg.width){
            // width overflow
            _result.width = _sbox.width;
            _result.height = Math.floor(_result.width/_irat);
        }else if(_brat>_irat&&_sbox.height<_simg.height){
            // height overflow
            _result.height = _sbox.height;
            _result.width = Math.floor(_result.height*_irat);
        }else{
            // no overflow
            _result.width = _simg.width;
            _result.height = _simg.height;
        }
        _result.left = Math.floor((_sbox.width-_result.width)/2);
        _result.top = Math.floor((_sbox.height-_result.height)/2);
        _result.ratio = _result.width/_simg.width;
        return _result;
    };
    /**
     * 计算裁剪预览位置
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__doCalClipPosition
     * @return {Void}
     */
    _pro.__doCalClipPosition = function(_clip,_prev){
        var _result = {},
            _ratio = _clip.width/_prev.width,
            _delta = this.__ratio/_ratio;
        _result.top = Math.floor(_clip.top/_ratio);
        _result.left = Math.floor(_clip.left/_ratio);
        _result.width = Math.floor(this.__image.width*_delta);
        _result.height = Math.floor(this.__image.height*_delta);
        return _result;
    };
    /**
     * 图片载入完成触发事件
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__onImageLoad
     * @param  {Boolean} arg0 - 图片是否成功载入
     * @return {Void}
     */
    _pro.__onImageLoad = (function(){
        var _imgsize = {
            position:'absolute',
            top:0,left:0,
            width:'100%',
            height:'100%'
        };
        var _doAppendUnit = function(_map){
            _u._$forIn(_map,function(_value,_key,_xmap){
                _xmap[_key] = _value+'px';
            });
        };
        return function(_isok){
            if (this.__image.src==_g._$BLANK_IMAGE) return;
            this._$dispatchEvent('onafterimageload',{
                parent:this.__mbox,
                loaded:_isok
            });
            if (!_isok) return;
            // calculate position
            var _pos = this.__doCalImagePosition({
                    width:this.__image.width,
                    height:this.__image.height
                },{
                    width:this.__mbox.clientWidth,
                    height:this.__mbox.clientHeight
                }),
                _max = {
                    width:_pos.width,
                    height:_pos.height
                };
            this.__sopt.max = {
                width:_pos.width,
                height:_pos.height
            };
            this.__ratio = _pos.ratio;
            delete _pos.ratio;
            _doAppendUnit(_pos);
            // build image
            this.__cbox = _e._$create('div');
            _pos.position = 'absolute';
            _e._$style(this.__cbox,_pos);
            this.__mbox.appendChild(this.__cbox);
            _u._$forEach(
                [new Image(),new Image()],
                function(_img,_index){
                    _imgsize.zIndex = 100+_index;
                    _e._$style(_img,_imgsize);
                    this.__cbox.appendChild(_img);
                    _img.src = this.__image.src;
                    if (_index==0){
                        _e._$setStyle(_img,'opacity',0.3);
                    }
                },this
            );
            var _event = {
                ratio:this.__ratio,
                parent:this.__mbox
            };
            this._$dispatchEvent('onafterimageshow',_event);
            // build resizer
            if (_event.value instanceof _i._$$Resizer){
                this.__resizer = _event.value;
            }else{
                var _options = _u._$merge(
                    this.__sopt,
                    _event.value
                );
                this.__sopt.parent = this.__cbox;
                this.__resizer = _i._$$Resizer._$allocate(_options);
            }
            this.__resizer._$batEvent(this.__ropt);
            this.__onClipping(this.__resizer._$getResizeBox());
        };
    })();
    /**
     * 图片裁剪
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__onClipping
     * @param  {Object} arg0 - 裁剪信息
     * @return {Void}
     */
    _pro.__onClipping = function(_event){
        // sync clip image
        var _img = this.__cbox.getElementsByTagName('IMG')[1],
            _crp = [_event.top+'px',_event.left+_event.width+'px',
                    _event.top+_event.height+'px',_event.left+'px'];
        _e._$setStyle(_img,'clip','rect('+_crp.join(' ')+')');
        // sync preview show
        _u._$forIn(
            this.__pbox,
            function(_conf){
                this.__doPreviewClip(_conf,_event);
            },this
        );
        _event.ratio = this.__ratio;
        this._$dispatchEvent('onclipchange',_event);
    };
    /**
     * 预览图片
     * 
     * @protected
     * @method module:util/clipper/clipper._$$Clipper#__doPreviewClip
     * @param  {Object} arg0 - 预览配置
     * @param  {Object} arg1 - 裁剪信息
     * @return {Void}
     */
    _pro.__doPreviewClip = function(_conf,_box){
        if (!_box){
            _box = this.__resizer._$getResizeBox();
        }
        var _pos = this.__doCalClipPosition(_box,_conf);
        _conf.clip = {
            top:_pos.top,
            left:_pos.left,
            width:_conf.width,
            height:_conf.height,
            scale:_pos.width/this.__image.width
        };
        var _img = _e._$get(_conf.img)||new Image(),
            _style = {
                position:'absolute',
                top:0-_pos.top+'px',
                left:0-_pos.left+'px',
                width:_pos.width+'px',
                height:_pos.height+'px'
            };
        _e._$style(_img,_style);
        if (!_conf.img){
            _conf.img = _e._$id(_img);
            _e._$get(_conf.box).appendChild(_img);
            _img.src = this.__image.src;
        }
    };
    /**
     * 设置图片地址
     * 
     * @method module:util/clipper/clipper._$$Clipper#_$setURL
     * @param  {String} arg0 - 图片地址
     * @return {Void}
     */
    _pro._$setURL = function(_url){
        if (!_url) return;
        // do clear
        this.__doClearResizer();
        this.__doClearPreview(!0);
        // do check
        this._$dispatchEvent('onbeforeimageload',{
            parent:this.__mbox
        });
        this.__image.src = _url;
    };
    /**
     * 添加预览容器节点
     * 
     * @method module:util/clipper/clipper._$$Clipper#_$addPreview
     * @param  {String|Node} arg0 - 预览容器节点
     * @return {Void}
     */
    _pro._$addPreview = function(_box){
        var _box = _e._$get(_box);
        if (!_box) return;
        var _id = _e._$id(_box),
            _width = _box.clientWidth,
            _height = _box.clientHeight;
        this.__pbox[_id] = {
            box:_id,
            width:_width,
            height:_height,
            ratio:_width/_height
        };
        if (!!this.__resizer){
            this.__doPreviewClip(this.__pbox[_id]);
        }
    };
    /**
     * 删除预览视图
     * 
     * @method module:util/clipper/clipper._$$Clipper#_$delPreview
     * @param  {String}  arg0 - 标识
     * @param  {Boolean} arg1 - 是否保留最终状态
     * @return {Void}
     */
    _pro._$delPreview = function(_id,_keep){
        var _map = this.__pbox[_id];
        if (!!_map&&!_keep)
            _e._$remove(_map.img);
        delete this.__pbox[_id];
    };
    /**
     * 取裁剪结果
     * 
     * @method module:util/clipper/clipper._$$Clipper#_$getClipResult
     * @param  {String} arg0 - 预览标识
     * @return {Object}        裁剪结果
     */
    _pro._$getClipResult = function(_id){
        var _conf = this.__pbox[_id];
        // dump one
        if (!!_conf){
            return _conf.clip;
        }
        // dump all
        var _result = {};
        _u._$forIn(
            this.__pbox,function(_conf,_key){
                _result[_key] = _conf.clip;
            }
        );
        return _result;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
