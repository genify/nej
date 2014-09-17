/*
 * ------------------------------------------
 * 多级级联选择控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/selector/cascade */
NEJ.define([
    'base/klass',
    'base/util',
    'base/event',
    'base/element',
    'util/event'
],function(_k,_u,_v,_e,_t,_p,_o,_f,_r,_pro){
    /**
     * 多级级联选择控件
     * 
     * 结构举例
     * ```html
     * <!-- 这里通过data-value设置默认选中的值 -->
     * <select id="level-1" name="a" data-value="1"></select>
     * <select id="level-2" name="b" data-value="2"></select>
     * <select id="level-3" name="c" data-value="22"></select>
     * ```
     * 
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/selector/cascade'
     * ],function(_t){
     *     var _selector = _t._$$CascadeSelector._$allocate({
     *         select:['level-1','level-2','level-3'],
     *         data:[
     *             {
     *                 id:1,
     *                 name:'l1-1',
     *                 list:[
     *                     {
     *                         id:1,
     *                         name:'l21-1',
     *                         list:[
     *                             {
     *                                 id:11,
     *                                 name:'l31-1'
     *                             },{
     *                                 id:12,
     *                                 name:'l31-2'
     *                             },{
     *                                 id:13,
     *                                 name:'l31-3'
     *                             }
     *                         ]
     *                     },{
     *                         id:2,
     *                         name:'l22-1',
     *                         list:[
     *                             {
     *                                 id:21,
     *                                 name:'l32-1'
     *                             },{
     *                                 id:22,
     *                                 name:'l32-2'
     *                             },{
     *                                 id:23,
     *                                 name:'l32-3'
     *                             }
     *                         ]
     *                     }
     *                 ]
     *             }
     *         ],
     *         onchange:function(_event){
     *             // 这里的a，b，c为select节点上的name
     *             // 如果没有设置name则取id作为标识
     *             log(_event.a+' - '+_event.b+' - '+_event.c);
     *         }
     *     });
     * });
     * ```
     * 
     * @class    module:util/selector/cascade._$$CascadeSelector
     * @extends  module:util/event._$$EventTarget
     * 
     * @param    {Object} config - 可选配置参数
     * @property {Array}  select - 选择节点列表
     * @property {Object} data   - 级联数据信息
     * @property {Object} keys   - 数据标识配置，默认{id:'id',text:'name',list:'list'}
     */
    /** 
     * 选中变化触发事件
     * 
     * @event module:util/selector/cascade._$$CascadeSelector#onchange
     * @param {Object} event - 事件信息，遍历select节点，将name/value组成对象导出
     */
    _p._$$CascadeSelector = _k._$klass();
    _pro = _p._$$CascadeSelector._$extend(_t._$$EventTarget);
    /**
     * 控件重置
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__reset
     * @param  {Object} arg0 - 可选配置参数
     * @return {Void}
     */
    _pro.__reset = (function(){
        var _conf = {
            id:'id',
            text:'name',
            list:'list'
        };
        return function(_options){
            this.__super(_options);
            this.__conf = _u._$merge(
                {},_conf,_options.keys
            );
            this.__nselect = [];
            var _arr = [],
                _default = [];
            _u._$forEach(
                _options.select,function(_id,_index){
                    this.__nselect.push(
                        _e._$get(_id)
                    );
                    _default.push(
                        _e._$dataset(_id,'value')
                    );
                    _arr.push([
                        _id,'change',
                        this.__onChange._$bind(this,_index)
                    ]);
                },this
            );
            this.__doInitDomEvent(_arr);
            this.__doFormatData(_options.data||_r);
            this._$update(_default);
        };
    })();
    /**
     * 控件销毁
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__destroy
     * @return {Void}
     */
    _pro.__destroy = function(){
        this.__super();
        this.__conf = null;
        this.__data = null;
        this.__lock = null;
        this.__default = null;
        this.__nselect = null;
    };
    /**
     * 格式化数据列表
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__doFormatData
     * @param  {Array} arg0 - 数据列表
     * @return {Void}
     */
    _pro.__doFormatData = (function(){
        var _dump = function(_dmap,_list,_level,_id){
            _dmap[_level+'-'+(_id||'')] = _list;
            _u._$forEach(
                _list,function(_item){
                    var _xlst = _item[this.__conf.list];
                    if (!_xlst) return;
                    _dump.call(
                        this,_dmap,_xlst,
                        _level+1,_item[this.__conf.id]
                    );
                },this
            );
        };
        return function(_list){
            this.__data = {};
            _dump.call(this,this.__data,_list,0);
        };
    })();
    /**
     * 清空数据列表
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__doClearList
     * @param  {Node}   arg0 - 选择节点
     * @return {Void}
     */
    _pro.__doClearList = function(_node){
        if (!_node) return;
        _u._$reverseEach(
            _node.options,function(_item,_index){
                _node.remove(_index);
            }
        );
    };
    /**
     * 刷新数据列表
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__doRefreshList
     * @param  {Node}   arg0 - 选择节点
     * @param  {Array}  arg1 - 数据列表
     * @param  {String} arg2 - 默认值
     * @return {Void}
     */
    _pro.__doRefreshList = function(_node,_list,_value){
        if (!_node) return;
        this.__doClearList(_node);
        _u._$forEach(
            _list,function(_item){
                var _option = new Option(
                    _item[this.__conf.text],
                    _item[this.__conf.id]
                );
                _node.add(_option);
                if (!!_value&&_value==_option.value){
                    _option.selected = !0;
                }
            },this
        );
    };
    /**
     * 触发变化事件
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__doEmitChangeEvent
     * @return {Void}
     */
    _pro.__doEmitChangeEvent = function(){
        var _event = {},
            _lock = [];
        _u._$forEach(
            this.__nselect,function(_node){
                _lock.push(_node.value);
                _event[_node.name||_node.id] = _node.value;
            }
        );
        _lock = _lock.join('\n');
        if (_lock!=this.__lock){
            this.__lock = _lock;
            this._$dispatchEvent('onchange',_event);
        }
    };
    /**
     * 选项变化事件
     * 
     * @protected
     * @method module:util/selector/cascade._$$CascadeSelector#__onChange
     * @param  {Event} arg0 - 事件对象
     * @return {Void}
     */
    _pro.__onChange = function(_level){
        // dump next level and list
        var _next = _level+1,_list;
        if (_level<0){
            _list = this.__data['0-'];
        }else{
            var _node = this.__nselect[_level];
            _list = this.__data[_next+'-'+_node.value];
        }
        // check list
        if (!_list||!_list.length){
            // set sub select un-visible
            for(var i=_next,l=this.__nselect.length,_it;i<l;i++){
                _it = this.__nselect[i];
                this.__doClearList(_it);
                _e._$setStyle(_it,'visibility','hidden');
            }
        }else{
            // refresh sub select list
            var _node = this.__nselect[_next];
            if (!!_node){
                _e._$setStyle(_node,'visibility','visible');
                this.__doRefreshList(
                    _node,_list,this.__default[_next]
                );
                this.__default[_next] = null;
                this.__onChange(_next);
            }
        }
        this.__doEmitChangeEvent();
    };
    /**
     * 更新选中值
     *
     * 脚本举例
     * ```javascript
     * _selector._$update([1,2,22]);
     * ```
     * 
     * @method module:util/selector/cascade._$$CascadeSelector#_$update
     * @param  {Array} arg0 - 根据层级依次设置的值
     * @return {Void}
     */
    _pro._$update = function(_value){
        this.__default = _value||[];
        this.__onChange(-1);
    };


    return _p;
});