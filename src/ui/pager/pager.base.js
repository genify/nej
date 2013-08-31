/*
 * ------------------------------------------
 * 分页器控件基类封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _r = NEJ.R,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _p = _('nej.ui'),
        _pro,
        _seed_css,
        _seed_page;
    if (!!_p._$$AbstractPager) return;
    /**
     * 分页器控件基类封装<br />
     * 页面结构举例
     * [code type="html"]
     *   <div id="pagerCnt">page</div>
     *   <div id="pagerCnt2">page</div>
     * [/code]
     * 脚本举例
     * [code]
     *   // 第一步：继承此类，新建一个子类
     *   _p._$$Pager = NEJ.C();
     *   _proPager = _p._$$Pager._$extend(_p._$$AbstractPager);
     *   
     *   // 调用父类reset方法后，实例化一个NEJ.P('nej.ut')._$page对象，首尾页用数字表示
     *   // 表现为,上一页 1 2 3.. 10 下一页 
     *   // 或者实例化一个page.simple对象，首尾页需要辅助，数字可能不会出现
     *   // 表现为,首页 上一页 5 6 7 8 9 10 下一页 末页 
     *   _proPager.__reset = function(_options){
     *       this.__supReset(_options);
     *       this.__page = _t._$$Page._$allocate(this.__popt);
     *   };
     *   
     *   // reset之前生成需要的页码结构
     *   _proPager.__initNode = function(){
     *   
     *   };
     *   
     *   // reset之前生成需要的页码结构
     *   _proPager.__initNodeTemplate = function(){
     *      // _seed_html根据需求定制
     *      this.__seed_html = _seed_html;
     *   };
     *   
     *   // 第二步：生成一个pager实例
     *   // 总页数10，默认第一页
     *   var _pager = p._$$Pager._$allocate({
     *       parent:'pagerCnt',
     *       onchange: function(_event){},
     *       total: 10,
     *       index:1
     *   });
     * [/code]
     * @class   {nej.ui._$$AbstractPager} 分页器控件封装
     * @extends {nej.ui._$$Abstract}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * @config  {Number} index 当前页码
     * @config  {Number} total 总页码数
     * @config  {Object} label 按钮文案，{prev:'&lt;',next:'&gt;'}
     * 
     * [hr]
     * 
     * @event  {onchange} 页码切换事件，输入{last:3,index:1,total:12}
     * @param  {Object} 页码状态对象
     * @config {Number} last  上一次的页码
     * @config {Number} index 当前要切换的页面
     * @config {Number} total  总页面数
     * 
     */
    _p._$$AbstractPager = NEJ.C();
      _pro = _p._$$AbstractPager._$extend(_p._$$Abstract);
    /**
     * 初始化
     * @protected
     * @method {__init}
     * @return {Void}
     */
    _pro.__init = function(){
        this.__popt = {
            onchange:this.__onChange._$bind(this)
        };
        this.__bopt = {};
        this.__supInit();
    };
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__supReset(_options);
        this.__popt.total = _options.total;
        this.__popt.index = _options.index;
        var _label = _options.label||_o;
        this.__popt.pbtn.innerText = _label.prev||'上一页';
        this.__popt.nbtn.innerText = _label.next||'下一页';
    };
    /**
     * 控件销毁
     * @protected
     * @method {__destroy}
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        this.__page._$recycle();
        this.__bopt = {};
        delete this.__page;
        this._$unbind();
        this.__popt.pbtn.innerText = '上一页';
        this.__popt.nbtn.innerText = '下一页';
    };
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css  = _seed_css;
    };
    /**
     * 初始化节点
     * @protected
     * @method {__initNode}
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__supInitNode();
        var _seed = _e._$getHtmlTemplateSeed();
        this.__popt.list =  
            _e._$getByClassName(
                this.__body,
                'js-i-'+_seed
            );
        this.__popt.pbtn = (
            _e._$getByClassName(
                this.__body,
                'js-p-'+_seed)||_r
            )[0];
        this.__popt.nbtn = (
            _e._$getByClassName(
                this.__body,
                'js-n-'+_seed)||_r
            )[0];
    };
    /**
     * 生成页码列表html代码
     * @protected
     * @method {__doGenPageListXhtml}
     * @param  {Object} 页码列表信息
     * @return {String} 页码列表html代码
     */
    _pro.__doGenPageListXhtml = function(_data){
        return _e._$getHtmlTemplate(_seed_page,_data);
    };
    /**
     * 页面变化触发事件
     * @protected
     * @method {__onChange}
     * @param  {Object} 事件对象
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
     * 绑定联动分页器<br />
     * 脚本举例
     * [code]
     *   // 绑定一个联动翻页器
     *   _pager._$bind('pagerCnt2')
     * [/code]
     * @method {_$bind}
     * @param  {String|Node} 联动分页器父容器
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$bind = function(_parent){
        _parent = _e._$get(_parent);
        if (!_parent) return this;
        var _opt = NEJ.X({
            parent:_parent,
            index:this._$getIndex(),
            total:this._$getTotal()
        },this.__bopt);
        var _pager = this.constructor._$allocate(_opt);
        _pager._$setEvent('onchange',this.__popt.onchange);
        if (!this.__binders) this.__binders = [];
        this.__binders.push(_pager);
        return this;
    };
    /**
     * 解除联动分页器<br />
     * 脚本举例
     * [code]
     *   // 解绑所以联动翻页器
     *   _pager._$unbind()
     * [/code]
     * @method {_$unbind}
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
     * 跳转至指定页码<br />
     * 脚本举例
     * [code]
     *   // 设置页码到第二页
     *   _pager._$setIndex(2)
     * [/code]
     * @method {_$setIndex}
     * @param  {Number} 页码
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$setIndex = function(_index){
        if (!this.__page) return;
        this.__page._$setIndex(_index);
    };
    /**
     * 取当前页码<br />
     * 脚本举例
     * [code]
     *   // 取当前页码
     *   _pager._$getIndex()
     * [/code]
     * @method {_$getIndex}
     * @return {Number} 当前页码 
     */
    _pro._$getIndex = function(){
        if (!this.__page) return 1;
        return this.__page._$getIndex();
    };
    /**
     * 取总页数<br />
     * 脚本举例
     * [code]
     *   // 取总页数
     *   _pager._$getTotal()
     * [/code]
     * @method {_$getTotal}
     * @return {Number} 总页数
     */
    _pro._$getTotal = function(){
        if (!this.__page) return 1;
        return this.__page._$getTotal();
    };
    /**
     * 更新页码信息<br />
     * 脚本举例
     * [code]
     *   // 重新设置默认页和总页数
     *   _pager._$updatePage(2,10);
     * [/code]
     * @method {_$updatePage}
     * @param  {Number} 当前页码
     * @param  {Number} 总页码数
     * @return {nej.ui._$$AbstractPager}
     */
    _pro._$updatePage = function(_index,_total){
        if (!this.__page) return;
        this.__page._$updatePage(_index,_total);
    };
    /**
     * 更新总页数
     * @return {Void}
     */
    _pro._$updateTotal = function(_total){
        if (!this.__page) return;
        this.__page._$updateTotal(_total);
    };
    // ui css text
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{font-size:12px;line-height:160%;}\
        .#<uispace> a{margin:0 2px;padding:2px 8px;color:#333;border:1px solid #aaa;text-decoration:none;}\
        .#<uispace> .js-disabled{cursor:default;}\
        .#<uispace> .js-selected{cursor:default;background:#bbb;}\
    ');
    _seed_page = _e._$addHtmlTemplate('\
        {trim}\
        {if !defined("noprv")||!noprv}\
        <a href="#" class="zbtn zprv ${\'js-p-\'|seed}">上一页</a>\
        {/if}\
        {list 1..number as x}\
        <a href="#" class="zpgi zpg${x} ${\'js-i-\'|seed}"></a>\
        {/list}\
        {if !defined("nonxt")||!nonxt}\
        <a href="#" class="zbtn znxt ${\'js-n-\'|seed}">下一页</a>\
        {/if}\
        {/trim}\
    ');
};
NEJ.define('{lib}ui/pager/pager.base.js',
          ['{lib}ui/base.js'],f);