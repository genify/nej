/*
 * ------------------------------------------
 * 分页逻辑基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/page/base */
NEJ.define([
    'base/global',
    'base/klass',
    'base/util',
    'base/element',
    'base/event',
    'util/event'
],function(NEJ,_k,_u,_e,_v,_t,_p,_o,_f,_r){
    var _pro;
    /**
     * 分页逻辑封装基类
     * 
     * 结构举例
     * ```html
     * <div id="page">
     *   <a href="#" class="zbtn sbtn">首页</a>
     *   <a href="#" class="zbtn zprv">上一页</a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zpgi"></a>
     *   <a href="#" class="zbtn znxt">下一页</a>
     *   <a href="#" class="zbtn ebtn">末页</a>
     * </div>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/klass',
     *     'base/util',
     *     'util/page/base'
     * ],function(_k,_u,_t,_p,_o,_f,_r){
     *     var _pro;
     *     
     *     // 首先继承此基类，重写__doRefreshPage方法
     *     _p._$$PageSimple = _k._$klass();
     *     _pro = _p._$$PageSimple._$extend(_t._$$PageAbstract);
     *     
     *     // 刷新页码列表算法
     *     _pro.__doRefreshPage = function(){
     *         var _length = this.__list.length;
     *         if (!_length) return;
     *         var _middle = Math.floor(_length/2),
     *             _offset = Math.min(this.__total-_length+1,
     *                       Math.max(1,this.__index-_middle));
     *         _u._$forEach(
     *             this.__list,function(_node,_index){
     *                 var _page = _offset+_index;
     *                 this.__doSetNodeIndex(
     *                     _node,
     *                     _page>this.__total?null:_page
     *                 );
     *             },this
     *         );
     *     };
     *     
     *     return _p;
     * })
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'base/element',
     *     '/path/to/custom/page.js'
     * ],function(_e,_t,_p,_o,_f,_r){
     * 
     *     // 第二步，生成simplePage的实例
     *     var _list = _e._$getChildren('page');
     *     var _page = _t._$$PageSimple._$allocate({
     *         list:_e._$getByClassName('page','zpgi'),
     *         event:'click',
     *         pbtn:_list[1],
     *         nbtn:_list[11],
     *         sbtn:_list[0],
     *         ebtn:_list[12],
     *         index:90,
     *         total:100,
     *         onchange:function(_obj){
     *         // 返回页码信息，last:上一次页面,
     *            index:当前页面，total:总页数
     *         }
     *     });
     *     
     *     // 第三步，可以调用提供的共有接口
     *     _page._$setTotal(100);
     * })
     * ```
     * 
     * @class    module:util/page/base._$$PageAbstract
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object}      config   - 可选配置参数
     * @property {Array}       list     - 页码节点列表【长度保持奇数】
     * @property {String}      event    - 触发页码切换事件，默认为click
     * @property {String|Node} pbtn     - 上一页按钮
     * @property {String|Node} nbtn     - 下一页按钮
     * @property {String|Node} sbtn     - 首页按钮
     * @property {String|Node} ebtn     - 尾页按钮
     * @property {Number}      index    - 当前页码
     * @property {Number}      total    - 总页码数
     * @property {Number}      limit    - 总页数限制
     * @property {Boolean}     parented - 选中样式是否在父节点
     * @property {String}      selected - 选中样式，默认为js-selected
     * @property {String}      disabled - 禁用样式，默认为js-disabled
     */
    /**
     * 页码变化触发事件，输入{last:3,index:1,total:12}
     * 
     * @event    module:util/page/base._$$PageAbstract#onchange
     * @param    {Object} event - 页码信息
     * @property {Number} last  - 上一次的页码
     * @property {Number} index - 当前要切换的页面
     * @property {Number} total - 总页面数
     */
    _p._$$PageAbstract = _k._$klass();
    _pro = _p._$$PageAbstract._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__pbtn  = _options.pbtn;
        this.__nbtn  = _options.nbtn;
        this.__sbtn  = _options.sbtn;
        this.__ebtn  = _options.ebtn;
        this.__name  = _options.event||'click';
        this.__parented = !!_options.parented;
        this.__selected = _options.selected||'js-selected';
        this.__disabled = _options.disabled||'js-disabled';
        this.__doPageListCheck(_options.list);
        this.__limit = _options.limit||Infinity;
        this._$updatePage(
            _options.index||1,
            _options.total||1
        );
    };
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        delete this.__list;
        delete this.__name;
        delete this.__pbtn;
        delete this.__nbtn;
        delete this.__sbtn;
        delete this.__ebtn;
        delete this.__last;
        delete this.__total;
        delete this.__index;
        delete this.__extdata;
        delete this.__selected;
        delete this.__disabled;
    };
    /**
     * 取选中样式所在节点
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__getSelectNode
     * @param  {Node} arg0 - 页码节点
     * @return {Node}        选中样式作用节点
     */
    _pro.__getSelectNode = function(_node){
        return !this.__parented?_node:_node.parentNode;
    };
    /**
     * 检查页码列表节点
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doPageListCheck
     * @param  {Array} arg0 - 列表节点
     * @return {Void}
     */
    _pro.__doPageListCheck = (function(){
        var _doInitDomEvent = function(_node){
            this.__list.push(_node);
            this.__doInitDomEvent([[
                 _node,this.__name,this.
                 __onClick._$bind2(this,0)
            ]]);
        };
        return function(_list){
            this.__list = [];
            this.__doInitDomEvent([[
                this.__pbtn,'click',
                this.__onClick._$bind2(this,-1)
            ],[
                this.__nbtn,'click',
                this.__onClick._$bind2(this, 1)
            ],[
                this.__sbtn,'click',
                this.__onClick._$bind2(this,-2)
            ],[
                this.__ebtn,'click',
                this.__onClick._$bind2(this, 2)
            ]]);
            _u._$forEach(_list,_doInitDomEvent,this);
        };
    })();
    /**
     * 设置节点的页码值
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSetNodeIndex
     * @param  {Node}   arg0 - 页码节点
     * @param  {Number} arg1 - 页码值
     * @return {Void}
     */
    _pro.__doSetNodeIndex = function(_node,_index){
        var _parent = this.__getSelectNode(_node);
        if (_index==null){
            _node.innerText = '';
            _e._$setStyle(_node,'display','none');
            _e._$delClassName(_parent,this.__selected);
        }else{
            _node.innerText = _index;
            _e._$setStyle(_node,'display','');
            _index==this.__index
            ? _e._$addClassName(_parent,this.__selected)
            : _e._$delClassName(_parent,this.__selected);
        }
    };
    /**
     * 同步按钮状态
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSyncBtnState
     * @return {Void}
     */
    _pro.__doSyncBtnState = function(){
        // sync start and previous
        if (this.__index<=1){
            _e._$addClassName(this.__pbtn,this.__disabled);
            _e._$addClassName(this.__sbtn,this.__disabled);
        }else{
            _e._$delClassName(this.__pbtn,this.__disabled);
            _e._$delClassName(this.__sbtn,this.__disabled);
        }
        // sync end and next
        if (this.__index>=this.__total){
            _e._$addClassName(this.__nbtn,this.__disabled);
            _e._$addClassName(this.__ebtn,this.__disabled);
        }else{
            _e._$delClassName(this.__nbtn,this.__disabled);
            _e._$delClassName(this.__ebtn,this.__disabled);
        }
    };
    /**
     * 刷新页码列表算法
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doRefreshPage
     * @return {Void}
     */
    _pro.__doRefreshPage = _f;
    /**
     * 强制刷新至新页码
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doChangeIndex
     * @return {Void}
     */
    _pro.__doChangeIndex = function(){
        this.__doRefreshPage();
        this.__doSyncBtnState();
        this._$dispatchEvent(
            'onchange',{
                last:this.__last,
                total:this.__total,
                index:this.__index,
                ext:this.__extdata
            }
        );
    };
    /**
     * 保存当前页码
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSaveIndex
     * @param  {Number}  arg0 - 页码
     * @return {Boolean}        是否保存成功
     */
    _pro.__doSaveIndex = function(_index){
        _index = parseInt(_index);
        if (isNaN(_index)||
            this.__total==null)
            return !1;
        _index = Math.max(1,Math.min
                (_index,this.__total));
        this.__last  = this.__index;
        this.__index = _index;
        return !0;
    };
    /**
     * 保存总页码
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__doSaveTotal
     * @param  {Number}  arg0 - 总页码
     * @return {Boolean}        页码是否保存成功
     */
    _pro.__doSaveTotal = function(_total){
        _total = parseInt(_total);
        if (isNaN(_total)||_total<1)
            return !1;
        this.__total = Math.min(
            _total,this.__limit
        );
        return !0;
    };
    /**
     * 触发点击事件
     * 
     * @protected
     * @method module:util/page/base._$$PageAbstract#__onClick
     * @param  {Event}  arg0 - 事件对象
     * @param  {Number} arg1 - 页码标记
     * @return {Void}
     */
    _pro.__onClick = function(_event,_flag){
        _v._$stopDefault(_event);
        // check state
        var _element = _v._$getElement(_event),
            _selected = _e._$hasClassName(
                this.__getSelectNode(_element
            ),this.__selected),
            _disabled = _e._$hasClassName(_element,this.__disabled);
        if (!_element||_selected||_disabled){
            return;
        }
        // update index
        var _index = _element.innerText;
        switch(_flag){
            // previous or next
            case  1:
            case -1:
                _index = this.__index+_flag;
            break;
            // end
            case  2:
                _index = this.__total;
            break;
            // start
            case -2:
                _index = 1;
            break;
        }
        this._$setIndex(_index);
    };
    /**
     * 返回当前页码数
     * 
     * 脚本举例
     * ```javascript
     * // 获取当前页码
     * var _index = _page._$getIndex();
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$getIndex
     * @return {Number} 当前页码
     */
    _pro._$getIndex = function(){
        return this.__index;
    };
    /**
     * 跳转至指定页码
     * 
     * 脚本举例
     * ```javascript
     * // 设置当前页码
     * _page._$setIndex(2);
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$setIndex
     * @param  {Number} arg0 - 页码值
     * @return {Void}
     */
    _pro._$setIndex = function(_index){
        var _oidx = this.__index;
        this.__doSaveIndex(_index);
        if (_oidx!=this.__index){
            this.__doChangeIndex();
        }
    };
     /**
     * 返回页码总数
     * 
     * 脚本举例
     * ```javascript
     * // 获取总页码数
     * var _total = _page._$getTotal();
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$getTotal
     * @return {Number} 页码总数
     */
    _pro._$getTotal = function(){
        return this.__total;
    };
    /**
     * 设置总页码数，当前页码重置为首页
     * 
     * 脚本举例
     * ```javascript
     * // 设置总页码数
     * _page._$setTotal(10);
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$setTotal
     * @param  {Number} arg0 - 总页码数
     * @return {Void}
     */
    _pro._$setTotal = function(_total){
        if (this.__doSaveTotal(_total)&&
            this.__index!=null){
            this.__index = 1;
            this.__doChangeIndex();
        }
    };
    /**
     * 更新总页码数，当前页码不变，无回调
     * 
     * 脚本举例
     * ```javascript
     * // 设置总页码数
     * _page._$updateTotal(10);
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$updateTotal
     * @param  {Number} arg0 - 总页码数
     * @return {Void}
     */
    _pro._$updateTotal = function(_total){
        if (this.__doSaveTotal(_total)){
            this.__doRefreshPage();
            this.__doSyncBtnState();
        }
    };
    /**
     * 更新页码信息
     * 
     * 脚本举例
     * ```javascript
     * // 设置总页码数，并且跳转到指定页面
     * _page._$updatePage(2,10);
     * ```
     * 
     * @method module:util/page/base._$$PageAbstract#_$updatePage
     * @param  {Number} arg0 - 当前页码
     * @param  {Number} arg1 - 总页码数
     * @return {Void}
     */
    _pro._$updatePage = function(_index,_total){
        if (!this.__doSaveTotal(_total)||
            !this.__doSaveIndex(_index))
            return;
        this.__doChangeIndex();
    };

    if (CMPT){
        NEJ.P('nej.ut')._$$AbstractPage = _p._$$PageAbstract;
    }

    return _p;
});
