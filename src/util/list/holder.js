/*
 * ------------------------------------------
 * 列表占位控件基类实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/list/holder */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'base/element',
    'util/event'
],function(NEJ,_k,_u,_e,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 列表占位控件
     * 
     * 结构举例
     * ```html
     * <div id="scroll-body">
     *   <div>
     *     <!-- content here -->
     *   </div>
     *   <ul>
     *     <li>xxxxxxx</li>
     *     <li>xxxxxxx</li>
     *   </ul>
     * </div>
     * ```
     * 
     * @class    module:util/list/holder._$$ListHolder
     * @extends  module:util/event._$$EventTarget
     *
     * @param    {Object}       config - 可选配置参数
     * @property {String|Node}  sbody  - 滚动容器节点
     * @property {String|Node}  hbody  - 占位容器节点，默认使用滚动容器节点
     * @property {Number|Array} limit  - 可视区域外保留列表项数量控制，通过传入数组控制不同的上下数量
     * @property {Boolean}      fixed  - 列表项高度是否固定，默认为true
     * @property {String}       clazz  - 列表项标识，默认为js-item
     */
    _p._$$ListHolder = _k._$klass();
    _pro = _p._$$ListHolder._$extend(_t._$$EventTarget);
    /**
     * 控件初始化
     *
     * @protected 
     * @method module:util/list/holder._$$ListHolder#__init
     * @return {Void}
     */
    _pro.__init = (function(){
        var _style = {
            height:0,
            overflow:'hidden',
            visibility:'hidden'
        };
        var _doInitHolder = function(_node){
            _e._$style(_node,_style);
        };
        return function(){
            // build placeholder
            this.__holders = {
                top:_e._$create('div'),
                bottom:_e._$create('div')
            };
            _u._$loop(this.__holders,_doInitHolder);
            this.__super();
        };
    })();
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/list/holder._$$ListHolder#__reset
     * @param  {Object} arg0 - 配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _doResetHolder = function(_node){
            _e._$setStyle(_node,'height',0);
        };
        return function(_options){
            this.__super(_options);
            this._$limit(_options.limit);
            this.__clazz = _options.clazz||'js-item';
            this.__fixed = _options.fixed;
            if (this.__fixed==null){
                this.__fixed = !0;
            }
            this.__sbody = _e._$get(_options.sbody);
            this.__doInitDomEvent([[
                this.__sbody,'scroll',
                this.__doScrollCheck._$bind(this)
            ]]);
            this.__hbody = _e._$get(_options.hbody)||this.__sbody;
            if (!!this.__hbody){
                this.__fragments = {
                    tlist:[],blist:[],
                    top:document.createDocumentFragment(),
                    bottom:document.createDocumentFragment()
                };
                _u._$loop(this.__holders,_doResetHolder);
                this.__hbody.appendChild(this.__holders.bottom);
                this.__hbody.insertAdjacentElement('afterBegin',this.__holders.top);
            }
            if (!!this.__sbody){
                this.__doScrollCheck();
            }
        };
    })();
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/list/holder._$$ListHolder#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this._$clearHolder();
        delete this.__fragments;
        delete this.__clazz;
        delete this.__fixed;
        delete this.__limit;
        delete this.__sbody;
        delete this.__hbody;
    };
    /**
     * 滚动检测
     *
     * @protected
     * @method module:util/list/holder._$$ListHolder#__doScrollCheck
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__doScrollCheck = function(_event){
        this._$check({
            scrollTop:this.__sbody.scrollTop,
            clientHeight:this.__sbody.clientHeight,
            list:_e._$getByClassName(
                this.__hbody,this.__clazz
            )
        });
    };
    /**
     * 设置数量限制
     *
     * @method module:util/list/holder._$$ListHolder#_$limit
     * @param  {Number|Array} arg0 - 限制数量
     * @return {Void}
     */
    _pro._$limit = function(_limit){
        if (!_u._$isArray(_limit)){
            _limit = parseInt(_limit)||10;
            _limit = [_limit,_limit];
        }
        this.__limit = _limit;
    };
    /**
     * 检查列表情况
     *
     * @method   module:util/list/holder._$$ListHolder#_$check
     * @param    {Object} arg0         - 滚动信息
     * @property {Number} scrollTop    - 滚动高度
     * @property {Number} clientHeight - 可视高度
     * @property {Number} offset       - 初始项偏移量，不传根据滚动容器计算
     * @property {Array}  list         - 待检查列表
     * @return   {Void}
     */
    _pro._$check = (function(){
        var _doCalOffset = function(){

        };
        return function(_info){
            var _list = _info.list;
            if (!_list||!_list.length) return;
            var _ptr0,_ptr1,
                _delta,_bottom,
                _offset = _info.offset,
                _stop = _info.scrollTop,
                _sbtm = _stop+_info.clientHeight;
            _u._$forIn(_list,function(_node,_index,_list){
                // calculate offset of item
                if (_offset==null){
                    _offset = _e._$offset(_node,this.__sbody).y;
                    if (this.__fixed){
                        _delta = _node.offsetHeight;
                    }
                }else if(this.__fixed){
                    _offset += _delta;
                }else{
                    _offset += _list[_index-1].offsetHeight;
                }
                // check item in top view
                _bottom = _offset+(_delta!=null?_delta:_node.offsetHeight);
                if (_ptr0==null&&_offset<=_stop&&_stop<=_bottom){
                    _ptr0 = _index;
                }
                if(_ptr1==null&&_offset<=_sbtm&&_sbtm<=_bottom){
                    _ptr1 = _index;
                    return !0;
                }
                // check limit
            },this);
        };
    })();
    /**
     * 清除占位符
     * 
     * @method module:util/list/holder._$$ListHolder#_$clearHolder
     * @return {Void}
     */
    _pro._$clearHolder = function(){
        _u._$loop(
            this.__holders,
            _e._$removeByEC
        );
        if (!this.__hbody) return;
        this.__hbody.appendChild(this.__fragments.bottom);
        this.__hbody.insertAdjacentElement('afterBegin',this.__fragments.top);
        delete this.__fragments.tlist;
        delete this.__fragments.blist;
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
