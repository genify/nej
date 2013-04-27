/**
 * ------------------------------------------
 * 桌面接口实现文件
 * @version  1.0
 * @author   yuqijun(yuqijun@corp.netease.com)
 * ------------------------------------------
 */
var f = function() {
    // variable declaration
    var _   = NEJ.P, 
        _o  = NEJ.O, 
        _e  = _('nej.e'), 
        _u  = _('nej.u'), 
        _v  = _('nej.v'),
        _n  = _('nej.n'),
        _t  = _('nej.ut'),
        _p  = _('nej.cef'),
        _nt = _('nej.cef.ut');
    /**
     * 配置窗体信息
     * @see    {nej.cef._$configWindowPosition}
     * @see    {nej.cef._$configWindowSizeLimit}
     * @param  {Object} 配置信息，其他参数详情见@see指定接口配置信息
     * @return {Void}
     */
    _p._$configWindow = function(_options){
        _p._$configWindowSizeLimit(_options);
        _p._$configWindowPosition(_options);
    };
    /**
     * 配置窗体位置，对齐方式定义如下<br/>
     * 水平对齐方式：
     * [ntb]
     *   名称            |  描述
     *   ----------------------
     *   left   |  左侧对齐
     *   center |  中间对齐
     *   right  |  右侧对齐
     * [/ntb]
     * 
     * 垂直对齐方式：
     * [ntb]
     *   名称              |  描述
     *   ---------------------
     *   top     |  顶部对齐
     *   center  |  中间对齐
     *   bottom  |  底部对齐
     * [/ntb]
     * @api    {nej.cef._$configWindowPosition}
     * @param  {Object} 配置信息
     * @config {String}  name     窗体名称
     * @config {Number}  width    窗体宽度
     * @config {Number}  height   窗体高度
     * @config {Boolean} topmost  窗体是否置顶
     * @config {String}  align    对齐方式，格式定义：水平对齐方式+空格+垂直对齐方式，如 left top
     * @return {Void}
     */
    _p._$configWindowPosition = (function(){
        var _reg0 = /\s+/,
            _fmap = {
                left:function(_mbox,_total){
                    return 0;
                },
                center:function(_mbox,_total){
                    return Math.floor((_total-_mbox)/2);
                },
                right:function(_mbox,_total){
                    return _total;
                }
            };
        _fmap.top = _fmap.left;
        _fmap.bottom = _fmap.right;
        return function(_options){
            _options = _options||_o;
            // set window position
            var _aligns = (_options.align||'').trim().split(_reg0),
                _position = NEJ.EX({width:0,height:0,topmost:!1},_options),
                _wkarea = (_n._$exec('os.getSystemInfo','desktop')||_o).workArea||_o;
            _position.x = (_fmap[_aligns[0]]||_fmap.center)(_position.width,_wkarea.width);
            _position.y = (_fmap[_aligns[1]]||_fmap.center)(_position.height,_wkarea.height);
            if (!_options.name){
                _n._$exec('winhelper.setWindowPosition',_position);
            }else{
                _position.name = _options.name;
                _n._$exec('winhelper.setNativeWindowRect',_position);
            }
        };
    })();
    /**
     * 配置窗体大小限制
     * @api    {nej.cef._$configWindowSizeLimit}
     * @param  {Object} 配置信息
     * @config {Number}  minWidth  窗体最小宽度
     * @config {Number}  maxWidth  窗体最大宽度
     * @config {Number}  minHeight 窗体最小高度
     * @config {Number}  maxHeight 窗体最大高度
     */
    _p._$configWindowSizeLimit = (function(){
        // parse min/max - width/height 
        var _doParseBox = function(_width,_height){
            _width = parseInt(_width);
            _height = parseInt(_height);
            var _result;
            if (!isNaN(_width)){
                _result = _result||{};
                _result.x = _width;
            }
            if (!isNaN(_height)){
                _result = _result||{};
                _result.y = _height;
            }
            return _result;
        };
        return function(_options){
            _options = _options||_o;
            _n._$exec(
                'winhelper.setWindowSizeLimit',
                _doParseBox(_options.minWidth,_options.minHeight),
                _doParseBox(_options.maxWidth,_options.maxHeight)
            );
        };
    })();
    /**
     * 显示窗体,但窗体不会放在最上层
     * @api    {nej.cef._$showWindow}
     * @return {Void}
     */
    _p._$showWindow = function(_name){
        if (!_name){
            _n._$exec('winhelper.showWindow','show');
        }else{
            _n._$exec('winhelper.setNativeWindowShow',_name,!0);
        }
    };
    /**
     * 隐藏窗体
     * @api    {nej.cef._$hideWindow}
     * @return {Void}
     */
    _p._$hideWindow = function(_name){
        if (!_name){
            _n._$exec('winhelper.showWindow','hide');
        }else{
            _n._$exec('winhelper.setNativeWindowShow',_name,!1);
        }
    };
    /**
     * 窗口前置
     * @return {Void}
     */
    _p._$topWindow = function(_name){
        if (!_name){
            _n._$exec('winhelper.bringWindowToTop');
        }
    };
    /**
     * 打开新窗体
     * @param  {String} 新窗口地址，参数通过查询形式输入，如?width=1000&height=200
     * @return {Void}
     */
    _p._$open = (function(){
        var _doParseInt = function(_value,_key,_map){
            var _int = parseInt(_value);
            if (!isNaN(_int)){
                _map[_key] = _int;
            }else if(_value=='true'||_value=='false'){
                _map[_key] = _value=='true';
            }
        };
        return function(_url){
            // TODO parse param
            var _param = _u._$query2object(_url.split('?')[1]||'');
            _u._$forIn(_param,_doParseInt);
            _n._$exec('winhelper.launchWindow',_url,_param,_param);
        };
    })();
    /**
     * 退出应用
     * @return {Void}
     */
    _p._$exit = function(){
        _nt._$$Tray._$getInstance()._$hide();
        _n._$exec('app.exit');
    };
    /**
     * 取菜单项
     * @param  {Object} 菜单配置
     * @return {Object} 菜单项信息
     */
    _p._$getMenuItem = function(_options){
        return NEJ.X({
            text:'菜单项',
            menu:!0,
            menu_id:0,
            enable:!0,
            separator:!1,
            children:null
        },_options);
    };
    /**
     * 弹出菜单
     * @param  {Array} 菜单项列表
     * @return {Void}
     */
    _p._$popMenu = (function(){
        var _xmap = {
            exit:_p._$getMenuItem({text:'退出',menu_id:1005}),
            setting:_p._$getMenuItem({text:'设置',menu_id:1006})
        };
        var _doCheckMenu = function(_item,_index,_list){
            var _xitm = _xmap[_item];
            if (!!_xitm){
                _item = _xitm;
                _list[_index] = _item;
            }
            if (!!_item.children){
                _doCompleteMenu(_item.children);
            }
        };
        var _doCompleteMenu = function(_list){
            _u._$forEach(_list,_doCheckMenu);
        };
        return function(_menu){
            _doCompleteMenu(_menu);
            _n._$exec(
                'winhelper.popupMenu',
                JSON.stringify(_menu)
            );
        };
    })();
    // init document.onmenuacton
    _('window.winhelper').onmenuclick = function(_id){
        _v._$dispatchEvent(
            document,'menuaction',{
                id:_id
            }
        );
    };
    _t._$$CustomEvent._$allocate({
        element:document,
        event:'menuaction'
    });
};
NEJ.define('{lib}native/cef/api.js', 
          ['{lib}base/util.js'
          ,'{lib}base/element.js'
          ,'{lib}native/command.js'
          ,'{lib}util/event/event.js'
          ,'{lib}native/cef/util/tray.js'],f);