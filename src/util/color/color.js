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
    _p._$rgb2color = (function(){
        var char = '0123456789abcdef';
        function toHex(n) {
            n = parseInt(n,10);
            if (isNaN(n)) return '00';
            n = Math.max(0,Math.min(n,255));
            return char.charAt((n-n%16)/16)+char.charAt(n%16);
        }
        return function(rgb){
            return '#'+toHex(rgb.r)+toHex(rgb.g)+toHex(rgb.b);
        };
    })();
    /**
     * RGB色值转HLS色值
     *
     * @method module:util/color/color._$rgb2hsl
     * @param  {Object} arg0 - RGB信息，如{r:23,g:24,b:35}
     * @return {Object}        HSL信息，如{h:0.7,l:0.6,s:0.9}
     */
    _p._$rgb2hsl = function(rgb){
        var r = rgb.r,
            g = rgb.g,
            b = rgb.b;
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h,s,
            d = max-min,
            l = (max+min)/2;
        if(d==0){
            // achromatic
            h = s = 0;
        }else{
            var d = max-min;
            s = l>0.5 ? d/(2-max-min) : d/(max+min);
            switch(max){
                case r: h = (g-b)/d+(g<b?6:0); break;
                case g: h = (b-r)/d+2; break;
                case b: h = (r-g)/d+4; break;
            }
            h /= 6;
        }
        return { h:h,s:s,l:l };
    };
    /**
     * HSL色值转RGB色值
     *
     * @param  {Object} arg0 - HSL信息，{h:0.7,l:0.6,s:0.9}
     * @return {Object}        RGB信息，如{r:23,g:24,b:35}
     */
    _p._$hsl2rgb = (function(){
        var hue2rgb = function(p, q, t){
            if(t<0) t += 1;
            if(t>1) t -= 1;
            if(t<1/6) return p+(q-p)*6*t;
            if(t<1/2) return q;
            if(t<2/3) return p+(q-p)*(2/3-t)*6;
            return p;
        };
        return function(hsl){
            var red, green, blue;
            if(hsl.s==0){
                // achromatic
                red = green = blue = hsl.l;
            }else{
                var l = hsl.l,
                    s = hsl.s,
                    h = hsl.h;
                var q = l<0.5?(l*(1+s)):(l+s-l*s),
                    p = 2*l-q;
                red = hue2rgb(p, q, h + 1/3);
                green = hue2rgb(p, q, h);
                blue = hue2rgb(p, q, h - 1/3);
            }
            return {
                r:Math.round(red*255),
                g:Math.round(green*255),
                b:Math.round(blue*255)
            };
        };
    })();
    /**
     * HSL色值转颜色字符串
     *
     * @method module:util/color/color._$hsl2color
     * @param  {Object} arg0 - HSL信息，{h:0.7,l:0.6,s:0.9}
     * @return {String}        颜色字符串，如#dddfdc
     */
    _p._$hsl2color = function(hsl){
        return _p._$rgb2color(_p._$hsl2rgb(hsl));
    };
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