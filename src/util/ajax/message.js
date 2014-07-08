/*
 * ------------------------------------------
 * 跨文档消息交互API实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _h = _('nej.h'),
        _e = _('nej.e'),
        _j = _('nej.j');
    /**
     * 发送跨文档的消息
     * [code type="html"]
     *   <!-- 注意需要通过source进行双向交互的frame节点必须设置name/id属性作为标识 -->
     *   <iframe name="targetFrame" src="http://a.b.com/a.html"></iframe>
     * [/code]
     * [code]
     *   // top页面代码
     *   // 发送消息至 http://c.d.com 的页面
     *   nej.j._$postMessage('targetFrame',{
     *       data:'hello c.d.com',
     *       origin:'http://c.d.com'
     *   });
     *   
     *   // http://a.b.com/a.html页面代码
     *   // 添加消息监测事件
     *   nej.v._$addEvent(window,'message',
     *       function(_event){
     *           // 因为top页面发送消息到 http://c.d.com
     *           // 所以在http://a.b.com页面不会收到任何消息
     *       });
     * [/code]
     * [code]
     *   // top页面代码
     *   // 发送消息至 http://a.b.com 的页面
     *   nej.j._$postMessage('targetFrame',{
     *       data:'hello a.b.com'
     *   });
     *   
     *   // http://a.b.com/a.html页面代码
     *   // 添加消息监测事件
     *   nej.v._$addEvent(window,'message',
     *       function(_event){
     *           // 必须先验证消息来源_event.origin是否你允许的域
     *            if (!_isAllow(_event.origin))
     *               return;
     *               
     *           // 处理_event.data中的消息内容
     *           // TODO something
     *           
     *           // 回复消息，使用_event.source
     *           nej.j._$postMessage(_event.source,{
     *               data:'hello!',
     *               origin:_event.origin
     *           });
     *       });
     * [/code]
     * @api    {nej.j._$postMessage}
     * @param  {String|Window}   window对象或者Frame的name，或者字符串如_top、_parent、_self
     * @param  {Object}          消息配置
     * @config {Variable} data   消息内容
     * @config {String}   origin 目标Origin，只有指定的页面可以收到消息，如http://a.b.com
     * @config {String}   source 当前窗体标识，除非你非常确定当前窗体的标识是什么，否则请采用自动识别
     * @return {nej.j}
     */
    _j._$postMessage = (function(){
        var _self = window.name||'_parent',
            _wmap = {
                '_top' : window.top,
                '_self' : window,
                '_parent': window.parent
            };
        return function(_target,_options){
            if (typeof(_target)=='string'){
                _target = _wmap[_target]||
                          window.frames[_target]||
                         (_e._$get(_target)||_o).contentWindow;
                if (!_target) return this;
            }
            // check data
            var _data = NEJ.X({
                    origin:'*',
                    source:_self
                },_options);
            // send message
            _h.__postMessage(_target,_data);
            return this;
        };
    })();
};
NEJ.define(
    '{lib}util/ajax/message.js',[
    '{lib}base/element.js',
    '{platform}message.js'
],f);
