NEJ.define([
    'base/platform',
	'base/element',
	'base/util',
	'./editor.js'
],function(_m,_e,_u,_h,_p,_o,_f,_r){
	// webkit editor patch
	NEJ.patch('WV',function(){
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

	// gecko editor patch
	NEJ.patch('GV',function(){
	    /**
	     * 基本内容过滤
	     */
	    var __empty    = /(?:<(p|div)>(?:\&nbsp\;|<br\/?>)<\/\1>|<br\/?>|\&nbsp\;|\s)+$/gi,
	        __reg_flnh = /\f/g,//换页符
	        __reg_flns = /\n|\r/g,//换行符或回车符
	        __reg_fzag = /<(style|script).*?>.*?<\/\1>/gi,//style和script标签
	        __reg_ftag = /<\/?(?:meta|link|!--\[.+?\]--|[\w]+:[\w]+).*?>/gi,
	        __reg_fimg = /<img(\n|\r|\s|[^>])*?src="data:image\/png;base64[^>]*?>/gi;//FF需要干掉base64的图片数据

	    /**
	     * 验证gecko下内容是否来自Word
	     * @param  {String}  _html 内容
	     * @return {Boolean} gecko下内容是否来自Word
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
	    var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
	        __opspc    = '';
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

	// ie editor patch
	NEJ.patch('TR',function(){
	     var __reg_nwrd = /<\/?[\w]+:[\w]+.*?>/gi,
	         __reg_cxml = /<\?xml[^>]*>/gi;
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

	// ie6-8
	NEJ.patch('TR<=4.0',function(){
        _h.__getSelectText = function(_document){
            var _range = _h.__getRange(_document);
            if (!_range) return '';
            return _range.text;
        };
        _h.__getSelectHtml = function(_document){
            var _range = _h.__getRange(_document);
	        if (!_range) return '';
	        var _html = _range.htmlText;
            return _html||'';
        };
    });

	// ie6-9 editor patch
	NEJ.patch('2.0<=TR<=5.0',function(){
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
	});

	 // ie7-10

	// ie11+
	NEJ.patch('TR>=7.0',function(){
	    /**
	     * 保存当前选择状态
	     * @param  {Node} _node 节点
	     * @return {Void}
	     */
	    _h.__saveRange =
	    _h.__saveRange._$aop(function(_event){
	    	// if have selection patched is on editor.td.js
	        if (!document.selection){
	            _event.stopped = !0;
	            var _node = _event.args[0],
	                _doc = _h.__getDocument(_node),
	                _id = _e._$id(_doc);
	            _rcache[_id] = _h.__getRange(
	                _h.__getWindow(_doc)
	            );
	        }
	    });
		/**
	     * 插入html命令处理
	     * @param {Object} _document 文档对象
	     * @param {Object} _html
	     */
	    _h.__insertHtml = function(_doc,_html){
	        // inserthtml for ie11
            var _win = _h.__getWindow(_doc),
                _range = _h.__getRange(_win);
            var _node = _doc.createElement('div');
            _node.innerHTML = _html;
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

    return _h;
});