/*
 * ------------------------------------------
 * 文件选择接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _o = NEJ.O,
        _f = NEJ.F,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _x = _('nej.x'),
        _cache = {},  // {id:{lab:'label',pid:'parent'}}
        _class = _e._$pushCSSText('.#<class>{position:absolute;top:0;left:0;width:0;height:0;overflow:hidden;}');
    /**
     * 文件选择按钮封装
     * 
     * 结构举例
     * [code type="html"]
     *   <p><label id="abc">选择文件</label></p>
     * [/code]
     * 
     * 脚本举例
     * [code]
     *   // 统一定义名字空间简写
     *   var _  = NEJ.P,
     *       _e = _('nej.e');
     *   // 绑定文件选择按钮
     *   _e._$file('abc',{
     *       multiple:true,
     *       onchange:function(_event){
     *           // _event.form
     *           // _event.id
     *           // 如果要删除某个文件选择节点必须使用以下接口
     *           _e._$remove(_event.id);
     *       }
     *   });
     * [/code]
     * 
     * @api    {nej.e._$file}
     * @param  {String|Node} 绑定选择文件的节点，必须为label节点，且未设置for属性
     * @param  {Object}      配置参数
     * @config {String|Node} form     文件选择控件所在的表单，默认全新生成一个
     * @config {String}      name     单个文件选择支持指定提交时文件名称
     * @config {String}      clazz    表单样式名称，可用于控制表单位置
     * @config {Boolean}     multiple 是否允许多选，默认单选
     * @config {String}      accept   文件类型过滤，如image/*或者.png，多个类型用逗号分隔
     * @config {Object}      param    参数集合，以input.hidden的形式放置在form中提交
     * @config {Function}    onchange 文件选择变化触发回调，{form:form,id:'xxx'}
     *                                - form 文件选择控件封装表单对象
     *                                - id   当前变化的文件选择控件的ID
     */
    _e._$file = 
    _x._$file = (function(){
        // init cache
        var _doInitCache = function(_id){
            var _cch = _cache[_id];
            if (!_cch){
                _cch = {};
                _cache[_id] = _cch;
            }
            return _cch;
        };
        // init param
        var _doInitParam = function(_form,_param){
            if (!_param) return;
            var _arr = [];
            _u._$forIn(_param,function(_value,_key){
                _arr.push('<input type="hidden" name="'+_key+'" value="'+_value+'">');
            });
            _form.insertAdjacentHTML('afterBegin',_arr.join(''));
        };
        // build parent
        var _doBuildParent = function(_id,_form,_clazz,_param){
            var _parent,
                _cch = _cache[_id],
                _cls = _class+' '+(_clazz||'');
            _form = _e._$get(_form);
            if (!!_form){
                _parent = _e._$create('div',_cls);
                _form.appendChild(_parent);
                _e._$dataset(_form,'id',_id);
                _doInitParam(_form,_param);
            }else{
                _parent = _e._$create('form',_cls);
                _e._$dataset(_parent,'id',_id);
                _doInitParam(_parent,_param);
                document.body.appendChild(_parent);
            }
            _cch.pid = _e._$id(_parent);
        };
        var _doAppendFile = function(_id,_cch){
            var _accept = _cch.accept||'';
            if (!!_accept){
                _accept = 'accept="'+_accept+'"';
            }
            var _multiple = '';
            if (!!_cch.multiple){
                _multiple = 'multiple="true"';
            }
            var _cch = _cache[_id],
                _fid = _id+"-"+_cch.nmb,
                _file = _e._$html2node('<input type="file" '+_multiple+' '+_accept+' contenteditable="false" id="'+_fid+'"/>');
            _cch.nmb++;
            _e._$get(_cch.pid).appendChild(_file);
            _v._$addEvent(_file,'change',_onFileChange);
            return _fid;
        };
        // file select
        var _onFileChange = function(_event){
            var _element = _v._$getElement(_event),
                _id = _element.id,
                _arr = _id.split('-'),
                _cch = _cache[_arr[0]];
            if (!_element.value) return;
            if (_cch.multiple){
                _e._$get(_cch.lab).htmlFor = 
                    _doAppendFile(_arr[0],_cch);
            }else if(!!_cch.name){
                _element.name = _cch.name;
            }
            _cch.onchange({
                id:_id,
                form:_element.form,
                target:_e._$get(_cch.lab)
            });
        };
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!_element||
                 _element.tagName!='LABEL') return;
            _e._$dumpCSSText();
            var _id = _u._$uniqueID(),
                _cch = _doInitCache(_id);
            _options = _options||_o;
            _doBuildParent(
                _id,
                _options.form,
                _options.clazz,
                _options.param
            );
            _cch.nmb = 0;
            _cch.name = _options.name;
            _cch.lab = _e._$id(_element);
            _cch.accept = _options.accept||'';
            _cch.multiple = !!_options.multiple;
            _cch.onchange = _options.onchange||_f;
            _element.htmlFor = 
                _doAppendFile(_id,_cch);
            _e.__handleFileLabelClick(_element);
            return _id;
        };
    })();
    /**
     * 根据ID取选中文件的form表单
     * @api    {nej.e._$getFileForm}
     * @see    {nej.e._$file}
     * @param  {String} 标识
     * @return {Node}   表单节点
     */
    _e._$getFileForm = 
    _x._$getFileForm = function(_id){
        var _conf = _cache[_id];
        if (!_conf) return;
        var _form = _e._$get(_conf.pid);
        if (!_form) return;
        if (_form.tagName!='FORM'){
            _form = _form.parentNode;
        }
        return _form;
    };
    /**
     * 根据ID删除选中文件的form表单
     * @api    {nej.e._$removeFileForm}
     * @see    {nej.e._$file}
     * @param  {String} 标识
     * @return {Void}
     */
    _e._$removeFileForm = 
    _x._$removeFileForm = function(_id){
        var _conf = _cache[_id];
        if (!!_conf){
            _e._$remove(_conf.pid);
            delete _cache[_id];
        }
    };
    _x.isChange = !0;
};
NEJ.define(
    '{lib}util/file/select.js',[
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{platform}select.js'
],f);
