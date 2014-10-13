/*
 * ------------------------------------------
 * 颜色辅助方法实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/color/color */
NEJ.define([
    'base/global',
    'base/util'
],function(NEJ,_u,_p,_o,_f,_r){
    /**
     * 判断色值是否合法
     *
     * @method module:util/color/color._$isColor
     * @param  {String} arg0 - 颜色值
     * @return {Boolean}       是否合法
     */
    _p._$isColor = (function(){
        var _reg = /^#(?:[0-9a-f]{3}){1,2}$/i;
        return function(_color){
            return _reg.test(_color);
        };
    })();
    /**
     * 判断是否完整格式的颜色值，如#ffffff
     *
     * @method module:util/color/color._$isFullColor
     * @param  {String} arg0 - 颜色值
     * @return {Boolean}       是否完整格式
     */
    _p._$isFullColor = (function(){
        var _reg = /^#[0-9a-f]{6}$/i;
        return function(_color){
            return _reg.test(_color);
        };
    })();
    /**
     * 提取色值的RGB信息
     *
     * @method module:util/color/color._$color2rgb
     * @param  {String} arg0 - 颜色值，#ffffff或者#fff
     * @return {Object}        RGB信息，{r:23,g:25,b:67}
     */
    _p._$color2rgb = (function(){
        var _doExpand = function(_value,_index,_list){
            _list[_index] += _value;
        };
        return function(_color){
            if (!_p._$isColor(_color))
                return null;
            _color = _color.substr(1);
            // #fff -> #ffffff
            if (_color.length==3){
                var _arr = _color.split('');
                _u._$forEach(_arr,_doExpand);
                _color = _arr.join('');
            }
            return {
                r:parseInt(_color.substr(0,2),16),
                g:parseInt(_color.substr(2,2),16),
                b:parseInt(_color.substr(4,2),16)
            };
        };
    })();
    /**
     * RGB色值转颜色字符串
     *
     * @method module:util/color/color._$rgb2color
     * @param  {Object} arg0 - RGB信息，如{r:23,g:24,b:35}
     * @return {String}        颜色字符串，如#fdcdfc
     */
    _p._$rgb2color = function(_rgb){
        return _p._$hsl2color(_p._$rgb2hsl(_rgb));
    };
    /**
     * RGB色值转HLS色值
     *
     * @method module:util/color/color._$rgb2hsl
     * @param  {Object} arg0 - RGB信息，如{r:23,g:24,b:35}
     * @return {Object}        HSL信息，如{h:0.7,l:0.6,s:0.9}
     */
    _p._$rgb2hsl = function(_rgb){
        var _red   = _rgb.r/255,
            _green = _rgb.g/255,
            _blue  = _rgb.b/255,
            _min = Math.min(_red,_green,_blue),
            _max = Math.max(_red,_green,_blue),
            _delta = _max-_min,
            _total = _max+_min,
            _lightness = _total/2;
        if (!_delta){
            return {
                h:0,s:0,
                l:_lightness
            };
        }
        var _saturation = _lightness<0.5
                        ? _delta/_total
                        : _delta/(2-_total),
            _deltar = (((_max-_red)/6)+(_delta/2))/_delta,
            _deltag = (((_max-_green)/6)+(_delta/2))/_delta,
            _deltab = (((_max-_blue)/6)+(_delta/2))/_delta;
        var _hue;
        if (_red==_max){
            _hue = _deltab-_deltag;
        }else if(_green==_max){
            _hue = (1/3)+_deltar-_deltab;
        }else{
            _hue = (2/3)+_deltag-_deltar;
        }
        _hue += _hue<0?1:(_hue>1?-1:0);
        console.log(_hue+':'+_lightness+':'+_saturation);
        return {
            h:_hue,
            l:_lightness,
            s:_saturation
        };
    };
    /**
     * HSL色值转颜色字符串
     *
     * @method module:util/color/color._$hsl2color
     * @param  {Object} arg0 - HSL信息，{h:0.7,l:0.6,s:0.9}
     * @return {String}        颜色字符串，如#dddfdc
     */
    _p._$hsl2color = (function(){
        var _dec2hex = function(_dec){
            var _value = parseInt(_dec);
            if (isNaN(_value))
                return '00';
            var _hex = _value.toString(16),
                _pfx = _hex.length<2?'0':'';
            return (_pfx+_hex).toLowerCase();
        };
        var _hue2rgb = function(_v1,_v2,_hue){
            _hue += _hue<0?1:(_hue>1?-1:0);
            if ((6*_hue)<1)
                return _v1+(_v2-_v1)*6*_hue;
            if ((2*_hue)<1)
                return _v2;
            if ((3*_hue)<2)
                return _v1+(_v2-_v1)*((2/3)-_hue)*6;
            return _v1;
        };
        return function(_hsl){
            var _red,_green,_blue;
            if (!_hsl.s){
                _red =
                _blue =
                _green = _hsl.l*255;
            }else{
                var _v2 = (_hsl.l<0.5)
                        ? (_hsl.l*(1+_hsl.s))
                        : ((_hsl.l+_hsl.s)-(_hsl.s*_hsl.l)),
                    _v1 = 2*_hsl.l-_v2;
                _red = 255*_hue2rgb(_v1,_v2,_hsl.h+(1/3));
                _blue = 255*_hue2rgb(_v1,_v2,_hsl.h-(1/3));
                _green = 255*_hue2rgb(_v1,_v2,_hsl.h);
            }
            return '#'+_dec2hex(_red)
                      +_dec2hex(_green)
                      +_dec2hex(_blue);
        };
    })();
    /**
     * RGB颜色串转HSL色值
     *
     * @method module:util/color/color._$color2hsl
     * @param  {String} arg0 - 颜色串
     * @return {Object}        HSL信息，如{h:0.7,l:0.6,s:0.9}
     */
    _p._$color2hsl = function(_color){
        return _p._$rgb2hsl(_p._$color2rgb(_color));
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ut.c'),_p);
    }

    return _p;
});