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
(function(){
    /**
     * TrimPath模版引擎名字空间
     * @namespace TrimPath
     */
    // init TrimPath
    if (typeof TrimPath==='undefined'){
        TrimPath = {};
        if (typeof exports!=='undefined')
            TrimPath = exports;
    }
    // variable declaration
    var _tcache = {}, // jst string cache
        _stack  = [], // loop statement stack
        _rspc   = /\s+/g,
        _seed   = +new Date,
        _trim,_config,_vars;
    /*
     * 解析表达式中变量信息，如
     * a.b(c,d) || d('aaaa',f,g) && !!test() || 'eeee'
     * @param  {String} 内容
     * @return {Void}
     */
    var _doParseVars = (function(){
        var _reg0 = /^\s*[\[\{'"].*?[\]\}'"]\s*$/,
            _reg1 = /[\&\|\<\>\+\-\*\/\%\,\(\)\[\]\?\:\!\=\;]/,
            // keyword extend later
            _reg2 = /^(?:defined|null|undefined|true|false|instanceof|new|this|typeof|\$v|[\d]+)$/i,
            // statement extend later
            // new XX
            _reg3 = /^new\s+/,
            _reg4 = /['"]/;
        var _doParseSimple = function(_value){
            if (_reg0.test(_value)) return;
            _value = _value.split('.')[0].trim();
            if (!_value||_reg4.test(_value)) return;
            _value = _value.replace(_reg3,'');
            //console.log('-->'+_value+'<--');
            try{
                if (_reg2.test(_value))
                    return;
                _vars[_value] = 1;
                //console.log('=====>'+_value+'<====');
            }catch(e){
                // ignore
            }
        };
        return function(_content){
            _content = _content||'';
            // for string/array
            if (!_content||_reg0.test(_content)) 
                return;
            var _arr = _content.split(_reg1);
            for(var i=0,l=_arr.length;i<l;i++)
                _doParseSimple(_arr[i]);
        };
    })();
    /*
     * 解析{for x in b}字符串的前缀
     * @param  {Array}  按空格拆分的值,['for','x','in','b']
     * @return {String} 解析后的前缀值
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
                        'if (typeof('+_part[1]+')=="function") continue;'+
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
     * @param  {Array}  按空格拆分的值,['list','seq','as','x']
     * @return {String} 解析后的前缀值
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
     * @param  {Array}  按空格拆分的值,['macro','macroName(arg1,arg2,...argN)']
     * @return {String} 解析后的前缀值
     */
    var _doParsePrefixMacro = function(_part){
        if (!_part||!_part.length) return;
        _part.shift(); // remove macro key word
        var _name = _part[0].split('(')[0];
        return 'var '+_name+' = function'+_part.join('').replace(_name,'')+'{var __OUT=[];';
    };
    /*
     * 解析{include "text-template-id"}字符串前缀
     * @param  {Array}  按空格拆分的值,['include','"text-template-id"']
     * @return {String} 解析后的前缀值
     */
    var _doParsePrefixInline = function(_part){
        if (!_part[1]) 
            throw 'bad include statement: '+_part.join(' ');
        return 'if (typeof inline == "function"){__OUT.push(inline(';
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
    // parse prefix condition
    var _doParsePrefixConditionIF = function(_part){
        return _doParsePrefixCondition('if(',_part);
    };
    var _doParsePrefixConditionELSEIF = function(_part){
        return _doParsePrefixCondition('}else if(',_part);
    };
    var _doParsePrefixConditionVAR = function(_part){
        return _doParsePrefixCondition('var ',_part);
    };
    // jst configuration
    _config = {
        blk : /^\{(cdata|minify|eval)/i,
        tag : 'forelse|for|list|if|elseif|else|var|macro|break|notrim|trim|include',
        // {pmin : min param number,
        //  pdft : param default value,
        //  pfix : statement prefix,
        //  sfix : statement suffix}
        def : {
            'if'     : {pfix:_doParsePrefixConditionIF,sfix:'){',pmin:1},
            'else'   : {pfix:'}else{'},
            'elseif' : {pfix:_doParsePrefixConditionELSEIF,sfix:'){',pdft:'true'},
            '/if'    : {pfix:'}'},
            'for'    : {pfix:_doParsePrefixFor,pmin:3},
            'forelse': {pfix:_doParsePrefixForElse},
            '/for'   : {pfix:_doParsePrefixForEnd},
            'list'   : {pfix:_doParsePrefixList,pmin:3},
            '/list'  : {pfix:'};'},
            'break'  : {pfix:'break;'},
            'var'    : {pfix:_doParsePrefixConditionVAR,sfix:';'},
            'macro'  : {pfix:_doParsePrefixMacro},
            '/macro' : {pfix:'return __OUT.join("");};'},
            'trim'   : {pfix:function(){_trim = !0;}},
            '/trim'  : {pfix:function(){_trim = null;}},
            'inline' : {pfix:_doParsePrefixInline,pmin:1,sfix:'));}'}
        },
        ext : {
            'seed'   : function(_prefix){return (_prefix||'')+''+_seed;},
            'default': function(_value,_default){return _value||_default;}
        }
    };
    /*
     * 解析语句，如{if customer != null && customer.balance > 1000}
     * @param  {String} 待解析语句
     * @param  {Array}  内容输出
     * @return {Void}
     */
    var _doParseStatement = (function(){
        var _rbrc = /\\([\{\}])/g;
        return function(_content,_out){
            _content = _content.replace(_rbrc,'$1');
            //console.log('++++>'+_content);
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
     * @param  {Array}  表达式内容
     * @param  {Number} 表达式索引
     * @param  {Array}  内容输出
     * @return {Void}
     */
    var _doParseExpression = function(_exps,_out){
        // foo|a:x|b:y1,y2|c:z1,z2 -> c(b(a(foo,x),y1,y2),z1,z2)
        if (!_exps||!_exps.length) return;
        if (_exps.length==1){
            var _var = _exps.pop();
            _doParseVars(_var);
            // fix error for ${}
            _out.push(_var==''?'""':_var);
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
     * @param  {String} 待解析语句
     * @param  {Array}  内容输出
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
            if (!!_trim&&i<l-1) _out.push('__OUT.push(\'\\n\');');
        }
    };
    /*
     * 解析内容，内容中可能包含${a}或者${%a%}取值语句
     * @param  {String} 待解析语句
     * @param  {Array}  内容输出
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
                _out.push('__OUT.push('); _doParseExpression(_exparr,_out); _out.push(');');
                _prvmrkend = _end; _prvexpend = _endexp;
            }
            _doParseText(_content.substring(_prvexpend+_prvmrkend.length),_out);
        };
    })();
    /*
     * 解析纯文本内容，不包含需要解析的内容
     * @param  {String} 待解析内容
     * @param  {Array}  内容输出
     * @return {Void}
     */
    var _doParseText = (function(){
        var _map = {r:/\n|\\|\'/g,'\n':'\\n','\\':'\\\\','\'':'\\\''};
        var _doEncode = function(_content){
            return (_content||'').replace(_map.r,function($1){
                return _map[$1]||$1;
            });
        };
        return function(_content,_out){
            if (!_content) return;
            _out.push('__OUT.push(\''+_doEncode(_content)+'\');');
        };
    })();
    /*
     * 解析模板为执行函数
     * @param  {String}   模板内容
     * @return {Function} 模板执行函数
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
            var _arr = [],
                _arg = arguments[0];
            for(var x in _arg){
                x = (x||'').trim();
                if (!x) continue;
                _arr.push(x+'=$v(\''+x+'\')');
            }
            return _arr.length>0?('var '+_arr.join(',')+';'):'';
        };
        return function(_content){
            _vars = {};
            _content = _content.replace(_rlne,'\n').replace(_rtab,'    ');
            var _ftxt = ['if(!__CTX) return \'\';',''];
            _ftxt.push('function $v(__NAME){var v = __CTX[__NAME];return v==null?window[__NAME]:v;};');
            _ftxt.push('var defined=function(__NAME){return __CTX[__NAME]!=null;},');
            _ftxt.push('__OUT=[];');
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
                                    case 'eval'  : if (!!_blktxt) _ftxt.push('__OUT.push((function(){'+_blktxt+'})());'); break;
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
            _ftxt.push(';return __OUT.join("");'); 
            _ftxt[1] = _doParseVarMap(_vars);
            _vars = null;
            //console.log(_ftxt.join(''));
            return new Function('__CTX','__MDF',_ftxt.join(''));
        };
    })();
    // interface
    /**
     * 取模板随机数种子
     *
     * 代码举例
     * ```javascript
     * NEJ.define([
     *     'util/template/trimpath.nej'
     * ],function(){
     *     // 模版统一随机标识
     *     var _seed = TrimPath.seed();
     * });
     * ```
     * 
     * @method TrimPath.seed
     * @return {String} 随机数种子
     */
    TrimPath.seed = function(){
        return _seed;
    };
    /**
     * 根据模板的序列号合并模板数据
     * 
     * 代码举例
     * ```javascript
     * NEJ.define([
     *     'util/template/trimpath'
     * ],function(){
     *     // 模版合并数据
     *     var _html = TrimPath.merge(
     *         _jst_id,{
     *             a:'aaaaaa',
     *             b:'bbbbbbbbbb',
     *             c:'cccccccccccc'
     *         }
     *     );
     * });
     * ```
     *
     * @method TrimPath.merge
     * @param  {String} arg0 - 模板序列号
     * @param  {Object} arg1 - 模板数据
     * @param  {Object} arg2 - 扩展接口
     * @return {String}        合并数据后的内容
     */
    TrimPath.merge = (function(){
        var _fcache = {};
        // for test
        TrimPath.dump = function(){
            return {
                func:_fcache,
                text:_tcache
            };
        };
        return function(_sn,_data,_extend){
            try{
                _data = _data||{};
                if (!_fcache[_sn]&&!_tcache[_sn])
                    return '';
                if (!_fcache[_sn]){
                    _fcache[_sn] = _doParseTemplate(_tcache[_sn]);
                    delete _tcache[_sn];
                }
                if (!!_extend){
                    for(var x in _config.ext)
                        if (!_extend[x])
                            _extend[x] = _config.ext[x];
                }
                return _fcache[_sn](_data,_extend||_config.ext);
            }catch(ex){
                return ex.message||'';
            }
        };
    })();
    /**
     * 添加JST模板，JST模板可以是节点的值
     *
     * 代码举例
     * ```javascript
     * NEJ.define([
     *     'util/template/trimpath'
     * ],function(){
     *     // 解析缓存模版
     *     var _jst_id = TrimPath.merge(
     *         '<div>\
     *              <p>${a}</p>\
     *              <p>${b}</p>\
     *              <p>${c}</p>\
     *          </div>'
     *     );
     * });
     * ```
     *
     * @method TrimPath.parse
     * @param  {String}  arg0 - JST模板内容
     * @param  {Boolean} arg1 - 是否保留节点
     * @return {String}         JST模板在缓存中的标识
     */
    TrimPath.parse = (function(){
        var _xeed = +new Date;
        return function(_content,_sn){
            if (!_content) return '';
            _sn = _sn||('ck-'+(_xeed++));
            if (_tcache[_sn]!=null){
                console.warn('jst template overwrited with key '+_sn);
                console.debug('old template content: '+_tcache[_sn].replace(/\n/g,' '));
                console.debug('new template content: '+_content.replace(/\n/g,' '));
            }
            _tcache[_sn] = _content;
            return _sn;
        };
    })();
})();