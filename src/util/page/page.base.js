/*
 * ------------------------------------------
 * 分页逻辑基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}util/event.js',
    '{lib}base/util.js',
    '{lib}base/element.js',
    '{lib}base/event.js'
],function(NEJ,_k,_t,_u,_e,_v,_p,_o,_f,_r){
    var _pro;
    /**
     * 分页逻辑封装基类<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id="page">
     *       <a href="#" class="zbtn sbtn">首页</a>
     *       <a href="#" class="zbtn zprv">上一页</a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zpgi"></a>
     *       <a href="#" class="zbtn znxt">下一页</a>
     *       <a href="#" class="zbtn ebtn">末页</a>
     *   </div>
     * [/code]
     * 脚本举例
     * [code]
     *   NEJ.define([
     *       '{lib}base/klass.js',
     *       '{lib}util/page/page.base.js',
     *       '{lib}base/util.js'
     *   ],function(_k,_t,_u,_p,_o,_f,_r){
     *       var _pro;
     *       // 首先继承此基类，重写__doRefreshPage方法
     *       _p._$$SimplePage = _k._$klass();
     *       _pro = _p._$$SimplePage._$extend(_t._$$AbstractPage);
     *       // 刷新页码列表算法
     *       _pro.__doRefreshPage = function(){
     *           var _length = this.__list.length;
     *           if (!_length) return;
     *           var _middle = Math.floor(_length/2),
     *               _offset = Math.min(this.__total-_length+1,
     *                       Math.max(1,this.__index-_middle));
     *           _u._$forEach(this.__list,
     *               function(_node,_index){
     *               var _page = _offset+_index;
     *               this.__doSetNodeIndex(_node,
     *                   _page>this.__total?null:_page);
     *           },this);
     *       };
     *       return _p;
     *   })
     *
     *   NEJ.define([
     *       '/path/to/custom/page.simple.js',
     *       '{lib}base/element.js'
     *   ],function(_t,_e,_p,_o,_f,_r){
     *       // 第二步，生成simplePage的实例
     *       var _page = _e._$get('page');
     *       var _ps = _t._$$SimplePage._$allocate({
     *           list:_e._$getByClassName(_page,'zpgi'),
     *           event:'click',
     *           pbtn:_e._$getByClassName(_page,'zprv')[0],
     *           nbtn:_e._$getByClassName(_page,'znxt')[0],
     *           sbtn:_e._$getByClassName(_page,'sbtn')[0],
     *           ebtn:_e._$getByClassName(_page,'ebtn')[0],
     *           index:90,
     *           total:100,
     *           onchange:function(_obj){
     *           // 返回页码信息，last:上一次页面,
     *              index:当前页面，total:总页数
     *           }
     *       });
     *       // 第3步，可以调用提供的共有接口
     *       _ps._$setTotal(100);
     *   })
     * [/code]
     * @class   {_$$AbstractPage} 分页逻辑封装基类
     * @extends {util/event#_$$EventTarget}
     * @param   {Object} 可选配置参数
     * @config  {Array}        list        页码节点列表【长度保持奇数】
     * @config  {String}       event       触发页码切换事件，默认为click
     * @config  {String|Node}  pbtn        上一页按钮
     * @config  {String|Node}  nbtn        下一页按钮
     * @config  {String|Node}  sbtn        首页按钮
     * @config  {String|Node}  ebtn        尾页按钮
     * @config  {Number}       index       当前页码
     * @config  {Number}       total       总页码数
     * @config  {Number}       limit       总页数限制
     * @config  {String}       selected    选中样式，默认为js-selected
     * @config  {String}       disabled    禁用样式，默认为js-disabled
     *
     * [hr]
     * 页码变化触发事件，输入{last:3,index:1,total:12}
     * @event  {onchange}
     * @param  {Object}   页码信息
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total 总页面数
     *
     */
    _p._$$AbstractPage = _k._$klass();
    _pro = _p._$$AbstractPage._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        this.__pbtn  = _options.pbtn;
        this.__nbtn  = _options.nbtn;
        this.__sbtn  = _options.sbtn;
        this.__ebtn  = _options.ebtn;
        this.__name  = _options.event||'click';
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
     * @protected
     * @method {__destroy}
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
     * 检查页码列表节点
     * @protected
     * @method {__doPageListCheck}
     * @param  {Array} 列表节点
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
     * @protected
     * @method {__doSetNodeIndex}
     * @param  {Node}   页码节点
     * @param  {Number} 页码值
     * @return {Void}
     */
    _pro.__doSetNodeIndex = function(_node,_index){
        if (_index==null){
            _node.innerText = '';
            _e._$setStyle(_node,'display','none');
            _e._$delClassName(_node,this.__selected);
        }else{
            _node.innerText = _index;
            _e._$setStyle(_node,'display','');
            _index==this.__index
            ? _e._$addClassName(_node,this.__selected)
            : _e._$delClassName(_node,this.__selected);
        }
    };
    /**
     * 同步按钮状态
     * @protected
     * @method {__doSyncBtnState}
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
     * @protected
     * @method {__doRefreshPage}
     * @return {Void}
     */
    _pro.__doRefreshPage = _f;
    /**
     * 强制刷新至新页码
     * @protected
     * @method {__doChangeIndex}
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
     * @protected
     * @method {__doSaveIndex}
     * @param  {Number}  页码
     * @return {Boolean} 是否保存成功
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
     * @protected
     * @method {__doSaveTotal}
     * @param  {Number}  总页码
     * @return {Boolean} 页码是否保存成功
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
     * @protected
     * @method {__onClick}
     * @param  {Event}  事件对象
     * @param  {Number} 页码标记
     * @return {Void}
     */
    _pro.__onClick = function(_event,_flag){
        _v._$stopDefault(_event);
        var _element = _v._$getElement(_event);
        if (!_element||
             _e._$hasClassName(_element,this.__selected)||
             _e._$hasClassName(_element,this.__disabled))
            return;
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
     * 返回当前页码数<br />
     * 脚本举例
     * [code]
     *   // 获取当前页码
     *   _ps._$getIndex();
     * [/code]
     * @method {_$getIndex}
     * @return {Number} 当前页码
     */
    _pro._$getIndex = function(){
        return this.__index;
    };
    /**
     * 跳转至指定页码<br />
     * 脚本举例
     * [code]
     *   // 设置当前页码
     *   _ps._$setIndex(2);
     * [/code]
     * @method {_$setIndex}
     * @param  {Number} 页码值
     * @return {Void}
     */
    _pro._$setIndex = function(_index){
        var _oidx = this.__index;
        this.__doSaveIndex(_index);
        if (_oidx!=this.__index)
            this.__doChangeIndex();
    };
     /**
     * 返回页码总数<br />
     * 脚本举例
     * [code]
     *   // 获取总页码数
     *   _ps._$getTotal();
     * [/code]
     * @method {_$getTotal}
     * @return {Number} 页码总数
     */
    _pro._$getTotal = function(){
        return this.__total;
    };
    /**
     * 设置总页码数，当前页码重置为首页<br />
     * 脚本举例
     * [code]
     *   // 设置总页码数
     *   _ps._$setTotal(10);
     * [/code]
     * @method {_$setTotal}
     * @param  {Number} 总页码数
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
     * 更新总页码数，当前页码不变，无回调<br />
     * 脚本举例
     * [code]
     *   // 设置总页码数
     *   _ps._$updateTotal(10);
     * [/code]
     * @method {_$updateTotal}
     * @param  {Number} 总页码数
     * @return {Void}
     */
    _pro._$updateTotal = function(_total){
        if (this.__doSaveTotal(_total)){
            this.__doRefreshPage();
            this.__doSyncBtnState();
        }
    };
    /**
     * 更新页码信息<br />
     * 脚本举例
     * [code]
     *   // 设置总页码数，并且跳转到指定页面
     *   _ps._$updatePage(2,10);
     * [/code]
     * @method {_$updatePage}
     * @param  {Number} 当前页码
     * @param  {Number} 总页码数
     * @return {Void}
     */
    _pro._$updatePage = function(_index,_total){
        if (!this.__doSaveTotal(_total)||
            !this.__doSaveIndex(_index))
            return;
        this.__doChangeIndex();
    };

    if (CMPT){
       NEJ.copy(NEJ.P('nej.ut'),_p);
    }

    return _p;
});
