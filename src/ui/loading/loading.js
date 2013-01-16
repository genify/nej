/*
 * ------------------------------------------
 * 加载中控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ui'),
        __proLoading;
    if (!!p._$$Loading) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     @$<keyframes> #<uispace>-animate{\
                          0%{$<transform>:$<rotate|a=0deg>;}\
                          8.32%{$<transform>:$<rotate|a=0deg>;}\
                          8.33%{$<transform>:$<rotate|a=30deg>;}\
                          16.65%{$<transform>:$<rotate|a=30deg>;}\
                          16.66%{$<transform>:$<rotate|a=60deg>;}\
                          24.99%{$<transform>:$<rotate|a=60deg>;}\
                          25%{$<transform>:$<rotate|a=90deg>;}\
                          33.32%{$<transform>:$<rotate|a=90deg>;}\
                          33.33%{$<transform>:$<rotate|a=120deg>;}\
                          41.65%{$<transform>:$<rotate|a=120deg>;}\
                          41.66%{$<transform>:$<rotate|a=150deg>;}\
                          49.99%{$<transform>:$<rotate|a=150deg>;}\
                          50%{$<transform>:$<rotate|a=180deg>;}\
                          58.32%{$<transform>:$<rotate|a=180deg>;}\
                          58.33%{$<transform>:$<rotate|a=180deg>;}\
                          66.65%{$<transform>:$<rotate|a=180deg>;}\
                          66.66%{$<transform>:$<rotate|a=240deg>;}\
                          74.99%{$<transform>:$<rotate|a=240deg>;}\
                          75%{$<transform>:$<rotate|a=270deg>;}\
                          83.32%{$<transform>:$<rotate|a=270deg>;}\
                          83.33%{$<transform>:$<rotate|a=300deg>;}\
                          91.65%{$<transform>:$<rotate|a=300deg>;}\
                          91.66%{$<transform>:$<rotate|a=330deg>;}\
                          100%{$<transform>:$<rotate|a=330deg>;}\
                     }\
                     .#<uispace>{position:relative;height:1em;width:1em;font-size:250%;$<transform>-origin:0.5em 0.5em;$<animation>-name:#<uispace>-animate;$<animation>-duration:1.5s;$<animation>-iteration-count:infinite;$<animation>-timing-function:linear;}\
                     .#<uispace> > span,.#<uispace> > span:before,.#<uispace> > span:after{display:block;position:absolute;top:0;width:0.1em;height:0.25em;content:" ";$<border-radius>:0.05em;border-radius:0.05em;$<transform>-origin:0.05em 0.5em;}\
                     .#<uispace> > span{left:50%;margin-left:-0.05em;}\
                     .#<uispace> > span::before{$<transform>:$<rotate|a=30deg>;}\
                     .#<uispace> > span::after{$<transform>:$<rotate|a=-30deg>;}\
                     .#<uispace> > span.z-top{background-color:rgba(170,170,170,0.99);$<transform>:$<rotate|a=0deg>;}\
                     .#<uispace> > span.z-top::before{background-color:rgba(170,170,170,0.15);}\
                     .#<uispace> > span.z-top::after{background-color:rgba(170,170,170,0.9);}\
                     .#<uispace> > span.z-left{background-color:rgba(170,170,170, 0.7);$<transform>:$<rotate|a=270deg>;}\
                     .#<uispace> > span.z-left::before{background-color:rgba(170,170,170,0.8);}\
                     .#<uispace> > span.z-left::after{background-color:rgba(170,170,170,0.6);}\
                     .#<uispace> > span.z-bottom{background-color:rgba(170,170,170,0.4);$<transform>:$<rotate|a=180deg>;}\
                     .#<uispace> > span.z-bottom::before{background-color:rgba(170,170,170,0.5);}\
                     .#<uispace> > span.z-bottom::after{background-color:rgba(170,170,170,0.35);}\
                     .#<uispace> > span.z-right{background-color:rgba(170,170,170,0.25);$<transform>:$<rotate|a=90deg>;}\
                     .#<uispace> > span.z-right::before{background-color:rgba(170,170,170,0.3);}\
                     .#<uispace> > span.z-right::after{background-color:rgba(170,170,170,0.2);}');
    // ui html code
    var _seed_html = e._$addNodeTemplate('\
                     <div class="'+_seed_css+'">\
                       <span class="z-top">&nbsp;</span>\
                       <span class="z-right">&nbsp;</span>\
                       <span class="z-bottom">&nbsp;</span>\
                       <span class="z-left">&nbsp;</span>\
                     </div>');
    /**
     * 加载中控件
     * @class   {nej.ui._$$Loading} 加载中控件
     * @extends {nej.ui._$$Abstract}
     * @param  {Object} 可选配置参数，已处理参数列表如下：
     */
    p._$$Loading = NEJ.C();
    __proLoading = p._$$Loading._$extend(p._$$Abstract);
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proLoading.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html= _seed_html;
    };
};
define('{lib}ui/loading/loading.js',['{lib}ui/base.js'],f);