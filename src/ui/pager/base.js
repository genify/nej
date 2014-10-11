/*
 * ------------------------------------------
 * 分页器控件基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module ui/pager/base */
NEJ.define([
    'base/global',
    'base/klass',
    'base/element',
    'base/util',
    'ui/base',
    'util/template/jst',
    'text!./base.css'
],function(NEJ,_k,_e,_u,_i,_t0,_css,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 分页器控件基类封装
     *
     * 页面结构举例
     * ```html
     *   <div id="pagerCnt">page</div>
     *   <div id="pagerCnt2">page</div>
     * ```
     *
     * 脚本举例
     * ```javascript
     *   NEJ.define([
     *       'base/klass',
     *       'ui/pager/pager.base',
     *       'util/page/page'
     *   ],function(_k,_u,_t,_p,_o,_f,_r){
     *       // 第一步：继承此类，新建一个子类
     *       _p._$$Pager = _k._$klass();
     *       _pro = _p._$$Pager._$extend(_u._$$AbstractPager);
     *
     *      // 调用父类reset方法后，
     *   实例化一个_t._$page对象，首尾页用数字表示
     *       // 表现为,上一页 1 2 3.. 10 下一页
     *       // 或者实例化一个page.simple对象，首尾页需要辅助，数字可能不会出现
     *       // 表现为,首页 上一页 5 6 7 8 9 10 下一页 末页
     *       _pro.__reset = function(_options){
     *           this.__super(_options);
     *           this.__page = _t._$$PageFragment._$allocate(this.__popt);
     *           };
     *
     *      // reset之前生成需要的页码结构
     *      _pro.__initNode = function(){
     *
     *      };
     *
     *      // reset之前生成需要的页码结构
     *      _pro.__initNodeTemplate = function(){
     *          // _seed_html根据需求定制
     *          this.__seed_html = _seed_html;
     *      };
     *      return _p;
     *   })
     *
     *   NEJ.define([
     *       '/path/to/custom/pager.js'
     *   ],function(_u,_p,_o,_f,_r){
     *       // 第二步：生成一个pager实例
     *       // 总页数10，默认第一页
     *       var _pager = _u._$$Pager._$allocate({
     *           parent:'pagerCnt',
     *           onchange: function(_event){},
     *           total: 10,
     *           index:1
     *       });
     *   })
     * ```
     *
     * @class     module:ui/pager/base._$$AbstractPager
     * @extends   module:ui/base._$$Abstract
     * @param     {Object} arg0   - 可选配置参数
     * @property  {Number} index  - 当前页码
     * @property  {Number} total  - 总页码数
     * @property  {Number} number - 显示页数
     * @property  {Number} limit  - 总页数限制
     * @property  {Object} label  - 按钮文案，{prev:'&lt;',next:'&gt;'}
     */
    /**
     * 页码切换事件，输入{last:3,index:1,total:12}
     *
     * @event    module:ui/pager/base._$$AbstractPager#onchange
     * @param    {Object} arg0  - 页码状态对象
     * @property {Number} last  - 上一次的页码
     * @property {Number} index - 当前要切换的页面
     * @property {Number} total - 总页面数
     *
     */
    _p._$$AbstractPager = _k._$klass();
    _pro = _p._$$AbstractPager._$extend(_i._$$Abstract);
    /**
     * 控件重置
     *
     * @protected
     * @method module:ui/pager/base._$$AbstractPager#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__bopt = _u._$merge({},_options);
        this.__popt = _u._$merge({},_options);
        delete this.__bopt.onchange;
        this.__popt.onchange =
            this.__onChange._$bind(this);
        this.__super(_options);
        this.__doResetNumber({
            number:_options.number,
            label:_options.label||_o
        });
    };
    /**
     * 控件销毁
     *
     * @protected
     * @method module:ui/pager/base._$$AbstractPager#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        if (!!this.__page){
            this.__page._$recycle();
            delete this.__page;
        }
        this.__super();
        delete this.__bopt;
        delete this.__popt;
        this._$unbind();
        this.__body.innerHTML = '&nbsp;';
    };
    /**
     * 初始化外观信息
     *
     * @protected
     * @method module:ui/pager/base._$$AbstractPager#__initXGui
     * @return {Void}
     */
    _pro.__initXGui = (function(){
        var _seed_css = _e._$pushCSSText(_css);
        return function(){
            this.__seed_css  = _seed_css;
        };
    })();
    /**
     * 重置页码数
     *
     * @protected
     * @method module:ui/pager/base._$$AbstractPager#__doResetNumber
     * @return {Void}
     */
    _pro.__doResetNumber = function(_data){
        var _label = _data.label;
        // previous button
        if (!_data.noprv){
            this.__popt.pbtn = _e._$create(
                'a','zbtn zprv',this.__body
            );
            this.__popt.pbtn.innerHTML = _label.prev||'上一页';
        }
        // page show
        var _arr = [];
        for(var i=1,l=_data.number;i<l;i++){
            _arr.push(_e._$create(
                'a','zpgi zpg'+i,this.__body
            ));
        }
        this.__popt.list = _arr;
        // next button
        if (!_data.nonxt){
            this.__popt.nbtn = _e._$create(
                'a','zbtn znxt',this.__body
            );
            this.__popt.nbtn.innerHTML = _label.next||'下一页';
        }
    };
    /**
     * 页面变化触发事件
     *
     * @protected
     * @method module:ui/pager/base._$$AbstractPager#__onChange
     * @param  {Object} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onChange = function(_event){
        if (this.__flag) return;
        var _index = _event.index,
            _total = _event.total;
        // sync pagers
        this.__flag = !0;
        this._$updatePage(_index,_total);
        _u._$forEach(this.__binders,
            function(_pager){
                _pager._$updatePage(_index,_total);
            });
        this.__flag = !1;
        this._$dispatchEvent('onchange',_event);
    };
    /**
     * 绑定联动分页器
     *
     * 脚本举例
     * ```javascript
     * // 绑定一个联动翻页器
     * _pager._$bind('pagerCnt2')
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$bind
     * @param  {String|Node} arg0 - 联动分页器父容器
     * @return {Void}
     */
    _pro._$bind = function(_parent){
        _parent = _e._$get(_parent);
        if (!_parent) return;
        var _opt = _u._$merge(
            {},this.__bopt
        );
        _opt.parent = _parent;
        _opt.index = this._$getIndex();
        _opt.total = this._$getTotal();
        var _pager = this.constructor._$allocate(_opt);
        _pager._$setEvent('onchange',this.__popt.onchange);
        if (!this.__binders) this.__binders = [];
        this.__binders.push(_pager);
    };
    /**
     * 解除联动分页器
     *
     * 脚本举例
     * ```javascript
     * // 解绑所以联动翻页器
     * _pager._$unbind()
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$unbind
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$unbind = (function(){
        var _doRemove = function(_pager,_index,_list){
            _pager._$recycle();
            _list.splice(_index,1);
        };
        return function(){
            _u._$reverseEach(this.__binders,_doRemove);
        };
    })();
    /**
     * 跳转至指定页码
     *
     * 脚本举例
     * ```javascript
     * // 设置页码到第二页
     * _pager._$setIndex(2)
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$setIndex
     * @param  {Number} arg0 - 页码
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$setIndex = function(_index){
        if (!this.__page) return;
        this.__page._$setIndex(_index);
    };
    /**
     * 取当前页码
     *
     * 脚本举例
     * ```javascript
     * // 取当前页码
     * _pager._$getIndex()
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$getIndex
     * @return {Number} 当前页码
     */
    _pro._$getIndex = function(){
        if (!this.__page) return 1;
        return this.__page._$getIndex();
    };
    /**
     * 取总页数
     *
     * 脚本举例
     * ```javascript
     * // 取总页数
     * _pager._$getTotal()
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$getTotal
     * @return {Number} 总页数
     */
    _pro._$getTotal = function(){
        if (!this.__page) return 1;
        return this.__page._$getTotal();
    };
    /**
     * 更新页码信息
     *
     * 脚本举例
     * ```javascript
     * // 重新设置默认页和总页数
     * _pager._$updatePage(2,10);
     * ```
     *
     * @method module:ui/pager/base._$$AbstractPager#_$updatePage
     * @param  {Number} arg0 - 当前页码
     * @param  {Number} arg1 - 总页码数
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$updatePage = function(_index,_total){
        if (!this.__page) return;
        this.__page._$updatePage(_index,_total);
    };
    /**
     * 更新总页数
     *
     * @method module:ui/pager/base._$$AbstractPager#_$updateTotal
     * @param  {Number} arg0 - 总页数
     * @return {Void}
     */
    _pro._$updateTotal = function(_total){
        if (!this.__page) return;
        this.__page._$updateTotal(_total);
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});