/*
 * ------------------------------------------
 * 区域大小调节功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut'),
        _proResize;
    if (!!_p._$$Resize) return;
    /**
     * 区域大小调节功能封装，方位示意图
     * [code]
     *    //  5------ 1 ------6
     *    //  |               |
     *    //  |               |
     *    //  4               2
     *    //  |               |
     *    //  |               |
     *    //  8------ 3 ------7
     * [/code]
     * 
     * 各位置对应的手势及样式标识如下表所示：
     * [ntb]
     *   1 | 向上改变大小，对应鼠标手型n-resize，默认样式名js-rs-1
     *   2 | 向右改变大小，对应鼠标手型e-resize，默认样式名js-rs-2
     *   3 | 向下改变大小，对应鼠标手型s-resize，默认样式名js-rs-3
     *   4 | 向左改变大小，对应鼠标手型w-resize，默认样式名js-rs-4
     *   5 | 向左上改变大小，对应鼠标手型nw-resize，默认样式名js-rs-5
     *   6 | 向右上改变大小，对应鼠标手型ne-resize，默认样式名js-rs-6
     *   7 | 向右下改变大小，对应鼠标手型se-resize，默认样式名js-rs-7
     *   8 | 向左下改变大小，对应鼠标手型sw-resize，默认样式名js-rs-8
     * [/ntb]
     * 
     * 样式举例
     * [code type="css"]
     *   #box{width:500px;height:500px;border:solid 1px #ccc;position:relative;}
     *   #box span{position:absolute;}
     *   .lefttop{top:0;left:0;width:5px;height:5px;line-height:5px;background:transparent;z-index:99;cursor:nw-resize;overflow:hidden}
     *   .top{top:0;width:100%;height:5px;line-height:5px;background:transparent;z-index:98;cursor:n-resize;overflow:hidden}
     *   .righttop{top:0;right:0;width:5px;height:5px;line-height:5px;background:transparent;z-index:99;cursor:ne-resize;overflow:hidden}
     *   .right{right:0;width:5px;height:100%;background:transparent;z-index:98;cursor:_e-resize;overflow:hidden}
     *   .rightbottom{bottom:0;right:0;width:5px;height:5px;line-height:5px;background:transparent;z-index:99;cursor:se-resize;overflow:hidden}
     *   .bottom{bottom:0;width:100%;height:5px;line-height:5px;background:transparent;z-index:98;cursor:s-resize;overflow:hidden}
     *   .leftbottom{bottom:0;left:0;width:5px;height:5px;line-height:5px;background:transparent;z-index:99;cursor:sw-resize;overflow:hidden}
     *   .left{left:0;width:5px;height:100%;background:transparent;z-index:98;cursor:w-resize;overflow:hidden}
     * [/code]
     * 
     * 结构举例
     * [code type="html"]
     *   <div id="box">
     *       <span class="lefttop"> </span>
     *       <span class="top"> </span>
     *       <span class="righttop"> </span>
     *       <span class="right"> </span>
     *       <span class="rightbottom"> </span>
     *       <span class="bottom"> </span>
     *       <span class="leftbottom"> </span>
     *       <span class="left"> </span>
     *   </div>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   var _p = NEJ.P('nej.ut'),
     *       _e = NEJ.P('nej._e');
     *   _p._$$Resize._$allocate({
     *       body:'box',
     *       // 自己传样式
     *       flag:{
     *           1:'top',
     *           2:'right',
     *           3:'bottom',
     *           4:'left',
     *           5:'lefttop',
     *           6:'righttop',
     *           7:'rightbottom',
     *           8:'leftbottom'
     *       },
     *       onresizestart:function(_event){
     *           // TODO
     *           // _event.top
     *           // _event.left
     *           // _event.width
     *           // _event.height
     *       },
     *       onresize: function(_event){
     *           // TODO
     *           // _event.top
     *           // _event.left
     *           // _event.width
     *           // _event.height
     *       },
     *       onresizeend:function(_event){
     *           // TODO
     *           // _event.top
     *           // _event.left
     *           // _event.width
     *           // _event.height
     *       },
     *       onmove:function(_event){
     *           // TODO
     *           // _event.top
     *           // _event.left
     *           // _event.width
     *           // _event.height
     *       }
     *   });
     * [/code]
     * @class   {nej.ut._$$Resize} 区域大小调节功能封装
     * @extends {nej.ut._$$Event}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Node}         view  视窗节点，默认为documentElement或body节点
     * @config  {String|Node}  body  大小变化区域节点
     * @config  {Object}       flag  各方向节点样式标识
     * @config  {Boolean}      lock  是否锁定宽高比
     * @config  {Object}       min   最小保留值，{width:50,height:50}
     * 
     * [hr]
     * 大小变化开始触发事件
     * @event  {onresizestart}
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     * [hr]
     * 大小变化触发事件
     * @event  {onresize}
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     * [hr]
     * 大小变化结束触发事件
     * @event  {onresizeend} 
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高

     * [hr]
     * 区域移动触发事件
     * @event  {onmove} 
     * @param  {Object} 事件信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     * 
     */
    _p._$$Resize = NEJ.C();
      _proResize = _p._$$Resize._$extend(_p._$$Event);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _proResize.__reset = function(_options){
        this.__supReset(_options);
        var _min = _options.min||_o;
        this.__body = _e._$get(_options.body);
        this.__minx = parseInt(_min.width)||20;
        this.__miny = parseInt(_min.height)||20;
        this.__view = _e._$get(_options.view)||
                      _e._$getScrollViewPort(this.__body);
        if (!!_options.lock){
            this.__ratio = this.__body.offsetWidth/
                           this.__body.offsetHeight;
            var _ratio = this.__minx/this.__miny;
            if (_ratio<this.__ratio){
                this.__minx = this.__miny*this.__ratio;
            }else{
                this.__miny = this.__minx/this.__ratio;
            }
        }
        this.__doInitNode(_options.flag||_o);
        this.__dragger = _p._$$Dragger._$allocate({
            body:this.__body,
            view:this.__view,
            onchange:this.__onResizeMove._$bind(this)
        });
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _proResize.__destroy = function(){
        this.__supDestroy();
        if (!!this.__dragger)
            this.__dragger = this.__dragger._$recycle();
        delete this.__body;
        delete this.__view;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__doInitNode}
     * @param  {Object} 样式映射表
     * @return {Void}
     */
    _proResize.__doInitNode = function(_class){
        var _arr = [];
        for(var i=1,_list,_node;i<9;i++){
            _list = _e._$getByClassName(this.
                   __body,_class[i]||('js-rs-'+i));
            _node = (_list||_o)[0];
            if (!!_node){
                _arr.push([
                    _node,'mousedown',
                    this.__onResizeStart._$bind2(this,i)
                ]);
            }
        }
        _arr.push([
            document,'mouseup',
            this.__onResizEnd._$bind(this)
        ]);
        _arr.push([
            document,'mousemove',
            this.__onResizing._$bind(this)
        ]);
        this.__doInitDomEvent(_arr);
    };
    /**
     * 锁定比例计算位置大小信息
     * @return {Object} 位置大小信息
     */
    _proResize.__doCalBoxWithLock = function(_flag,_event,_delta){
        switch(_flag){
            // top
            case 1:
                var _tmp  = _event.top+_event.height,
                    _tmp0 = _event.top+_delta.y,
                    _tmp1 = _tmp-this.__miny,
                    _tmp2 = _tmp-Math.floor((this.__box.w-
                            _event.left-this.__delta.x)/this.__ratio);
                _event.top = Math.min(_tmp1,Math.max(0,_tmp0,_tmp2));
                _event.height = _tmp-_event.top;
                _event.width  = Math.floor(_event.height*this.__ratio);
            break;
            // right
            case 2:
                var _tmp0 = _event.width+_delta.x,
                    _tmp1 = Math.floor((this.__box.h-
                           _event.top-this.__delta.y)*this.__ratio),
                    _tmp2 = this.__box.w-_event.left-this.__delta.x;
                _event.width = Math.max(this.__minx,Math.min(_tmp0,_tmp1,_tmp2));
                _event.height = Math.floor(_event.width/this.__ratio);
            break;
            // bottom
            case 3:
                var _tmp  = _event.left+_event.width,
                    _tmp0 = _event.height+_delta.y,
                    _tmp1 = Math.floor(_tmp/this.__ratio),
                    _tmp2 = this.__box.h-_event.top-this.__delta.y;
                _event.height = Math.max(this.__miny,Math.min(_tmp0,_tmp1,_tmp2));
                _event.width  = Math.floor(_event.height*this.__ratio);
                _event.left = _tmp-_event.width;
            break;
            // left
            case 4:
                var _tmp  = _event.left+_event.width,
                    _tmp0 = _event.top+_event.height,
                    _tmp1 = _event.left+_delta.x,
                    _tmp2 = _tmp-Math.floor(_tmp0*this.__ratio),
                    _tmp3 = _tmp-this.__minx;
                _event.left = Math.max(0,_tmp2,Math.min(_tmp1,_tmp3));
                _event.width = _tmp-_event.left;
                _event.height = Math.floor(_event.width/this.__ratio);
                _event.top = _tmp0-_event.height;
            break;
            // left top
            case 5:
                var _tmp  = _event.left+_event.width,
                    _tmp1 = _event.top+_event.height,
                    _tmp2 = _event.top+_delta.y,
                    _tmp3 = _tmp1-Math.floor(_tmp/this.__ratio),
                    _tmp4 = _tmp1-this.__miny;
                _event.top = Math.max(0,_tmp3,Math.min(_tmp2,_tmp4));
                _event.height = _tmp1-_event.top;
                _event.width = Math.floor(_event.height*this.__ratio);
                _event.left = _tmp-_event.width;
            break;
            // right top
            case 6:
                var _tmp  = _event.top+_event.height,
                    _tmp1 = _event.width+_delta.x,
                    _tmp2 = Math.floor(_tmp*this.__ratio),
                    _tmp3 = this.__box.w-_event.left-this.__delta.x;
                _event.width = Math.max(this.__minx,Math.min(_tmp1,_tmp2,_tmp3));
                _event.height = Math.floor(_event.width/this.__ratio);
                _event.top = _tmp-_event.height;
            break;
            // right bottom
            case 7:
                var _tmp1 = _event.height+_delta.y,
                    _tmp2 = Math.floor((this.__box.w-
                           _event.left-this.__delta.x)/this.__ratio),
                    _tmp3 = this.__box.h-_event.top-this.__delta.y;
                _event.height = Math.max(this.__miny,Math.min(_tmp1,_tmp2,_tmp3));
                _event.width = Math.floor(_event.height*this.__ratio);
            break;
            // left bottom
            case 8:
                var _tmp = _event.left+_event.width,
                    _tmp1 = _event.left+_delta.x,
                    _tmp2 = _tmp-this.__minx,
                    _tmp3 = _tmp-Math.floor((this.__box.h-
                            _event.top-this.__delta.y)*this.__ratio);
                _event.left = Math.max(0,_tmp3,Math.min(_tmp1,_tmp2));
                _event.width = _tmp-_event.left;
                _event.height = Math.floor(_event.width/this.__ratio);
            break;
        }
        return _event;
    };
    /**
     * 不锁定比例计算位置大小信息
     * @return {Object} 位置大小信息
     */
    _proResize.__doCalBoxWithoutLock = function(_event,_delta){
        var _tmp;
        // top
        if (this.__flag==1||
            this.__flag==5||
            this.__flag==6){
            _tmp = _event.top+_event.height-this.__miny;
            _event.top = Math.min(_tmp,
                         Math.max(0,_event.top+_delta.y));
            _event.height = _tmp+this.__miny-_event.top;
        }
        // right
        if (this.__flag==2||
            this.__flag==6||
            this.__flag==7){
            _event.width = Math.max(this.__minx,
                           Math.min(_event.width+
                           _delta.x,this.__box.w-
                           _event.left-this.__delta.x));
        }
        // bottom
        if (this.__flag==3||
            this.__flag==7||
            this.__flag==8){
            _event.height = Math.max(this.__miny,
                            Math.min(_event.height+
                            _delta.y,this.__box.h-
                            _event.top-this.__delta.y));
        }
        // left
        if (this.__flag==4||
            this.__flag==5||
            this.__flag==8){
            _tmp = _event.left+_event.width-this.__minx;
            _event.left = Math.min(_tmp,
                          Math.max(0,_event.left+_delta.x));
            _event.width = _tmp+this.__minx-_event.left;
        }
        return _event;
    };
    /**
     * 开始调整大小触发事件
     * @protected
     * @method {__onResizeStart}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proResize.__onResizeStart = (function(){
        var _cursor = {1:'n-resize',2:'e-resize',
                       3:'s-resize',4:'w-resize',
                       5:'nw-resize',6:'ne-resize',
                       7:'se-resize',8:'sw-resize'};
        return function(_event,_flag){
            _v._$stop(_event);
            this.__flag = _flag;
            if (!this.__flag||
                !_cursor[this.__flag]){
                delete this.__flag;
                return;
            } 
            this.__offset = {
                x:_v._$pageX(_event),
                y:_v._$pageY(_event)
            };
            this.__box = {
                w:Math.max(
                  this.__view.clientWidth,
                  this.__view.scrollWidth),
                h:Math.max(
                  this.__view.clientHeight,
                  this.__view.scrollHeight)
            };
            this.__delta = {
                x:this.__body.offsetWidth-
                  this.__body.clientWidth,
                y:this.__body.offsetHeight-
                  this.__body.clientHeight
            };
            document.body.style.cursor = _cursor[this.__flag];
            this._$dispatchEvent('onresizestart',this._$getResizeBox());
        };
    })();
    /**
     * 大小调整过程触发事件
     * @protected
     * @method {__onResizing}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proResize.__onResizing = function(_event){
        if (!this.__flag) return;
        var _offset = {x:_v._$pageX(_event),
                       y:_v._$pageY(_event)};
        var _tmp,
            _delta = {
                x:_offset.x-this.__offset.x,
                y:_offset.y-this.__offset.y
            },
            _event = {
                top:0,left:0
               ,width:this.__body.offsetWidth
               ,height:this.__body.offsetHeight
            };
        this.__offset = _offset;
        // get source value
        for(var x in _event){
            _tmp = parseInt(_e._$getStyle(this.__body,x))||0;
            if (!!_tmp) _event[x] = _tmp;
        }
        _event = !this.__ratio
               ? this.__doCalBoxWithoutLock(_event,_delta)
               : this.__doCalBoxWithLock(this.__flag,_event,_delta);
        // active style
        _tmp = this.__body.style;
        for(var x in _event)
            _tmp[x] = _event[x]+'px';
        this._$dispatchEvent('onresize',_event);
    };
    /**
     * 结束调整大小触发事件
     * @protected
     * @method {__onResizEnd}
     * @param  {Event} 事件对象
     * @return {Void}
     */
    _proResize.__onResizEnd = function(_event){
        if (!this.__flag) return;
        delete this.__box;
        delete this.__flag;
        delete this.__delta;
        delete this.__offset;
        document.body.style.cursor = '';
        this._$dispatchEvent('onresizeend',this._$getResizeBox());
    };
    /**
     * 大小区域移动触发事件
     * @return  {Void}
     */
    _proResize.__onResizeMove = function(_event){
        this._$dispatchEvent('onmove',this._$getResizeBox());
    };
    /**
     * 取区域节点位置大小信息
     * @return {Object} 信息
     * @cofnig {Number} top    距离上
     * @cofnig {Number} left   距离左
     * @cofnig {Number} width  宽
     * @cofnig {Number} height 高
     */
    _proResize._$getResizeBox = function(){
        var _style = this.__body.style;
        return {
            top:parseInt(_style.top)||0,
            left:parseInt(_style.left)||0,
            width:this.__body.offsetWidth,
            height:this.__body.offsetHeight
        };
    };
};
NEJ.define('{lib}util/resize/resize.js',
      ['{lib}util/dragger/dragger.js'],f);