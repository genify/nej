var f = function(){

	// gecko editor patch
	NEJ.patch('GV',function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _e = _('nej.e'),
	        _h = _('nej.h');
	    /**
	     * 基本内容过滤
	     */
	    var __empty = /(?:<(p|div)>(?:\&nbsp\;|<br\/?>)<\/\1>|<br\/?>|\&nbsp\;|\s)+$/gi; // empty content
	    /**
	     * word内容过滤
	     */
	    var // below for clear format
	        __reg_flnh = /\f/g,//换页符
	        __reg_flns = /\n|\r/g,//换行符或回车符
	        __reg_fzag = /<(style|script).*?>.*?<\/\1>/gi,//style和script标签
	        __reg_ftag = /<\/?(?:meta|link|!--\[.+?\]--|[\w]+:[\w]+).*?>/gi,
	        __reg_fimg = /<img(\n|\r|\s|[^>])*?src="data:image\/png;base64[^>]*?>/gi;//FF需要干掉base64的图片数据
	    
	    /**
	     * 验证gecko下内容是否来自Word
	     * @param  {String} _html 内容
	     * @return {Boolean}      gecko下内容是否来自Word
	     */
	    var __isFromWord = function(_html){
	        return (_html||'').indexOf('<w:WordDocument>')>=0;
	    };
	    
	    /**
	     * gecko清除word过来的冗余内容
	     * @param  {String} _html 内容
	     * @return {String} 过滤后的内容
	     */
	    _h.__filterWordContent = function(_html){
	        if(!__isFromWord(_html))
	            return _html;
	        return _html.replace(__reg_flns,'\f')
	                    .replace(__reg_ftag,'')
	                    .replace(__reg_fzag,'')
	                    .replace(__reg_flnh,'\n')
	                    .replace(__reg_fimg,'')
	                    .replace(__empty,'');
	    };
	    
	    /**
	     * gecko特殊过滤
	     * @param {Object} _html
	     */
	    _h.__filterContentPath = function(_html){
	        _html = _html.replace(__reg_fimg,'');//过滤掉源数据是base64内容的图片
	        return _html;
	    };
	});

	// ie6-9 editor patch
	NEJ.patch('PV',function(){
	    // variable declaration
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _h = _('nej.h');
	    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
	        __opspc = '';
	    /**
	     * 执行编辑命令
	     * @param  {Node}   _document 文档对象
	     * @param  {String} _command  命令名称
	     * @param  {String} _value    命令值
	     * @return {Void}
	     */
	    _h.__execCommand = 
	    _h.__execCommand._$aop(function(_event){
	        var _args = _event.args;
	        if (_args[1]=='hiliteColor')
	            _args[1] = 'backColor';
	    });
	    
	    /**
	     * 验证presto下内容是否来自Word
	     * @param  {String} _html 内容
	     * @return {Boolean}      presto下内容是否来自Word
	     */
	    var __isFromWord = function(_html){
	        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
	    };
	    
	    /**
	     * presto清除word过来的冗余内容
	     * @param  {String} _html 内容
	     * @return {String} 过滤后的内容
	     */
	    _h.__filterWordContent = function(_html){
	        if(!__isFromWord(_html))
	            return _html;
	        return _html.replace(__reg_nwrd,'');
	    };
	    
	    /**
	     * presto特殊过滤
	     * @param {Object} _html
	     */
	    _h.__filterContentPath = function(_html){
	        return _html.replace(__opspc,'&nbsp;');
	    };
	});

	// ie6-9 editor patch
	NEJ.patch('2.0<=TR<=5.0',['./editor.td.js'],function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _h = _('nej.h');
	    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
	        __reg_cxml = /<\?xml[^>]*>/gi;
	    /**
	     * 移动光标至节点的指定位置
	     * @param  {Node}   _node     节点
	     * @param  {Number} _position 位置，0-末尾、1-起始
	     * @return {Void}
	     */
	    _h.__moveCursorPosition = (function(){
	        var _fmap = [function(_node){return _node.innerText.length;}
	                    ,function(){return 0;}];
	        return _h.__moveCursorPosition._$aop(
	               function(_event){
	                   var _args = _event.args,
	                       _range = _h.__getRange(
	                                _h.__getWindow(_args[0]));
	                   if (!!_range.move){
	                       _event.stopped = !0;
	                       var _func = _fmap[_args[1]];
	                       if (!_func) return;
	                       _range.move('character',_func(_args[0]));
	                       _range.select();
	                   }
	               });
	    })();
	    
	    /**
	     * 验证trident下内容是否来自Word
	     * @param  {String} _html 内容
	     * @return {Boolean}      trident下内容是否来自Word
	     */
	    var __isFromWord = function(_html){
	        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
	    };
	    
	    /**
	     * trident清除word过来的冗余内容
	     * @param  {String} _html 内容
	     * @return {String} 过滤后的内容
	     */
	    _h.__filterWordContent = function(_html){
	        if(!__isFromWord(_html))
	            return _html;
	        return _html.replace(__reg_nwrd,'').replace(__reg_cxml,'');
	    };
	});

	// ie10+ editor patch
	NEJ.patch('TR>=6.0',['./editor.td.js'],function(){
	    var _  = NEJ.P,
	        _u = _('nej.u'),
	        _p = _('nej.p'),
	        _h = _('nej.h');
	    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi;
	    /**
	     * 验证trident1下内容是否来自Word
	     * @param  {String} _html 内容
	     * @return {Boolean}      FF下内容是否来自Word
	     */
	    var __isFromWord = function(_html){
	        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
	    };
	    
	    /**
	     * trident1清除word过来的冗余内容
	     * @param  {String} _html 内容
	     * @return {String} 过滤后的内容
	     */
	    _h.__filterWordContent = function(_html){
	        if(!__isFromWord(_html))
	            return _html;
	        return _html.replace(__reg_nwrd,'');
	    };
	    /**
	     * 插入html命令处理
	     * @param {Object} _document 文档对象
	     * @param {Object} _html
	     */
	    _h.__insertHtml = 
	    _h.__insertHtml._$aop(function(_event){
	        // inserthtml for ie11
	        if (_p._$KERNEL.release>='7.0'){
	            _event.stopped = !0;
	            var _args = _event.args,
	                _doc = _args[0],
	                _win = _h.__getWindow(_doc),
	                _range = _h.__getRange(_win);
	            var _node = _doc.createElement('div');
	            _node.innerHTML = _args[1];
	            // insert content
	            _range.deleteContents();
	            _u._$reverseEach(
	                _node.childNodes,
	                function(_elm){
	                    _range.insertNode(_elm);
	                }
	            );
	            // set focus
	            var _selection = _h.__getSelection(_win);
	            _selection.collapseToEnd();
	            _win.focus();
	        }
	    });
	});

	// webkit editor patch
	NEJ.patch('WV',function(){
	    var _  = NEJ.P,
	        _p = _('nej.p'),
	        _e = _('nej.e'),
	        _h = _('nej.h');
	    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi;
	    /**
	     * 验证webkit下内容是否来自Word
	     * @param  {String} _html 内容
	     * @return {Boolean}      FF下内容是否来自Word
	     */
	    var __isFromWord = function(_html){
	        return (_html||'').search('</?[\\w]+:[\\w]+.*?>')>=0;
	    };
	    
	    /**
	     * webkit清除word过来的冗余内容
	     * @param  {String} _html 内容
	     * @return {String} 过滤后的内容
	     */
	    _h.__filterWordContent = function(_html){
	        if(!__isFromWord(_html))
	            return _html;
	        return _html.replace(__reg_nwrd,'');
	    };
	});
};
define(['./editor.js'],f);