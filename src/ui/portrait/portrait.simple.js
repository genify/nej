/*
 * ------------------------------------------
 * 简易表情控件封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var _  = NEJ.P,
        _c = _('nej.c'),
        _e = _('nej.e'),
        _u = _('nej.u'),
        _t = _('nej.ut'),
        _p = _('nej.ui'),
        _pro,
        _seed_css,
        _seed_html,
        _seed_ilist;
    if (!!_p._$$SimplePortrait) return;
    /**
     * 简易表情控件
     * 
     * @class   {nej.ui._$$SimplePortrait}
     * @extends {nej.ut._$$Event}
     * @uses    {nej.ut._$$Portrait}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     * 
     * [hr]
     * 表情选中事件
     * @event   {onselect}
     * @param   {Object} 表情数据对象
     * @config  {String} text  表情描述
     * @config  {String} url   表情文件地址
     * 
     */
    _p._$$SimplePortrait = NEJ.C();
    _pro = _p._$$SimplePortrait._$extend(_p._$$Abstract);
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
            if (!_u._$isString(_ilist[0])) return;
            var _root = _c._$get('root')+'portrait/face/preview/';
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
                limit:60,
                pager:{clazz:'zpager'},
                list:_ilist,
                item:_seed_ilist,
                onselect:this._$dispatchEvent._$bind(this,'onselect')
            };
            this.__supInit();
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
        this.__supReset(_options);
        this.__portrait = _t._$$Portrait._$allocate(this.__popt);
    };
    /**
     * 控件销毁
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__supDestroy();
        if (!!this.__portrait){
            this.__portrait._$recycle();
            delete this.__portrait;
        }
    };
    /**
     * 初始化外观
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__seed_css = _seed_css;
        this.__seed_html = _seed_html;
    };
    /**
     * 初始化控件节点
     * @return {Void}
     */
    _pro.__initNode = function(){
        this.__supInitNode();
        // 0 - item list box
        // 1 - pager box
        var _list = _e._$getByClassName(this.__body,'j-flag');
        this.__popt.lbox = _list[0];
        this.__popt.pager.parent = _list[1];
    };
    // init style and html
    var _arr = [];
    for(var i=0;i<6;i++){
        for(var j=0;j<10;j++){
            _arr.push('.#<uispace> .zlst .zbg'+(i*10+j)+'{background-position:-'+(j*30)+'px -'+(i*30)+'px;}');
        }
    }
    _seed_css = _e._$pushCSSText('\
        .#<uispace>{width:310px;padding:5px;background:#e5e5e1;border:1px solid #888;}\
        .#<uispace> .zlst{position:relative;height:190px;}\
        .#<uispace> .zlst .zitm{display:block;float:left;width:30px;height:30px;line-height:30px;margin:-1px 0 0 -1px;text-indent:200px;overflow:hidden;border:1px solid #e5e5e1;cursor:pointer;}\
        .#<uispace> .zlst .zitm:hover{position:relative;border-color:#000;zoom:1;}\
        .#<uispace> .js-page-1 .zitm{background:url('+_c._$get('root')+'portrait/face/face-0.png) no-repeat;}\
        .#<uispace> .js-page-2 .zitm{background:url('+_c._$get('root')+'portrait/face/face-1.png) no-repeat;}\
        '+_arr.join('')+'\
        .#<uispace> .zpbx{padding:5px 0;text-align:right;}\
        .#<uispace> .zpager .zbtn,.#<uispace> .zpager .zpgi{border:0;margin:0;}\
        .#<uispace> .zpager .zpgi{display:none;}\
        .#<uispace> .zpager .js-disabled{color:#777;}\
        .#<uispace> .js-prev{position:absolute;width:60px;height:60px;background:#fff no-repeat center center;border:1px solid #888;}\
        .#<uispace> .js-prev img{display:none;}\
    ');
    _seed_html = _e._$addNodeTemplate('\
        <div class="'+_seed_css+'">\
          <div class="zlst j-flag"></div>\
          <div class="zpbx j-flag"></div>\
        </div>\
    ');
    _seed_ilist = _e._$addHtmlTemplate('\
        {list beg..end as y}\
          {var x=xlist[y]}\
          <a href="#" hidefocus="true" class="zitm zbg${y%60}" title="${x.text}"\
             data-id="${x.id}" data-align="{if y%10<5}right{else}left{/if} top">${x.text}</a>\
        {/list}\
    ');
};
NEJ.define('{lib}ui/portrait/portrait.simple.js',
          ['{patch}config.js'
          ,'{lib}util/portrait/portrait.js'],f);