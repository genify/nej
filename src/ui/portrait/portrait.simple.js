/*
 * ------------------------------------------
 * 简易表情控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}base/constant.js',
    '{lib}base/element.js',
    '{lib}base/util.js',
    '{lib}ui/base.js',
    '{lib}ui/portrait/portrait.js'
],function(NEJ,_k,_c,_e,_u,_i,_i0,_p,_o,_f,_r){
    // variable declaration
    var _pro,
        _seed_css;
    /**
     * 简易表情控件
     *
     * @class   {nej.ui._$$SimplePortrait}
     * @extends {nej.ui._$$Abstract}
     * @uses    {nej.ui._$$Portrait}
     * @param   {Object} 可选配置参数
     *
     * [hr]
     * 表情选中事件
     * @event   {onselect}
     * @param   {Object} 表情数据对象
     * @config  {String} text  表情描述
     * @config  {String} url   表情文件地址
     *
     */
    _p._$$SimplePortrait = _k._$klass();
    _pro = _p._$$SimplePortrait._$extend(_i._$$Abstract);
    /**
     * 控件初始化
     * @return {Void}
     */
    _pro.__init = (function(){
        var _ilist = [
            '微笑','开怀笑','哭泣','失望','困了','好好笑','啵','电到了','汗','流口水了',
            '真困啊','我吐','眨眼','？？？','嘘','砸死你','不说','坏','色迷迷','教训',
            '可爱','YEAH','崩溃','惊讶','鄙视','开心','仰慕你','晕','挖鼻孔','撒娇',
            '鼓掌','害羞','老大','欠揍','吐舌笑脸','飞吻','工作忙','大哭','偷偷笑','送花给你',
            '来，亲一个','拍桌子','拜拜','得意的笑','生气','怕怕','尴尬','难过','叹气','我是女生',
            '玫瑰','好爱你','心碎了','亲亲','NO','YES','握个手','到点了','音乐','我是男生',
            '带血的刀','炸弹','有了','好晚了','吸血蝙蝠','便便','干一杯','抽烟','打电话','家',
            '车子','礼物','金钱','太阳','下雨','猪猪','小猫','小狗','骨头','喝水',
            '汉堡','包子','西瓜','约会','CALL我'
        ];
        var _doInit = function(){
            if (!!_ilist[0].id) return;
            // push css text
            var _arr = [],
                _prefix = _c._$get('portrait')+'face/face-';
            for(var i=0;i<2;i++){
                _arr.push('.#<uispace> .js-page-'+(i+1)+' .zitm{background-image:url('+_prefix+i+'.png);}');
            }
            _seed_css = _e._$pushCSSText(_arr.join(' '));
            // format data
            var _root = _c._$get('portrait')+'face/preview/';
            _u._$forEach(
                _ilist,function(_text,_index,_list){
                    _list[_index] = {
                        text:_text,
                        id:'sp-'+_index,
                        url:_root+'face'+_index+'.gif'
                    };
                }
            );
        };
        return function(){
            _doInit();
            this.__popt = {
                cache:{
                    list:_ilist,
                    lkey:'portrait',
                    id:'nej-simple-portrait'
                }
            };
            this.__super();
        };
    })();
    /**
     * 控件重置
     * @protected
     * @method {__reset}
     * @param  {Object} 可选配置参数
     * @return {Void}
     */
    _pro.__reset = function(_options){
        this.__super(_options);
        _options.cache = _u._$merge({},this.__popt.cache);
        _options.clazz = _seed_css+' '+(_options.clazz||'');
        this.__portrait = _i0._$$Portrait._$allocate(_options);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        if (!!this.__portrait){
            this.__portrait._$recycle();
            delete this.__portrait;
        }
    };

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});