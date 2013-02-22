/*
 * ------------------------------------------
 * 卡片垂直播放器实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var p = NEJ.P('nej.ui'),
        __proCarouselY,
        __supCarouselY;
    if (!!p._$$CarouselY) return;
    /**
     * 卡片垂直播放器对象
     * @class   {nej.ui._$$CarouselY} 卡片垂直播放器控件
     * @extends {nej.ui._$$Carousel}
     */
    p._$$CarouselY = NEJ.C();
    __proCarouselY = p._$$CarouselY._$extend(p._$$Carousel);    
    __supCarouselY = p._$$CarouselY._$supro;
    /**
     * 获得配置参数
     * @protected
     * @method {__getConfig}
     * @return {Object}    配置参数对象
     */
    __proCarouselY.__getConfig = function(){
        return {
            m:'moveY',
            p:'m42',
            l:'height',
            o:'offsetHeight',
            v:!0
        };
    };
};
NEJ.define('{lib}ui/carousel/carousel.y.js',
      ['{lib}ui/carousel/carousel.js'],f);