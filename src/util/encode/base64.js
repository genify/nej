/*
 * ------------------------------------------
 * Base64编解码接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/encode/base64 */
NEJ.define([
    'base/global',
    'base/util'
],function(NEJ,_u,_p,_o,_f,_r){
    // implement
    var __b64tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        __b64char = {},
        __b64index = {};
    // creates two arrays which makes base64 en- and decoding faster
    // this speed is noticeable especially when coding larger texts (>5k or so)
    for(var i=0,l=__b64tab.length,c;i<l;i++){
        c = __b64tab.charAt(i);
        __b64char[i] = c;
        __b64index[c] = i;
    }
    // returns an array of byterepresenting dezimal numbers which represent the
    // plaintext in an UTF-8 encoded version. Expects a string.
    // This function includes an exception management for those nasty browsers like
    // NN401, which returns negative decimal numbers for chars>128. I hate it!!
    // This handling is unfortunately limited to the user's charset. Anyway, it works
    // in most of the cases! Special signs with an unicode>256 return numbers, which
    // can not be converted to the actual unicode and so not to the valid utf-8
    // representation. Anyway, this function does always return values which can not
    // misinterpretd by RC4 or base64 en- or decoding, because every value is >0 and
    // <255!!
    // Arrays are faster and easier to handle in b64 encoding or encrypting....
    var __bin2utf8 = function(_binarray){
        var _index = 0,c,
            _result = [];
        while(_index<_binarray.length){
            c = _binarray[_index];
            // all the signs of asci => 1byte
            if (c<128){
                _result.push(String.fromCharCode(c));
                _index++;
            // all the signs between 127 and 2047 => 2byte
            }else if(c>191&&c<224){
                _result.push(String.fromCharCode(((c&31)<<6)|(_binarray[_index+1]&63)));
                _index += 2;
            // all the signs between 2048 and 66536 => 3byte
            }else{
                _result.push(String.fromCharCode(((c&15)<<12)|((_binarray[_index+1]&63)<<6)|(_binarray[_index+2]&63)));
                _index += 3;
            }
        }
        return _result.join('');
    };
    // returns plaintext from an array of bytesrepresenting dezimal numbers, which
    // represent an UTF-8 encoded text; browser which does not understand unicode
    // like NN401 will show "?"-signs instead
    // expects an array of byterepresenting decimals; returns a string
    var __utf82bin = (function(){
        var _line = /\r\n/g;
        return function(_data){
            _data = _data.replace(_line,'\n');
            var _result = [],
                _test = String.fromCharCode(237);
            if (_test.charCodeAt(0)<0)
                for(var i=0,l=_data.length,c;i<l;i++){
                    c = _data.charCodeAt(i);
                    c>0 ? _result.push(c)
                        : _result.push(((256+c)>>6)|192,((256+c)&63)|128);
                }
            else
                for(var i=0,l=_data.length,c;i<l;i++){
                    c = _data.charCodeAt(i);
                    // all the signs of asci => 1byte
                    if (c<128)
                        _result.push(c);
                    // all the signs between 127 and 2047 => 2byte
                    else if((c>127)&&(c<2048))
                        _result.push((c>>6)|192,(c&63)|128);
                    // all the signs between 2048 and 66536 => 3byte
                    else
                        _result.push((c>>12)|224,((c>>6)&63)|128,(c&63)|128);
                }
            return _result;
        };
    })();
    // creates a base64 encoded text out of an array of byerepresenting dezimals
    // it is really base64 :) this makes serversided handling easier
    // expects an array; returns a string
    var __bin2b64 = function(_binarray){
        var _index = 0,
            _result = [],
            _mode = _binarray.length%3;
        // this is for the padding
        if (_mode==1)
            _binarray.push(0,0);
        if (_mode==2)
            _binarray.push(0);
        // from here conversion
        while(_index<_binarray.length){
            _result.push(__b64char[_binarray[_index]>>2],
                         __b64char[((_binarray[_index]&3)<<4)|(_binarray[_index+1]>>4)],
                         __b64char[((_binarray[_index+1]&15)<<2)|(_binarray[_index+2]>>6)],
                         __b64char[_binarray[_index+2]&63]);
            _index += 3;
        }
        // this is again for the padding
        if (_mode == 1)
            _result[_result.length-1] =
            _result[_result.length-2] = '=';
        if (_mode == 2)
            _result[_result.length-1] = '=';
        // we join the array to return a textstring
        return _result.join('');
    };
    // returns array of byterepresenting numbers created of an base64 encoded text
    // it is still the slowest function in this modul; I hope I can make it faster
    // expects string; returns an array
    var __b642bin = (function(){
        var _clear = /\n|\r|=/g;
        return function(_data){
            var _index = 0,
                _result = [];
            // here we fix this CRLF sequenz created by MS-OS;
            _data = _data.replace(_clear,'');
            for(var i=0,l=_data.length;i<l;i+=4)
                _result.push((__b64index[_data.charAt(i)]<<2)|(__b64index[_data.charAt(i+1)]>>4),
                            ((__b64index[_data.charAt(i+1)]&15)<<4)|(__b64index[_data.charAt(i+2)]>>2),
                            ((__b64index[_data.charAt(i+2)]&3)<<6)|(__b64index[_data.charAt(i+3)]));
            // check list
            var _length = _result.length,
                _mode = _data.length%4;
            if (_mode==2)
                _result = _result.slice(0,_length-2);
            if (_mode==3)
                _result = _result.slice(0,_length-1);
            return _result;
        };
    })();
    /**
     * Base64解码数据
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/encode/base64'
     * ],function(_u){
     *     // 测试一些字符，编码，反编码
     *     var _arr = [
     *         'a','null','function','error',
     *         'return','switch','if','!0',
     *         'UNdefined','NULL','Function',
     *         'ERROR','return 1'
     *     ];
     *     for(var i=0,l=_arr.length,_it,_b64,_str;i<l;i++){
     *         _it = _arr[i];
     *         _b64 = _u._$str2b64(_it);
     *         _str = _u._$b642str(_b64);
     *     }
     * });
     * ```
     * 
     * @method module:util/encode/base64._$b642str
     * @see    module:util/encode/base64._$str2b64
     * @param  {String} arg0 - 数据
     * @return {String}        解码后数据
     */
    _p._$b642str = function(_data){
        return __bin2utf8(__b642bin(_data));
    };
    /**
     * Base64编码数据
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/encode/base64'
     * ],function(_u){
     *     // 测试一些字符，编码，反编码
     *     var _arr = [
     *         'a','null','function','error',
     *         'return','switch','if','!0',
     *         'UNdefined','NULL','Function',
     *         'ERROR','return 1'
     *     ];
     *     for(var i=0,l=_arr.length,_it,_b64,_str;i<l;i++){
     *         _it = _arr[i];
     *         _b64 = _u._$str2b64(_it);
     *         _str = _u._$b642str(_b64);
     *     }
     * });
     * ```
     * 
     * @method module:util/encode/base64._$str2b64
     * @see    module:util/encode/base64._$b642str
     * @param  {String} arg0 - 数据
     * @return {String}        编码后数据
     */
    _p._$str2b64 = function(_data){
        try{
            // only for x0000-x00ff
            return window.btoa(_data);
        }catch(ex){
            return __bin2b64(__utf82bin(_data));
        }
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.u'),_p);
    }

    return _p;
});