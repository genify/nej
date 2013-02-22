/*
 * ------------------------------------------
 * 水平模块播放器实现文件
 * @version  1.0
 * @author   huxueliang(huxueliang@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var p = NEJ.P('nej.ui'),
        __proCarouselX,
        __supCarouselX;
    if (!!p._$$CarouselX) return;
    /**
     * 卡片水平播放器对象
     * @class   {nej.ui._$$CarouselX} 卡片水平播放器控件
     * @extends {nej.ui._$$Carousel}
     */
    p._$$CarouselX = NEJ.C();
    __proCarouselX = p._$$CarouselX._$extend(p._$$Carousel);    
    __supCarouselX = p._$$CarouselX._$supro;
    /**
     * 获得配置参数
     * @protected
     * @method {__getConfig}
     * @return {Object}    配置参数对象
     */
    __proCarouselX.__getConfig = function(){
        return {
            m:'moveX',
            p:'m41',
            l:'width',
            o:'offsetWidth',
            v:!1
        };
    };
};
NEJ.define('{lib}ui/carousel/carousel.x.js',
      ['{lib}ui/carousel/carousel.js'],f);