/*
 * ------------------------------------------
 * 输入框计数器接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    '{lib}base/global.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js'
],function(NEJ,_e,_v,_u,_p,_o,_f,_r){
    /**
     * 输入框计数器，使用属性设置输入的总长度限制，
     * 以下两个属性只能同时设置一个，maxlength优先级高于data-max-length
     * [ntb]
     *   属性名                                 | 描述
     *   data-max-length | 输入长度必须小于此设置，一个中文算两个字符，适用于text/textarea
     *   maxlength       | 输入长度必须小于此设置，一个中文算一个字符，适用于text/textarea
     * [/ntb]
     *
     * 结构举例：
     * [code type="html"]
     *   <input type="text" id="input-id-0" maxlength="100"/>
     *   <input type="text" id="input-id-1" data-max-length="100"/>
     *   <textarea id="textarea-id-0" maxlength="100"></textarea>
     *   <textarea id="textarea-id-1" data-max-length="100"></textarea>
     * [/code]
     *
     * 脚本举例：
     * [code]
     *   // 统一定义名字空间所写
     *   var _  = NEJ.P,
     *       _e = _('nej.e');
     *
     *   // 使用属性
     *   _e._$counter('input-id-0',{
     *          onchange:function(_event){
     *              // 自定义提示内容
     *              _event.value = '还可输入'+_event.delta+'字';
     *       }
     *   });
     * [/code]
     *
     * @api    {nej.e._$counter}
     * @param  {String|Node} 输入节点
     * @param  {Object}      配置参数
     * @config {String}   nid      显示提示信息节点标识
     * @config {Number}   max      最大字数限制，优先级大于标签上配置的属性，一个中文算一个字符，默认100个字符
     * @config {String}   clazz    计数器显示样式
     * @config {Function} onchange 字数变化触发回调，{input:'xx',length:2,delta:98}
     * @return {Void}
     */
    _p._$counter = (function(){
        var _reg0 = /[\r\n]/gi,
            _cache = {}; // {id:{max:123,id:'xxx',onchange:function,onlength:function}}
        // calculate string length
        var _doLength = function(_str){
            return (_str||'').replace(_reg0,'aa').length;
        };
        // input change
        var _onChange = function(_id){
            var _conf  = _cache[_id],
                _node1 = _e._$get(_id),
                _node2 = _e._$get(_conf.xid);
            if (!_node1||!_conf) return;
            var _event = {
                input:_node1.value
            };
            _event.length = _conf.onlength(_event.input);
            _event.delta = _conf.max-_event.length;
            _conf.onchange(_event);
            _node2.innerHTML = _event.value||('剩余'+_event.delta+'个字');
        };
        return function(_element,_options){
            var _id = _e._$id(_element);
            if (!_id||!!_cache[_id]) return;
            // check config
            var _conf = _u._$merge({},_options);
            _conf.onchange = _conf.onchange||_f;
            _conf.onlength = _doLength;
            if (!_conf.max){
                var _max1 = parseInt(_e._$attr(_id,'maxlength')),
                    _max2 = parseInt(_e._$dataset(_id,'maxLength'));
                _conf.max = _max1||_max2||100;
                if (!_max1&&!!_max2) _conf.onlength = _u._$length;
            }
            _cache[_id] = _conf;
            // add listener
            _v._$addEvent(_id,'input',_onChange._$bind(null,_id));
            // init left counter show
            var _node = _e._$wrapInline(_id,{
                nid:_conf.nid||'js-counter',
                clazz:_conf.clazz
            });
            _conf.xid = _e._$id(_node);
            _onChange(_id);
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});