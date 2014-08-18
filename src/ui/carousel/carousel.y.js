/*
 * ------------------------------------------
 * 卡片垂直播放器实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}ui/carousel/carousel.js'
],function(NEJ,_k,_i0,_p,_o,_f,_r){
    // variable declaration
    var _pro;
    /**
     * 卡片水平播放器对象
     *
     * @class   module:nej.ui._$$CarouselY 卡片水平播放器控件
     * @extends {nej.ui._$$Carousel}
     */
    _p._$$CarouselY = _k._$klass();
    _pro = _p._$$CarouselY._$extend(_i0._$$Carousel);
    /**
     * 获得配置参数
     * @protected
     * @method {__getConfig}
     * @return {Object}    配置参数对象
     */
    _pro.__getConfig = function(){
        return {
            m:'moveY',
            p:'m42',
            l:'height',
            o:'offsetHeight',
            v:!0
        };
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});

