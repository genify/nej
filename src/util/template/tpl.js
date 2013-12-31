/*
 * ------------------------------------------
 * 模板管理接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _o = NEJ.O,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _j = _('nej.j'),
        _t = _('nej.ut'),
        _cache = {}, // template cache
        _skey  = (+new Date)+'-';
    /**
     * 解析模板集合<br />
     * 页面结构举例
     * [code type="html"]
     *   <textarea name="jst" id="jst-box">
     *       <div>${name}</div>
     *   </textarea>
     *   <textarea name="txt" id="txt-box">
     *       <div>pure text</div>
     *   </textarea>
     *   <textarea name="ntp" id="ntp-box">
     *       <div>ntp</div>
     *   </textarea>
     *   <textarea name="js" id="js-box" data-src='/nej-baseline/src/define.js'></textarea>
     *   <textarea name="css" id="css-box" data-src='/nej-baseline/qunit/base/qunit.css'></textarea>
     *   <textarea name="html" id="html-box" data-src='/nej-baseline/qunit/html/ui/audioTest.html'></textarea>
     *   <textarea name="res" id="res-box" data-src='http://pagead2.googlesyndication.com/simgad/15167196758298977737'></textarea>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = _('nej.e');
     *   
     *   // 调用_e._$addHtmlTemplate接口缓存模版，id为key
     *   // 要用的时候通过_e._$getHtmlTemplate(key,{数据})合并模版后返回字符串
     *   _e._$parseTemplate('jst-box');
     *   // 生成结果：<div>jack</div>
     *   _e._$getTextTemplate('jst-box').trim();
     *   
     *   // 通过_e._$addTextTemplate接口缓存纯文本,id为key
     *   _e._$parseTemplate('txt-box');
     *   // 要用的时候通过_e._$getTextTemplate(key)取到纯文本
     *   _e._$getTextTemplate('txt-box')
     *   
     *   
     *   // 通过_e._$addNodeTemplate接口缓存节点，第一次如果是字符串，缓存字符串，id为key
     *   _e._$parseTemplate('ntp-box');
     *   // 要用的时候通过_e._$getNodeTemplate('ntp-box')取出节点，
     *   // 如果缓存中是字符串,取的时候要重新转换成节点，然后重新缓存一边，下次直接是取节点
     *   _e._$getNodeTemplate('ntp-box');
     *   
     *  // 加载id为js-box的textarea节点data-src指定的js文件
     *   _e._$parseTemplate('js-box');
     *   
     *   // 加载id为css-box的textarea节点data-src指定的css文件
     *   _e._$parseTemplate('css-box');
     *   
     *   // 加载id为html-box的textarea节点data-src指定的html文件
     *   _e._$parseTemplate('html-box');
     *   
     *   // 加载id为res-box的textarea节点data-src指定的纯文本文件
     *   _e._$parseTemplate('res-box');
     *   
     * [/code]
     * @api    {nej.e._$parseTemplate}
     * @param  {String|Node} 模板集合节点
     * @param  {Object}      可选配置参数
     * @config {String} root 根路径，相对规则
     * @return {nej.e}
     */
    _e._$parseTemplate = (function(){
        var _count = 0;
        var _doCheckReady = function(){
            if (_count>0) return;
            _count = 0;
            _v._$dispatchEvent(document,'templateready');
            _v._$clearEvent(document,'templateready');
        };
        var _doParseSrc = function(_textarea,_options){
            var _src = _e._$dataset(_textarea,'src');
            if (!_src) return;
            _options = _options||_o;
            var _root = _options.root;
            if (!_root){
            	_root = _textarea.ownerDocument.location.href;
            }else{
            	_root = _u._$absolute(_root);
            }
            _src = _src.split(',');
            _u._$forEach(_src,
                function(_value,_index,_list){
                    _list[_index] = _u._$absolute(_value,_root);
                });
            return _src;
        };
        var _doAddStyle = function(_textarea,_options){
            if (!_textarea) return;
            var _src = _doParseSrc(_textarea,_options);
            if (!!_src)
                _j._$queueStyle(_src,{version:
                   _e._$dataset(_textarea,'version')});
            _e._$addStyle(_textarea.value);
        };
        var _onAddScript = function(_value){
            _count--;
            _e._$addScript(_value);
            _doCheckReady();
        };
        var _doAddScript = function(_textarea,_options){
            if (!_textarea) return;
            var _src = _doParseSrc(_textarea,_options),
                _val = _textarea.value;
            if (!!_src){
                _count++;
                var _options = {
                        version:_e._$dataset(_textarea,'version'),
                        onloaded:_onAddScript._$bind(null,_val)
                    };
                window.setTimeout(_j._$queueScript._$bind(_j,_src,_options),0);
                return;
            }
            _e._$addScript(_val);
        };
        var _onAddHtml = function(_body){
            _count--;
            _e._$parseTemplate(_body);
            _doCheckReady();
        };
        var _doAddHtml = function(_textarea,_options){
            if (!_textarea) return;
            var _src = _doParseSrc(_textarea,_options)[0];
            if (!!_src){
                _count++;
                var _options = {version:_e._$dataset(
                                        _textarea,'version'),
                                onloaded:_onAddHtml};
                window.setTimeout(_j._$loadHtml._$bind(_j,_src,_options),0);
            }
        };
        var _onAddTextResource = function(_id,_text){
            _count--;
            _e._$addTextTemplate(_id,_text||'');
            _doCheckReady();
        };
        var _doAddTextResource = function(_textarea,_options){
            if (!_textarea||!_textarea.id) return;
            var _id = _textarea.id,
                _src = _doParseSrc(_textarea,_options)[0];
            if (!!_src){
                _count++;
                var _url = _src+(_src.indexOf('?')<0?'?':'&')+
                                (_e._$dataset(_textarea,'version')||''),
                    _options = {type:'text',method:'GET',
                                onload:_onAddTextResource._$bind(null,_id)};
                window.setTimeout(_j._$request._$bind(_j,_url,_options),0);
            }
        };
        var _doAddTemplate = function(_node,_options){
            var _type = _node.name.toLowerCase();
            switch(_type){
                case 'jst':
                    _e._$addHtmlTemplate(_node,!0);
                return;
                case 'txt':
                    _e._$addTextTemplate(_node.id,_node.value||'');
                return;
                case 'ntp':
                    _e._$addNodeTemplate(_node.value||'',_node.id);
                return;
                case 'js':
                    _doAddScript(_node,_options);
                return;
                case 'css':
                    _doAddStyle(_node,_options);
                return;
                case 'html':
                    _doAddHtml(_node,_options);
                return;
                case 'res':
                    _doAddTextResource(_node,_options);
                return;
            }
        };
        // extend ontemplateready event on document
        _t._$$CustomEvent._$allocate({
            element:document,
            event:'templateready',
            oneventadd:_doCheckReady
        });
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!!_element){
                var _list = _element.tagName=='TEXTAREA' ? [_element]
                          : _element.getElementsByTagName('textarea');
                _u._$forEach(_list,function(_node){
                	_doAddTemplate(_node,_options);
                });
                _e._$remove(_element,!0);
            }
            _doCheckReady();
            return this;
        };
    })();
    /**
     * 添加文本模板<br />
     * 脚本举例
     * [code]
     *   // 通过_e._$addTextTemplate接口缓存纯文本,id为key
     *   _e._$addTextTemplate('txt-box','i am content');
     *   // 要用的时候通过_e._$getTextTemplate(key)取到纯文本
     *   _e._$getTextTemplate('txt-box')
     * [/code]
     * @api    {nej.e._$addTextTemplate}
     * @see    {nej.e._$getTextTemplate}
     * @param  {String} 模板键值
     * @param  {String} 模板内容
     * @return {nej.e}
     */
    _e._$addTextTemplate = function(_key,_value){
        _cache[_key] = _value||'';
        return this;
    };
    /**
     * 取文本模板<br />
     * 脚本举例
     * [code]
     *   // 通过_e._$addTextTemplate接口缓存纯文本,id为key
     *   _e._$addTextTemplate('txt-box','i am content');
     *   // 要用的时候通过_e._$getTextTemplate(key)取到纯文本
     *   _e._$getTextTemplate('txt-box')
     * [/code]
     * @api    {nej.e._$getTextTemplate}
     * @see    {nej.e._$addTextTemplate}
     * @param  {String} 模板键值
     * @return {String} 模板内容
     */
    _e._$getTextTemplate = function(_key){
        return _cache[_key]||'';
    };
    /**
     * 添加节点模板<br />
     * 脚本举例
     * [code]
     *   // 通过_e._$addNodeTemplate接口缓存节点，第一次如果是字符串，缓存字符串，id为key
     *   _e._$addNodeTemplate(node,'ntp-box');
     *   // 要用的时候通过_e._$getNodeTemplate('ntp-box')取出节点，
     *   // 如果缓存中是字符串,取的时候要重新转换成节点，然后重新缓存一边，下次直接是取节点
     *   _e._$getNodeTemplate('ntp-box');
     * [/code]
     * @api    {nej.e._$addNodeTemplate}
     * @see    {nej.e._$getNodeTemplate}
     * @param  {String|Node} 模板
     * @param  {String}      模板序列号
     * @return {String}      模板序列号
     */
    _e._$addNodeTemplate = function(_element,_key){
        _key = _key||_u._$randNumberString();
        _element = _e._$get(_element)||_element;
        _e._$addTextTemplate(_skey+_key,_element);
        _e._$removeByEC(_element);
        return _key;
    };
    /**
     * 取节点模板<br />
     * 脚本举例
     * [code]
     *   // 通过_e._$addNodeTemplate接口缓存节点，第一次如果是字符串，缓存字符串，id为key
     *   _e._$addNodeTemplate('txt-box');
     *   // 要用的时候通过_e._$getNodeTemplate('ntp-box')取出节点，
     *   // 如果缓存中是字符串,取的时候要重新转换成节点，然后重新缓存一边，下次直接是取节点
     *   _e._$getNodeTemplate('ntp-box');
     * [/code]
     * @api    {nej.e._$getNodeTemplate}
     * @see    {nej.e._$addNodeTemplate}
     * @param  {String} 模板序列号
     * @return {Node}   节点模板
     */
    _e._$getNodeTemplate = function(_key){
        if (!_key) return null;
        _key = _skey+_key;
        var _value = _e._$getTextTemplate(_key);
        if (!_value) return null;
        if (_u._$isString(_value)){
            _value = _e._$html2node(_value);
            _e._$addTextTemplate(_key,_value);
        }
        return _value.cloneNode(!0);
    };
    /**
     * 取ITEM模板列表<br />
     * 页面结构举例
     * [code type="html"]
     *    <div id="item-box"></div>
     * [/code]
     * 脚本举例
     * [code]
     *   // 第一步生成一个ITEM的对象
     *   var _  = NEJ.P,
     *   _p = _('nej.ut'),
     *   _e = _('nej.e'),
     *   _v = _('nej.v'),
     *   _u = _('nej.ui'),
     *   _proMyItem;
     *   var _html_key = _e._$addNodeTemplate('<div>123</div>');
     *   _p._$$MyItem = NEJ.C();
     *   _proMyItem = _p._$$MyItem._$extend(_u._$$Item);
     *     _proMyItem.__reset = function(_options){
     *         this.__data = _options.data;
     *         this.__supReset(_options);
     *     }
     *   _proMyItem.__doRefresh = function(){
     *       this.__body.innerText = this.__data.name;
     *   };
     *  
     *   _proMyItem.__initXGui = function(){
     *       this.__seed_html = _e._$getNodeTemplate(_html_key);
     *   };
     *   
     *   // 第二步：_$getItemTemplate接口生成item列表
     *   var _e = NEJ.P('nej.e');
     *   // 返回一个item的列表，可以循环调用_$recycle()，来销毁
     *   var _items = _e._$getItemTemplate([{name:'jack'},{name:'sean'}],_p._$$MyItem,{parent:'item-box'});
     * [/code]
     * @api    {nej.e._$getItemTemplate}
     * @param  {Array}          数据列表
     * @param  {nej.ui._$$Item} 列表项构造函数
     * @param  {Object}         可选配置参数，已处理参数列表如下，其他参数参见item指定的构造函数的配置参数
     * @config {Number} offset  起始指针【包含】，默认0
     * @config {Number} limit   分配数据长度或者数量，默认为列表长度
     * @return {Array}          ITEM模板列表
     */
    _e._$getItemTemplate = (function(){
        var _doFilter = function(_value,_key){
            return _key=='offset'||_key=='limit';
        };
        return function(_list,_item,_options){
            var _arr = [];
            if (!_list||!_list.length||!_item)
                return _arr;
            _options = _options||_o;
            var _len = _list.length,
                _beg = parseInt(_options.offset)||0,
                _end = Math.min(_len,_beg+(
                       parseInt(_options.limit)||_len)),
                _opt = {total:_list.length,range:[_beg,_end]};
            NEJ.X(_opt,_options,_doFilter);
            for(var i=_beg,_instance;i<_end;i++){
                _opt.index = i;
                _opt.data = _list[i];
                _instance = _item._$allocate(_opt);
                var _id = _instance._$getId();
                _cache[_id] = _instance;
                _instance._$recycle = 
                _instance._$recycle._$aop(
                    function(_id,_instance){
                        delete _cache[_id];
                        delete _instance._$recycle;
                    }._$bind(null,_id,_instance));
                _arr.push(_instance);
            }
            return _arr;
        };
    })();
    /**
     * 根据ID取列表项对象<br />
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   // 通过id拿某一项item
     *   // id是生成item的时候，'itm'+日期字符串生成,存在于_instance.__id变量中
     *   _e._$getItemById('itm-123');
     * [/code]
     * @api    {nej.e._$getItemById}
     * @param  {String} 列表项
     * @return {nej.ui._$$Item} 列表项实例
     */
    _e._$getItemById = function(_id){
        return _cache[_id];
    };
    /**
     * 基于模版系统的页面入口
     * 
     * 脚本示例：
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e'),
     *       _m = _('nb.m');
     * 
     *   // TODO 构建模块 _m._$$PageModuleI
     *   // TODO 构建模块 _m._$$PageModuleII
     *   
     *   _e._$setup(_m._$$PageModuleI,{
     *       // 相关的模版封装在ud-template-box-id节点下
     *       tid:'ud-template-box-id',
     *       // 其他模块相关参数，模块的__onShow接口可接收到此数据
     *       data:{
     *           a:'aaaaa',
     *           b:'bbbbb'
     *       }
     *   });
     *   // 相关模版在template-box节点下
     *   // 没有其他需要输入的数据
     *   _e._$setup(_m._$$PageModuleII);
     * [/code]
     * 
     * @api    {nej.e._$setup}
     * @param  {Object} 模块构造
     * @param  {Object} 可选配置参数
     * @config {String} tid 模版集合ID，默认为template-box
     * @return {Void}
     */
    _e._$setup = function(_klass,_options){
        _options = _options||_o;
        _e._$parseTemplate(_options.tid||'template-box');
        _v._$addEvent(
            document,'templateready',
            function(){
                _klass._$allocate()
                      ._$dispatchEvent('onshow',_options);
            }
        );
    };
    /**
     * 导出模版缓存对象，仅用于调试
     * @return {Void}
     */
    _('dbg').dumpTC = function(){
        return _cache;
    };
};
NEJ.define('{lib}util/template/tpl.js',
          ['{lib}util/template/jst.js'
          ,'{lib}util/event/event.js'
          ,'{lib}util/ajax/tag.js'
          ,'{lib}util/ajax/xdr.js'],f);