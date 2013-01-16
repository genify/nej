/*
 * TrimPath Template. Release 1.1.2.
 * Copyright (C) 2004 - 2007 TrimPath.
 * 
 * TrimPath Template is licensed under the GNU General Public License
 * and the Apache License, Version 2.0, as follows:
 *
 * This program is free software; you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed WITHOUT ANY WARRANTY; without even the 
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * ------------------------------------------
 * JST模板引擎实现文件
 * 实现原理参考trimpath项目 (GPL & APL)
 * http://code.google.com/p/trimpath/
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _e = _('nej.e'),
        _u = _('nej.u'),
        _tcache = {}, // jst string cache
        _stack  = [], // loop statement stack
        _rspc   = /\s+/g,
        _seed   = +new Date,
        _trim,_config,_vars;
    /**
     * 解析表达式中变量信息，如
     * a.b(c,d) || d('aaaa',f,g) && !!test() || 'eeee'
     * @param  {String} 内容
     * @return {Void}
     */
    var _doParseVars = (function(){
        var _reg0 = /^\s*[\[\{'"].*?[\]\}'"]\s*$/,
            _reg1 = /[\&\|\<\>\+\-\*\/\%\,\(\)\[\]\?\:\!\=\;]/,
            // keyword extend later
            _reg2 = /^(?:defined|null|undefined|true|false|instanceof|new|this|typeof|\$v|[\d]+)$/i;
        var _doParseSimple = function(_value){
            if (_reg0.test(_value)) return;
            _value = _value.split('.')[0].trim();
            if (!_value) return;
            try{
                if (_reg2.test(_value))
                    return;
                _vars[_value] = 1;
            }catch(e){
                // ignore
            }
        };
        return function(_content){
            _content = _content||'';
            // for string/array
            if (!_content||
                 _reg0.test(_content)) 
                return;
            _u._$forEach(
                _content.split(_reg1),
                _doParseSimple
            );
        };
    })();
    /*
     * 解析{for x in b}字符串的前缀
     * @param  {Array} _part 按空格拆分的值,['for','x','in','b']
     * @return {String}      解析后的前缀值
     */
    var _doParsePrefixFor = function(_part){
        if (_part[2]!='in')
            throw 'bad for loop statement: '+_part.join(' ');
        _stack.push(_part[1]);
        // b is array or has [1,2,4],{a:'aaa',b:'bbb'}
        _doParseVars(_part[3]);
        return 'var __HASH__'+_part[1]+' = '+_part[3]+','+
                    _part[1]+','+_part[1]+'_count=0;'+
               'if (!!__HASH__'+_part[1]+')'+
                   'for(var '+_part[1]+'_key in __HASH__'+_part[1]+'){'+
                        _part[1]+' = __HASH__'+_part[1]+'['+_part[1]+'_key];'+
                        'if (!'+_part[1]+'||typeof('+_part[1]+')=="function") continue;'+
                        _part[1]+'_count++;';
    };
    /*
     * 解析{forelse}字符串的前缀
     * @return {String} 解析后的前缀值
     */
    var _doParsePrefixForElse = function(){
        var _part = _stack[_stack.length-1];
        return '}; if(!__HASH__'+_part+'||!'+_part+'_count){';
    };
    /*
     * 解析{/for}字符串的前缀
     * @return {String} 解析后的前缀值
     */
    var _doParsePrefixForEnd = function(){
        _stack.pop();
        return '};';
    };
    /*
     * 解析{list seq as x}或者{list 1..100 as x}字符串的前缀
     * @param  {Array} _part 按空格拆分的值,['list','seq','as','x']
     * @return {String}       解析后的前缀值
     */
    var _doParsePrefixList = function(_part){
        if (_part[2]!='as')
            throw 'bad for list loop statement: '+_part.join(' ');
        var _seq = _part[1].split('..');
        if (_seq.length>1){
            // {list 1..100 as x}
            _doParseVars(_seq[0]);
            _doParseVars(_seq[1]);
            return 'for(var '+_part[3]+','+_part[3]+'_index=0,'+
                        _part[3]+'_beg='+_seq[0]+','+_part[3]+'_end='+_seq[1]+','+
                        _part[3]+'_length=parseInt('+_part[3]+'_end-'+_part[3]+'_beg+1);'+
                        _part[3]+'_index<'+_part[3]+'_length;'+_part[3]+'_index++){'+
                        _part[3]+' = '+_part[3]+'_beg+'+_part[3]+'_index;';
        }else{
            // {list seq as x}
            // seq is array [1,2,4]
            _doParseVars(_part[1]);
            return 'for(var __LIST__'+_part[3]+' = '+_part[1]+','+
                        _part[3]+','+_part[3]+'_index=0,'+
                        _part[3]+'_length=__LIST__'+_part[3]+'.length;'+
                        _part[3]+'_index<'+_part[3]+'_length;'+_part[3]+'_index++){'+
                        _part[3]+' = __LIST__'+_part[3]+'['+_part[3]+'_index];';
        }
    };
    /*
     * 解析{macro macroName(arg1,arg2,...argN)}字符串的前缀
     * @param  {Array} _part 按空格拆分的值,['macro','macroName(arg1,arg2,...argN)']
     * @return {String}       解析后的前缀值
     */
    var _doParsePrefixMacro = function(_part){
        if (!_part||!_part.length) return;
        _part.shift(); // remove macro key word
        var _name = _part[0].split('(')[0];
        return 'var '+_name+' = function'+_part.join('').replace(_name,'')+'{var __OUT="";';
    };
    /**
     * 解析IF语句前缀，{if customer != null && customer.balance > 1000 || test(customer)}
     * @param  {String}  返回值
     * @param  {Array}   按空格拆分的值
     * @return {String}  解析后的前缀值
     */
    var _doParsePrefixCondition = function(_prefix,_part){
        _doParseVars(_part.slice(1).join(' '));
        return _prefix;
    };
    // jst configuration
    _config = {
        blk : /^\{(cdata|minify|eval)/i,
        tag : 'forelse|for|list|if|elseif|else|var|macro|break|notrim|trim',
        // {pmin : min param number,
        //  pdft : param default value,
        //  pfix : statement prefix,
        //  sfix : statement suffix}
        def : {
            'if'     : {pfix:_doParsePrefixCondition._$bind(null,'if('),sfix:'){',pmin:1},
            'else'   : {pfix:'}else{'},
            'elseif' : {pfix:_doParsePrefixCondition._$bind(null,'}else if('),sfix:'){',pdft:'true'},
            '/if'    : {pfix:'}'},
            'for'    : {pfix:_doParsePrefixFor,pmin:3},
            'forelse': {pfix:_doParsePrefixForElse},
            '/for'   : {pfix:_doParsePrefixForEnd},
            'list'   : {pfix:_doParsePrefixList,pmin:3},
            '/list'  : {pfix:'};'},
            'break'  : {pfix:'break;'},
            'var'    : {pfix:_doParsePrefixCondition._$bind(null,'var '),sfix:';'},
            'macro'  : {pfix:_doParsePrefixMacro},
            '/macro' : {pfix:'return __OUT;};'},
            'trim'   : {pfix:function(){_trim = !0;}},
            '/trim'  : {pfix:function(){_trim = null;}}
        },
        ext : {
            'rand'   : _u._$randNumberString,
            'escape' : _u._$escape,
            'format' : _u._$format,
            'seed'   : function(_prefix){return (_prefix||'')+''+_seed;},
            'default': function(_value,_default){return _value||_default;}
        }
    };
    /*
     * 解析语句，如{if customer != null && customer.balance > 1000}
     * @param  {String} _content 待解析语句
     * @param  {Array}  _out     内容输出
     * @return {Void}
     */
    var _doParseStatement = (function(){
        var _rbrc = /\\([\{\}])/g;
        return function(_content,_out){
            _content = _content.replace(_rbrc,'$1');
            var _part = _content.slice(1, -1).split(_rspc),
                _conf = _config.def[_part[0]];
            if (!_conf){_doParseSectionText(_content,_out);return;}
            if (!!_conf.pmin&&_conf.pmin>=_part.length)
                throw 'Statement needs more parameters:'+_content;
            // parse prefix
            _out.push((!!_conf.pfix&&
                       typeof(_conf.pfix)!='string')
                       ?_conf.pfix(_part):(_conf.pfix||''));
            // parse params and suffix
            if (!!_conf.sfix){
                if (_part.length<=1) {
                    if (!!_conf.pdft) _out.push(_conf.pdft);
                }else{
                    for(var i=1,l=_part.length;i<l;i++){
                        if (i>1) _out.push(' ');
                        _out.push(_part[i]);
                    }
                }
                _out.push(_conf.sfix);
            }
        };
    })();
    /*
     * 解析表达式，如['firstName','default:"John Doe"','capitalize']
     * @param  {Array}  _exps  表达式内容
     * @param  {Number} _index 表达式索引
     * @param  {Array}  _out   内容输出
     * @return {Void}
     */
    var _doParseExpression = function(_exps,_out){
        // foo|a:x|b:y1,y2|c:z1,z2 -> c(b(a(foo,x),y1,y2),z1,z2)
        if (!_exps||!_exps.length) return;
        if (_exps.length==1){
            var _var = _exps.pop();
            _doParseVars(_var);
            _out.push(_var);
            return;
        }
        var _exp = _exps.pop().split(':');
        _out.push('__MDF[\''+_exp.shift()+'\'](');
        _doParseExpression(_exps,_out);
        if (_exp.length>0){
            var _args = _exp.join(':');
            _doParseVars(_args);
            _out.push(','+_args);
        }
        _out.push(')');
    };
    /*
     * 解析内容，内容中可能包含换行
     * @param  {String} _content 待解析语句
     * @param  {Array}  _out     内容输出
     * @return {Void}
     */
    var _doParseSectionText = function(_content,_out){
        if (!_content) return;
        var _lines = _content.split('\n');
        if (!_lines||!_lines.length) return;
        for(var i=0,l=_lines.length,_line;i<l;i++){
            _line = _lines[i];
            if (!!_trim){
                _line = _line.trim();
                if (!_line) continue;
            } 
            _doParseSectionTextLine(_line,_out);
            if (!!_trim&&i<l-1) _out.push('__OUT+=\'\\n\';');
        }
    };
    /*
     * 解析内容，内容中可能包含${a}或者${%a%}取值语句
     * @param  {String} _content 待解析语句
     * @param  {Array}  _out     内容输出
     * @return {Void}
     */
    var _doParseSectionTextLine = (function(){
        var _raor = /\|\|/g,
            _rvor = /#@@#/g;
        return function(_content,_out){
            // defined used variable
            var _prvmrkend = '}',_prvexpend = -1,
                _length = _content.length,
                _begin,_end,_begexp,_endexp,_exparr;
            while((_prvexpend+_prvmrkend.length)<_length){
                _begin = '${'; _end = '}';
                _begexp = _content.indexOf(_begin,_prvexpend+_prvmrkend.length);
                if (_begexp<0) break;
                // parse ${% customer.firstName %} syntax
                if (_content.charAt(_begexp+2)=='%'){
                    _begin = '${%'; _end = '%}';
                }
                _endexp = _content.indexOf(_end,_begexp+_begin.length);
                if (_endexp<0) break;
                _doParseText(_content.substring(_prvexpend+_prvmrkend.length,_begexp),_out);
                // parse expression: 'firstName|default:"John Doe"|capitalize'.split('|')
                _exparr = _content.substring(_begexp+_begin.length,_endexp).replace(_raor,'#@@#').split('|');
                for(var i=0,l=_exparr.length;i<l;_exparr[i]=_exparr[i].replace(_rvor,'||'),i++);
                _out.push('__OUT+='); _doParseExpression(_exparr,_out); _out.push(';');
                _prvmrkend = _end; _prvexpend = _endexp;
            }
            _doParseText(_content.substring(_prvexpend+_prvmrkend.length),_out);
        };
    })();
    /*
     * 解析纯文本内容，不包含需要解析的内容
     * @param  {String} _content 待解析内容
     * @param  {Array}  _out     内容输出
     * @return {Void}
     */
    var _doParseText = (function(){
        var _map = {r:/\n|\\|\'/g,'\n':'\\n','\\':'\\\\','\'':'\\\''};
        return function(_content,_out){
            if (!_content) return;
            _out.push('__OUT+=\''+_u._$encode(_map,_content)+'\';');
        };
    })();
    /*
     * 解析模板为执行函数
     * @param  {String}   _content 模板内容
     * @return {Function}          模板执行函数
     */
    var _doParseTemplate = (function(){
        var _rtab = /\t/g,
            _rnln = /\n/g,
            _rlne = /\r\n?/g;
        var _doSearchEnd = function(_content,_begin){
            var _index = _content.indexOf("}",_begin+1);
            // for {for x in \{a:'aaa',b:'bbbb'\}}
            while(_content.charAt(_index-1)=='\\'){
                _index = _content.indexOf("}",_index+1);
            }
            return _index;
        };
        var _doParseVarMap = function(){
            var _arr = [];
            _u._$forIn(
                arguments[0],
                function(_value,_key){
                    _key = (_key||'').trim();
                    if (!_key) return;
                    _arr.push(_key+'=$v(\''+_key+'\')');
                });
            return _arr.length>0?('var '+_arr.join(',')+';'):'';
        };
        return function(_content){
            _vars = {};
            _content = _content.replace(_rlne,'\n').replace(_rtab,'    ');
            var _ftxt = ['if(!__CTX) return \'\';',''];
            _ftxt.push('function $v(__NAME){var v = __CTX[__NAME];return v==null?window[__NAME]:v;};');
            _ftxt.push('var defined=function(__NAME){return __CTX[__NAME]!=null;},');
            _ftxt.push('__OUT="";');
            // defiend used variables
            var _prvend = -1,_length = _content.length;
            var _stmtbeg,_stmtend,_statement,
                _blockrx,_blktmp,_blkend,_blkmrk,_blktxt;
            // search content
            while((_prvend+1)<_length){
                // search statement begin
                _stmtbeg = _prvend;
                _stmtbeg = _content.indexOf("{",_stmtbeg+1);
                while(_stmtbeg>=0){
                    _stmtend = _doSearchEnd(_content,_stmtbeg);
                    _statement = _content.substring(_stmtbeg,_stmtend);
                    _blockrx = _statement.match(_config.blk);
                    // minify/eval/cdata implementation
                    if (!!_blockrx){
                        _blktmp = _blockrx[1].length+1;
                        _blkend = _content.indexOf('}',_stmtbeg+_blktmp);
                        if (_blkend>=0){
                            // gen block end marker
                            _blkmrk = _blkend-_stmtbeg-_blktmp<=0
                                    ? ('{/'+_blockrx[1]+'}')
                                    : _statement.substr(_blktmp+1);
                            _blktmp = _content.indexOf(_blkmrk,_blkend+1);
                            // parse block content
                            if (_blktmp>=0){
                                _doParseSectionText(_content.substring(_prvend+1,_stmtbeg),_ftxt);
                                // get block text and parse
                                _blktxt = _content.substring(_blkend+1,_blktmp);
                                switch(_blockrx[1]){
                                    case 'cdata' : _doParseText(_blktxt,_ftxt); break;
                                    case 'minify': _doParseText(_blktxt.replace(_rnln,' ').replace(_rspc,' '),_ftxt); break;
                                    case 'eval'  : if (!!_blktxt) _ftxt.push('__OUT+=(function(){'+_blktxt+'})();'); break;
                                }
                                _stmtbeg = _prvend = _blktmp+_blkmrk.length-1;
                            }
                        }
                    }else if(_content.charAt(_stmtbeg-1)!='$'&&
                             _content.charAt(_stmtbeg-1)!='\\'&&
                             _statement.substr(_statement.charAt(1)=='/'?2:1)
                                                         .search(_config.tag)==0){
                        // break when result is a statement
                        break;
                    }
                    _stmtbeg = _content.indexOf("{",_stmtbeg+1);
                }
                if (_stmtbeg<0) break;
                _stmtend = _doSearchEnd(_content,_stmtbeg);
                if (_stmtend<0) break;
                // parse content
                _doParseSectionText(_content.substring(_prvend+1,_stmtbeg),_ftxt);
                _doParseStatement(_content.substring(_stmtbeg,_stmtend+1),_ftxt);
                _prvend = _stmtend;
            }
            _doParseSectionText(_content.substring(_prvend+1),_ftxt);
            _ftxt.push(';return __OUT;'); 
            _ftxt[1] = _doParseVarMap(_vars);
            _vars = null;
            //console.log(_ftxt.join(''));
            return new Function('__CTX','__MDF',_ftxt.join(''));
        };
    })();
    // interface
    /**
     * 取模板随机数种子<br />
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   // 返回一个当前日期
     *   var _seed = _e._$getHtmlTemplateSeed();
     * [/code]
     * @api    {nej.e._$getHtmlTemplateSeed}
     * @return {String} 随机数种子
     */
    _e._$getHtmlTemplateSeed = function(){
        return _seed;
    };
    /**
     * 根据模板的序列号合并模板数据<br />
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   var _html_seed =  _e._$addHtmlTemplate('<div>${name}</div>');
     *   // 生成结构<div>jack</div>
     *   _e._$getHtmlTemplate(_seed_html,{name:'jack'});
     * [/code]
     * @api    {nej.e._$getHtmlTemplate}
     * @see    {#._$addHtmlTemplate}
     * @param  {String} 模板序列号
     * @param  {Object} 模板数据
     * @param  {Object} 扩展接口
     * @return {String} 合并数据后的内容
     */
    _e._$getHtmlTemplate = (function(){
        var _fcache = {};
        return function(_sn,_data,_extend){
            try{
                _data = _data||{};
                if (!_fcache[_sn]&&!_tcache[_sn])
                    return '';
                if (!_fcache[_sn]){
                    _fcache[_sn] = _doParseTemplate(_tcache[_sn]);
                    delete _tcache[_sn];
                }
                if (!!_extend) NEJ.X(_extend,_config.ext);
                return _fcache[_sn](_data,_extend||_config.ext);
            }catch(ex){
                return ex.message||'';
            }
        };
    })();
    /**
     * 添加JST模板，JST模板可以是节点的值<br />
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   var _html_seed =  _e._$addHtmlTemplate('<div>${name}</div>');
     * [/code]
     * @api    {nej.e._$addHtmlTemplate}
     * @see    {#._$getHtmlTemplate}
     * @param  {String}  JST模板内容或者节点ID
     * @param  {Boolean} 是否保留节点
     * @return {String}  JST模板在缓存中的序列号
     */
    _e._$addHtmlTemplate = function(_content,_keep){
        if (!_content) return '';
        var _sn,_element = _e._$get(_content);
        if (!!_element){
            _sn = _element.id;
            _content = _element.value||_element.innerText;
            if (!_keep) _e._$remove(_element);
        }
        _sn = _sn||('ck_'+_u._$randNumberString());
        _tcache[_sn] = _content;
        return _sn;
    };
    /**
     * 整合模板后输出至指定容器节点<br />
     * 页面脚本举例
     * [code type="html"]
     *   <div id="box">aaa</div>
     * [/code]
     * 脚本举例
     * [code]
     *   var _e = NEJ.P('nej.e');
     *   var _html_seed =  _e._$addHtmlTemplate('<div>${name}</div>');
     *   // 把结构塞到box中，生成<div id="box"><div>jack</div></div>
     *   _e._$renderHtmlTemplate('box',_seed_html,{name:'jack'});
     * [/code]
     * @api    {nej.e._$renderHtmlTemplate}
     * @param  {String|Node} 容器节点
     * @param  {String}      模板序列号
     * @param  {Object}      模板数据
     * @param  {Object}      扩展接口
     * @return {nej.e}
     */
    _e._$renderHtmlTemplate = function(_parent,_sn,_data,_extend){
        _parent = _e._$get(_parent);
        if (!_parent) return this;
        _parent.innerHTML = _e._$getHtmlTemplate(
                               _sn,_data,_extend);
        return this;
    };
};
define('{lib}util/template/jst.js',
      ['{lib}base/util.js'
      ,'{lib}base/element.js'],f);