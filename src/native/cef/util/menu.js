/**
 * ------------------------------------------
 * 菜单控件实现文件
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _ = NEJ.P, 
        _o = NEJ.O, 
        _r = NEJ.R, 
        _e = _('nej.e'), 
        _u = _('nej.u'), 
        _t = _('nej.ut'), 
        _c = _('nej.c'), 
        _n = _('nej.n'),
        _p = _('nej.cef.ut'), 
        _proMenu;
    /**
     * 菜单控件封装
     * @class 分页器控件封装
     * @extends {nej.ui._$$Event}
     * @param {Object}
     *            _options 可选配置参数，已处理参数列表如下 
     *                        items 菜单数组
     *                        结构如下：
     *                            text        {String}    菜单名
     *                            onclick    {Function}    菜单点周时回调
     *                            separator    {Boolean}    如果是分割线就为true
     *                            enable        {Boolean}    是否是可用
     *                            data        {Object}    菜单回调时可传出的数据
     *                            children    {Array}        如果有子菜单，可以把menu项放入children入，如果没有子菜可以不传
     */
    _p._$$Menu = NEJ.C();
      _proMenu = _p._$$Menu._$extend(_t._$$Event);

    _proMenu.__init = function(){
        this.__supInit();
        winhelper.onmenuclick = this.__onMenuClickCallBack._$bind(this);
    };
    /**
     * 控件重置
     * 
     * @param {Object}
     *            _options 可选配置参数
     * @return {Void}
     */
    _proMenu.__reset = function(_options) {
        this.__supReset(_options);
        this.__menuId ={};
        var _menu = this.__menuConvert(_options.items);
        _n._$popMenu(_menu);
    };
    /**
     * 回调
     * @param {Object} _id
     */
    _proMenu.__onMenuClickCallBack = function(_id){
        this.__menuId[_id].onclick(this.__menuId[_id].data);
    };
    /**
     * 菜单转换成需要的形式
     * @param {Object} _items
     */
    _proMenu.__menuConvert = function(_items){
        var _menus =[];
        for(var i=0,l=_items.length;i<l;i++){
            var _menu ={};
            if(!!_items[i].separator)
                _menus.push({menu:true,text:'',separator:true,enable:true,menu_id:1011,children:null});
            else{
                var _tmp =  _u._$randNumber(0,16000);
                _menu.menu_id = _tmp;
                _menu.separator = false;
                _menu.menu = true;
                this.__menuId[_tmp] = {data:_items[i].data,onclick:_items[i].onclick};
                if(!_items[i].enable)
                    _menu.enable = true;
                else
                    _menu.enable = _items[i].enable;
                _menu.text = _items[i].text;
                if(!!_items[i].children&&_items[i].children.length!=0){
                    _menu.children = this.__menuConvert(_items[i].children);
                }
                else
                    _menu.children = null;
                _menus.push(_menu);
            }
            
        }
        return _menus;
    };
};
NEJ.define('{lib}native/cef/util/menu.js', ['{lib}util/event.js','{lib}native/command.js','{lib}base/util.js'], f);