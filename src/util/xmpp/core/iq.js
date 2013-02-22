/*
 * ------------------------------------------
 * XMPP IQ处理插件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var o = NEJ.O,
        f = NEJ.F,
        e = NEJ.P('nej.e'),
        u = NEJ.P('nej.u'),
        p = NEJ.P('nej.ut.xmpp'),
        __proCORE_IQ,
        __cache = {}; // iq callback cache {id:function}
    if (!!p._$$CORE_IQ) return;
    /**
     * IQ处理插件
     * @class   IQ处理插件
     * @extends {nej.ut._$$PLUGIN}
     * @param  {Object} _options 可选配置参数，已处理的参数列表如下
     * 
     * 
     */
    p._$$CORE_IQ = NEJ.C();
    __proCORE_IQ = p._$$CORE_IQ._$extend(p._$$PLUGIN);
    /**
     * 取控件的名字空间
     * @return {String} 控件名字空间
     */
    p._$$CORE_IQ.__getXmlNS = function(){
        return p.NS.iq;
    };
    /**
     * 发送片段
     * @param  {Object} _data IQ信息
     * @return {Void}
     */
    __proCORE_IQ._$send = function(_data){
        _data = _data||o;
        if (!_data.type){
            this.__proxy._$error({code:-10152,message:'没有指定IQ类型！'});
            return;
        }
        if (!_data.id){
            this.__proxy._$error({code:-10153,message:'没有指定IQ片段ID！'});
            return;
        }
        __cache[_data.id] = _data.onreceive;
        this.__proxy._$sendFragment(
             this.__getFragmentTag({
                  tag:'iq',content:_data.content,
                  attrs:{type:_data.type,id:_data.id}}));
    };
    /**
     * 处理接收到的信息
     * @param  {Node} _root 根节点
     * @return {Void}
     */
    __proCORE_IQ.__onReceive = function(_root){
        var _child = e._$getChildren(_root);
        if (!_child) return;
        // {type:'result',
        //  id:'xxxxx',
        //  children:dom node list}
        var _iq = this.__attr2obj(_root);
        _iq.children = _child;
        // callback by id
        var _callback = __cache[_iq.id];
        if (!!_callback){
            try{_callback(_iq);}catch(ex){}
            // delete __cache[_iq.id];
            return;
        }
        // callback by namespace
        if (_child.length<1) return;
        var _space = _child[0].getAttribute('xmlns')||'';
        if (!!_space) this.__proxy._$dispatchEvent(_space,_iq);
    };
    // do regist plugin
    p._$$CORE_IQ._$regist();
};
NEJ.define('{lib}util/xmpp/core/iq.js',
      ['{lib}util/xmpp/plugin.js'],f);