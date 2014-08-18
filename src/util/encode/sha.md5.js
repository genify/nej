/*
 * ------------------------------------------
 * SHA/MD5编解码接口实现文件
 * 参考：http://pajhome.org.uk/crypt/md5/
 *  MD5：http://www.ietf.org/rfc/rfc1321.txt
 * HMAC：http://www.ietf.org/rfc/rfc2104.txt
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js'
],function(NEJ,_p,_o,_f,_r){
    // bits per input character. 8 - ASCII; 16 - Unicode
    var __chrsz = 8;
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    var __rol = function(_number,_count){
        return (_number<<_count)|(_number>>>(32-_count));
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    var __add = function(x,y){
        var _lsw = (x&0xFFFF)+(y&0xFFFF),
            _msw = (x>>16)+(y>>16)+(_lsw>>16);
        return (_msw<<16)|(_lsw&0xFFFF);
    };
    /*
     * Perform the appropriate triplet combination function for the current
     * iteration
     */
    var __sha1ft = function(t,b,c,d){
        if (t<20) return (b&c)|((~b)&d);
        if (t<40) return  b^c^d;
        if (t<60) return (b&c)|(b&d)|(c&d);
        return b^c^d;
    };
    /*
     * Determine the appropriate additive constant for the current iteration
     */
    var __sha1kt = function(t){
        if (t<20) return 1518500249;
        if (t<40) return 1859775393;
        if (t<60) return -1894007588;
        return -899497514;
    };
    /*
     * Convert an 8-bit or 16-bit string to an array of big-endian or little-endian words
     */
    var __str2bin = (function(){
        var _lmove = function(i){return i%32;},
            _bmove = function(i){return 32-__chrsz-i%32;};
        return function(_str,_little){
            var _bin  = [],
                _mask = (1<<__chrsz)-1,
                _move = _little?_lmove:_bmove;
            for (var i=0,l=_str.length*__chrsz;i<l;i+=__chrsz)
                _bin[i>>5] |= (_str.charCodeAt(i/__chrsz)&_mask)<<_move(i);
            return _bin;
        };
    })();
    /*
     * Convert an array of big-endian or little-endian words to a hex string.
     */
    var __bin2hex = (function(){
        // hex output table.
        var _hextab = '0123456789abcdef',
            _lmove  = function(i){return i%4;},
            _bmove  = function(i){return 3-i%4;};
        return function(_binarray,_little){
            var _arr = [],
                _move = _little?_lmove:_bmove;
            for(var i=0,l=_binarray.length*4;i<l;i++){
                _arr.push(_hextab.charAt((_binarray[i>>2]>>(_move(i)*8+4))&0xF)
                         +_hextab.charAt((_binarray[i>>2]>>(_move(i)*8))&0xF));
            }
            return _arr.join('');
        };
    })();
    /*
     * Convert an array of big-endian or little-endian words to a string
     */
    var __bin2str = (function(){
        var _lmove = function(i){return i%32;},
            _bmove = function(i){return 32-__chrsz-i%32;};
        return function(_bin,_little){
            var _arr  = [],
                _mask = (1<<__chrsz)-1,
                _move = _little?_lmove:_bmove;
            for(var i=0,l=_bin.length*32;i<l;i+=__chrsz)
                _arr.push(String.fromCharCode((_bin[i>>5]>>>_move(i))&_mask));
            return _arr.join('');
        };
    })();
    /*
     * Convert an array of big-endian or little-endian words to a base-64 string
     */
    var __bin2b64 = (function(){
        var _b64pad = '=', // base-64 pad character. "=" for strict RFC compliance
            _b64tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            _lmove  = function(i){return i%4;},
            _bmove  = function(i){return 3-i%4;};
        return function(_binarray,_little){
            var _arr = [],
                _move = _little?_lmove:_bmove;
            for(var i=0,_triplet;i<_binarray.length*4;i+=3){
                _triplet = (((_binarray[i>>2]>>8*_move(i))&0xFF)<<16)
                         | (((_binarray[i+1>>2]>>8*_move(i+1))&0xFF)<<8)
                         | ((_binarray[i+2>>2]>>8*_move(i+2))&0xFF);
                for(var j=0;j<4;j++)
                    _arr.push((i*8+j*6>_binarray.length*32) ? _b64pad
                             : _b64tab.charAt((_triplet>>6*(3-j))&0x3F));
            }
            return _arr.join('');
        };
    })();
    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    var __md5cm = function(q,a,b,x,s,t){
        return __add(__rol(__add(__add(a,q),__add(x,t)),s),b);
    };
    var __md5ff = function(a,b,c,d,x,s,t){
        return __md5cm((b&c)|((~b)&d),a,b,x,s,t);
    };
    var __md5gg = function(a,b,c,d,x,s,t){
        return __md5cm((b&d)|(c&(~d)),a,b,x,s,t);
    };
    var __md5hh = function(a,b,c,d,x,s,t){
        return __md5cm(b^c^d,a,b,x,s,t);
    };
    var __md5ii = function(a,b,c,d,x,s,t){
        return __md5cm(c^(b|(~d)),a,b,x,s,t);
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    var __data2md5  = function(x,y){
        x[y>>5] |= 0x80<<((y)%32);
        x[(((y+64)>>>9)<<4)+14] = y;
        var a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;
        for(var i=0,l=x.length,_oa,_ob,_oc,_od;i<l;i+=16){
            _oa = a; _ob = b; _oc = c; _od = d;
            a = __md5ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = __md5ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = __md5ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = __md5ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = __md5ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = __md5ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = __md5ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = __md5ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = __md5ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = __md5ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = __md5ff(c, d, a, b, x[i+10], 17, -42063);
            b = __md5ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = __md5ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = __md5ff(d, a, b, c, x[i+13], 12, -40341101);
            c = __md5ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = __md5ff(b, c, d, a, x[i+15], 22,  1236535329);
            a = __md5gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = __md5gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = __md5gg(c, d, a, b, x[i+11], 14,  643717713);
            b = __md5gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = __md5gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = __md5gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = __md5gg(c, d, a, b, x[i+15], 14, -660478335);
            b = __md5gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = __md5gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = __md5gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = __md5gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = __md5gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = __md5gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = __md5gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = __md5gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = __md5gg(b, c, d, a, x[i+12], 20, -1926607734);
            a = __md5hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = __md5hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = __md5hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = __md5hh(b, c, d, a, x[i+14], 23, -35309556);
            a = __md5hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = __md5hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = __md5hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = __md5hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = __md5hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = __md5hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = __md5hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = __md5hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = __md5hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = __md5hh(d, a, b, c, x[i+12], 11, -421815835);
            c = __md5hh(c, d, a, b, x[i+15], 16,  530742520);
            b = __md5hh(b, c, d, a, x[i+ 2], 23, -995338651);
            a = __md5ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = __md5ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = __md5ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = __md5ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = __md5ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = __md5ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = __md5ii(c, d, a, b, x[i+10], 15, -1051523);
            b = __md5ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = __md5ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = __md5ii(d, a, b, c, x[i+15], 10, -30611744);
            c = __md5ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = __md5ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = __md5ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = __md5ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = __md5ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = __md5ii(b, c, d, a, x[i+ 9], 21, -343485551);
            a = __add(a, _oa);
            b = __add(b, _ob);
            c = __add(c, _oc);
            d = __add(d, _od);
        }   return [a, b, c, d];
    };
    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    var __data2hmacmd5 = function(_key,_data){
        var _bkey = __str2bin(_key,!0);
        if (_bkey.length>16)
            _bkey = __data2md5(_bkey,_key.length*__chrsz);

        var _ipad = Array(16),
            _opad = Array(16);
        for(var i=0;i<16;i++){
            _ipad[i] = _bkey[i]^0x36363636;
            _opad[i] = _bkey[i]^0x5C5C5C5C;
        }

        var _hash = __data2md5(_ipad.concat(
                               __str2bin(_data,!0)),
                               512+_data.length*__chrsz);
        return __data2md5(_opad.concat(_hash),512+128);
    };
    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    var __data2sha1 = function(x,_length){
        /* append padding */
        x[_length>>5] |= 0x80<<(24-_length%32);
        x[((_length+64>>9)<<4)+15] = _length;
        var w = Array(80),  a = 1732584193,
            b = -271733879, c = -1732584194,
            d = 271733878,  e = -1009589776;
        for(var i=0,l=x.length,_olda,
            _oldb,_oldc,_oldd,_olde;i<l;i+=16){
            _olda = a; _oldb = b;
            _oldc = c; _oldd = d; _olde = e;
            for(var j=0;j<80;j++){
                w[j] = j<16 ? x[i+j]
                            : __rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);
                var t = __add(__add(__rol(a,5),
                              __sha1ft(j,b,c,d)),
                              __add(__add(e,w[j]),
                              __sha1kt(j)));
                e = d; d = c;
                c = __rol(b,30);
                b = a; a = t;
            }
            a = __add(a,_olda);
            b = __add(b,_oldb);
            c = __add(c,_oldc);
            d = __add(d,_oldd);
            e = __add(e,_olde);
        }
        return [a,b,c,d,e];
    };
    /*
     * Calculate the HMAC-SHA1 of a key and some data
     */
    var __data2hmacsha1 = function(_key,_data){
        var _bkey = __str2bin(_key);
        if (_bkey.length>16)
            _bkey = __data2sha1(_bkey,_key.length*__chrsz);

        var _ipad = Array(16),
            _opad = Array(16);
        for(var i=0;i<16;i++){
            _ipad[i] = _bkey[i]^0x36363636;
            _opad[i] = _bkey[i]^0x5C5C5C5C;
        }
        var _hash = __data2sha1(_ipad.concat(__str2bin(
                                _data)),512+_data.length*__chrsz);
        return __data2sha1(_opad.concat(_hash),512+160);
    };
    /**
     * HMAC-SHA1编码数据输出十六进制串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出十六进制编码串
     *   // a3c024f01cccb3b63457d848b0d2f89c1f744a3d
     *   _p._$hmacsha12hex('123','abc');
     * ```
     * @api    {nej.u._$hmacsha12hex}
     * @param  {String}   密钥
     * @param  {Variable} 数据
     * @return {String}   十六进制编码串
     */
    p._$hmacsha12hex = function(_key,_data) {
        return __bin2hex(__data2hmacsha1(_key,_data));
    };
    /**
     * HMAC-SHA1编码数据输出Base64串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出Base64编码串
     *   // o8Ak8BzMs7Y0V9hIsNL4nB90Sj0=
     *   _p._$hmacsha12b64('123','abc');
     * ```
     * @api    {nej.u._$hmacsha12b64}
     * @param  {String}   密钥
     * @param  {Variable} 数据
     * @return {String}   Base64编码串
     */
    p._$hmacsha12b64 = function(_key,_data) {
        return __bin2b64(__data2hmacsha1(_key,_data));
    };
    /**
     * HMAC-SHA1编码数据输出字符串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出字符串
     *   // £À$ðÌ³¶4WØH°ÒøtJ=
     *   _p._$hmacsha12str('123','abc');
     * ```
     * @api    {nej.u._$hmacsha12str}
     * @param  {String}   密钥
     * @param  {Variable} 数据
     * @return {String}   编码串
     */
    p._$hmacsha12str = function(_key,_data) {
        return __bin2str(__data2hmacsha1(_key,_data));
    };
    /**
     * HMAC-MD5编码数据输出十六进制串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出十六进制串
     *   // b2a1ec0f3e0607099d7f39791c04e9a4
     *   _p._$hmacsha12str('123','abc');
     * ```
     * @api    {nej.u._$hmacsha12str}
     * @param  {String} 密钥
     * @param  {String} 数据
     * @return {String} 十六进制串
     */
    p._$hmacmd52hex = function(_key,_data){
        return __bin2hex(__data2hmacmd5(_key,_data),!0);
    };
    /**
     * HMAC-MD5编码数据输出Base64串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出Base64串
     *   // sqHsDz4GBwmdfzl5HATppA==
     *   _p._$hmacmd52b64('123','abc');
     * ```
     * @api    {nej.u._$hmacmd52b64}
     * @param  {String} 密钥
     * @param  {String} 数据
     * @return {String} Base64串
     */
    p._$hmacmd52b64 = function(_key,_data){
        return __bin2b64(__data2hmacmd5(_key,_data),!0);
    };
    /**
     * HMAC-MD5编码数据输出字符串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 密钥123，加密abc，输出字符串
     *   // ²¡ì> 9yé¤
     *   _p._$hmacmd52str('123','abc');
     * ```
     * @api    {nej.u._$hmacmd52str}
     * @param  {String} 密钥
     * @param  {String} 数据
     * @return {String} 字符串
     */
    p._$hmacmd52str = function(_key,_data){
        return __bin2str(__data2hmacmd5(_key,_data),!0);
    };
    /**
     * SHA1编码数据输出十六进制串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出十六进制编码串
     *   // 40bd001563085fc35165329ea1ff5c5ecbdbbeef
     *   _p._$sha12hex('123');
     * ```
     * @api    {nej.u._$sha12hex}
     * @param  {Variable} 数据
     * @return {String}   十六进制编码串
     */
    p._$sha12hex = function(_data) {
        return __bin2hex(__data2sha1(
                         __str2bin(_data),
                         _data.length*__chrsz));
    };
    /**
     * SHA1编码数据输出Base64串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出Base64编码串
     *   // QL0AFWMIX8NRZTKeof9cXsvbvu8=
     *   _p._$sha12b64('123');
     * ```
     * @api    {nej.u._$sha12b64}
     * @param  {Variable} 数据
     * @return {String}   Base64编码串
     */
    p._$sha12b64 = function(_data) {
        return __bin2b64(__data2sha1(
                         __str2bin(_data),
                         _data.length*__chrsz));
    };
    /**
     * SHA1编码数据输出字符串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出字符串
     *   // @½c_ÃQe2¡ÿ\^ËÛ¾ï
     *   _p._$sha12str('123');
     * ```
     * @api    {nej.u._$sha12str}
     * @param  {Variable} 数据
     * @return {String}   字符串
     */
    p._$sha12str = function(_data) {
        return __bin2str(__data2sha1(
                         __str2bin(_data),
                         _data.length*__chrsz));
    };
    /**
     * MD5编码数据输出十六进制串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出十六进制串
     *   // 202cb962ac59075b964b07152d234b70
     *   _p._$md52hex('123');
     * ```
     * @api    {nej.u._$md52hex}
     * @param  {String} 数据
     * @return {String} 十六进制串
     */
    p._$md52hex = function(_data){
        return __bin2hex(__data2md5(
                         __str2bin(_data,!0),
                         _data.length*__chrsz),!0);
    };
    /**
     * MD5编码数据输出Base64串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出Base64串
     *   // ICy5YqxZB1uWSwcVLSNLcA==
     *   _p._$md52b64('123');
     * ```
     * @api    {nej.u._$md52b64}
     * @param  {String} 数据
     * @return {String} Base64串
     */
    p._$md52b64 = function(_data){
        return __bin2b64(__data2md5(
                         __str2bin(_data,!0),
                         _data.length*__chrsz),!0);
    };
    /**
     * MD5编码数据输出字符串<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据123，输出字符串
     *   //  ,¹b¬Y[K-#Kp
     *   _p._$md52str('123');
     * ```
     * @api    {nej.u._$md52str}
     * @param  {String} 数据
     * @return {String} 字符串
     */
    p._$md52str = function(_data){
        return __bin2str(__data2md5(
                         __str2bin(_data,!0),
                         _data.length*__chrsz),!0);
    };
    /**
     * 字符串转十六进制,低位补零<br />
     * 脚本举例
     * ```javascript
     *   var _p = NEJ.P('nej.u');
     *   // 输入数据0，输出十六进制串
     *   // 30000000
     *   _p._$str2hex('0');
     * ```
     * @api    {nej.u._$str2hex}
     * @param  {String} 字符串
     * @return {String} 十六进制串
     */
    p._$str2hex = function(_data){
        return __bin2hex(__str2bin(_data,!0),!0);
    };

    NEJ.copy(NEJ.P('nej.u'),_p);
});