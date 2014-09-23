/*
 * ------------------------------------------
 * 区域大小调节功能封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/resize/resize */
NEJ.define([
    'base/global',
    'base/klass',
    'base/event',
    'base/element',
    'base/util',
    'util/event',
    'util/dragger/dragger'
],function(NEJ,_k,_v,_e,_u,_t0,_t1,_p,_o,_f,_r,_pro){
    /**
     * 容器大小位置信息对象
     * @typedef  {Object} module:util/resize/resize._$$Resize~SizeModel
     * @property {Number} top    距离上
     * @property {Number} left   距离左
     * @property {Number} width  宽
     * @property {Number} height 高
     */
    /**
     * 区域大小调节功能封装，方位示意图
     * 
     * ```javascript
     *    //  5------ 1 ------6
     *    //  |               |
     *    //  |               |
     *    //  4               2
     *    //  |               |
     *    //  |               |
     *    //  8------ 3 ------7
     * ```
     * 
     * 各位置对应的手势及样式标识如下表所示：
     *
     * | 标识 | 说明 |
     * | :--- | :--- |
     * | 1    | 向上改变大小，对应鼠标手型n-resize，默认样式名js-rs-1 |
     * | 2    | 向右改变大小，对应鼠标手型e-resize，默认样式名js-rs-2 |
     * | 3    | 向下改变大小，对应鼠标手型s-resize，默认样式名js-rs-3 |
     * | 4    | 向左改变大小，对应鼠标手型w-resize，默认样式名js-rs-4 |
     * | 5    | 向左上改变大小，对应鼠标手型nw-resize，默认样式名js-rs-5 |
     * | 6    | 向右上改变大小，对应鼠标手型ne-resize，默认样式名js-rs-6 |
     * | 7    | 向右下改变大小，对应鼠标手型se-resize，默认样式名js-rs-7 |
     * | 8    | 向左下改变大小，对应鼠标手型sw-resize，默认样式名js-rs-8 |
     * 
     * 样式举例
     * ```css
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
     * ```
     * 
     * 结构举例
     * ```html
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
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/resize/resize'
     * ],function(_t){
     *     _t._$$Resize._$allocate({
     *         body:'box',
     *         // 自己传样式
     *         flag:{
     *             1:'top',
     *             2:'right',
     *             3:'bottom',
     *             4:'left',
     *             5:'lefttop',
     *             6:'righttop',
     *             7:'rightbottom',
     *             8:'leftbottom'
     *         },
     *         onresizestart:function(_event){
     *             // TODO
     *             // _event.top
     *             // _event.left
     *             // _event.width
     *             // _event.height
     *         },
     *         onresize: function(_event){
     *             // TODO
     *             // _event.top
     *             // _event.left
     *             // _event.width
     *             // _event.height
     *         },
     *         onresizeend:function(_event){
     *             // TODO
     *             // _event.top
     *             // _event.left
     *             // _event.width
     *             // _event.height
     *         },
     *         onmove:function(_event){
     *             // TODO
     *             // _event.top
     *             // _event.left
     *             // _event.width
     *             // _event.height
     *         }
     *     });
     * });
     * ```
     * @class   module:util/resize/resize._$$Resize
     * @extends module:util/event._$$EventTarget
     * 
     * @param    {Object}      conifg - 可选配置参数
     * @property {Node}        view   - 视窗节点，默认为documentElement或body节点
     * @property {String|Node} body   - 位置变化节点
     * @property {String|Node} sbody  - 大小变化节点，默认为位置变化节点
     * @property {Object}      flag   - 各方向节点样式标识
     * @property {Boolean}     lock   - 是否锁定宽高比
     * @property {Object}      min    - 最小保留值，{width:50,height:50}
     */
    /** 
     * 大小变化开始触发事件
     * 
     * @event  module:util/resize/resize._$$Resize#onresizestart
     * @param {module:util/resize/resize._$$Resize~SizeModel} event - 事件信息
     */
    /** 
     * 大小变化触发事件
     * 
     * @event  module:util/resize/resize._$$Resize#onresize
     * @param {module:util/resize/resize._$$Resize~SizeModel} event - 事件信息
     */
    /** 
     * 大小变化结束触发事件
     * 
     * @event  module:util/resize/resize._$$Resize#onresizeend
     * @param {module:util/resize/resize._$$Resize~SizeModel} event - 事件信息
     */
    /**
     * 区域移动触发事件
     * 
     * @event  module:util/resize/resize._$$Resize#onmove
     * @param {module:util/resize/resize._$$Resize~SizeModel} event - 事件信息
     */
    _p._$$Resize = _k._$klass();
    _pro = _p._$$Resize._$extend(_t0._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        var _min = _options.min||_o;
        this.__body = _e._$get(_options.body);
        this.__sbody = _e._$get(_options.sbody)||this.__body;
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
        this.__dragger = _t1._$$Dragger._$allocate({
            body:this.__body,
            view:this.__view,
            onchange:this.__onResizeMove._$bind(this)
        });
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__dragger){
            this.__dragger._$recycle();
            delete this.__dragger;
        }
        delete this.__body;
        delete this.__view;
        delete this.__sbody;
        this.__super();
    };
    /**
     * 初始化节点
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__doInitNode
     * @param  {Object} arg0 - 样式映射表
     * @return {Void}
     */
    _pro.__doInitNode = function(_class){
        var _arr = [];
        for(var i=1,_list,_node;i<9;i++){
            _list = _e._$getByClassName(
                this.__body,_class[i]||('js-rs-'+i)
            );
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
     *
     * @protected
     * @method module:util/resize/resize._$$Resize#__doCalBoxWithLock
     * @return {Object} 位置大小信息
     */
    _pro.__doCalBoxWithLock = function(_flag,_event,_delta){
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
     *
     * @protected
     * @method module:util/resize/resize._$$Resize#__doCalBoxWithoutLock
     * @return {Object} 位置大小信息
     */
    _pro.__doCalBoxWithoutLock = function(_event,_delta){
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
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__onResizeStart
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onResizeStart = (function(){
        var _cursor = {
            1:'n-resize',2:'e-resize',
            3:'s-resize',4:'w-resize',
            5:'nw-resize',6:'ne-resize',
            7:'se-resize',8:'sw-resize'
        };
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
            this.__doRefreshBox();
            document.body.style.cursor = _cursor[this.__flag];
            this._$dispatchEvent('onresizestart',this._$getResizeBox());
        };
    })();
    /**
     * 大小调整过程触发事件
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__onResizing
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onResizing = function(_event){
        if (!this.__flag) return;
        var _offset = {
            x:_v._$pageX(_event),
            y:_v._$pageY(_event)
        };
        var _tmp,
            _delta = {
                x:_offset.x-this.__offset.x,
                y:_offset.y-this.__offset.y
            },
            _event = {
                top:parseInt(_e._$getStyle(this.__body,'top'))||0,
                left:parseInt(_e._$getStyle(this.__body,'left'))||0,
                width:parseInt(_e._$getStyle(this.__sbody,'width'))||0,
                height:parseInt(_e._$getStyle(this.__sbody,'height'))||0
            };
        this.__offset = _offset;
        this.__doUpdateSize(_event,_delta);
    };
    /**
     * 结束调整大小触发事件
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__onResizEnd
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onResizEnd = function(_event){
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
     *
     * @protected
     * @method module:util/resize/resize._$$Resize#__onResizeMove
     * @return  {Void}
     */
    _pro.__onResizeMove = function(_event){
        this._$dispatchEvent('onmove',this._$getResizeBox());
    };
    /**
     * 刷新容器信息
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__doRefreshBox
     * @return {Void}
     */
    _pro.__doRefreshBox = function(){
        this.__box = {
            w:Math.max(
                this.__view.clientWidth,
                this.__view.scrollWidth
            ),
            h:Math.max(
                this.__view.clientHeight,
                this.__view.scrollHeight
            )
        };
        this.__delta = {
            x:this.__body.offsetWidth-
              this.__sbody.clientWidth,
            y:this.__body.offsetHeight-
              this.__sbody.clientHeight
        };
    };
    /**
     * 更新位置信息
     * 
     * @protected
     * @method module:util/resize/resize._$$Resize#__doUpdateSize
     * @param  {Object} arg0 - 位置信息
     * @param  {Object} arg2 - 偏移信息
     * @return {Void}
     */
    _pro.__doUpdateSize = (function(){
        var _doUpdate = function(_node,_map,_names){
            _u._$forEach(
                _names,function(_name){
                    var _value = _map[_name];
                    if (_value!=null){
                        _e._$setStyle(_node,_name,_value+'px');
                    }
                }
            );
        };
        return function(_event,_delta){
            _event = !this.__ratio
                   ? this.__doCalBoxWithoutLock(_event,_delta)
                   : this.__doCalBoxWithLock(this.__flag,_event,_delta);
            // active style
            this._$dispatchEvent('onbeforeresize',_event);
            if (!!_event.stopped) return;
            _doUpdate(
                this.__body,
                _event,['top','left']
            );
            _doUpdate(
                this.__sbody,
                _event,['width','height']
            );
            this._$dispatchEvent('onresize',_event);
        };
    })();
    /**
     * 取区域节点位置大小信息
     *
     * @method module:util/resize/resize._$$Resize#_$getResizeBox
     * @return {module:util/resize/resize._$$Resize~SizeModel} 信息
     */
    _pro._$getResizeBox = function(){
        var _style = this.__body.style;
        return {
            top:parseInt(_style.top)||0,
            left:parseInt(_style.left)||0,
            width:this.__body.offsetWidth,
            height:this.__body.offsetHeight
        };
    };
    /**
     * 更新位置信息
     * 
     * @method module:util/resize/resize._$$Resize#_$update
     * @param {module:util/resize/resize._$$Resize~SizeModel} arg0 - 位置信息
     */
    _pro._$update = function(_box){
        this.__flag = 7;
        this.__doRefreshBox();
        this.__doUpdateSize(_box,{x:0,y:0});
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
