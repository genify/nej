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
        _h = _('nej.h'),
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
     *          multiple:true,
     *          onchange:function(_event){
     *              // _event.form
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
     * @config {Boolean}     multiple 是否允许多选，默认单选
     * @config {Function}    onchange 文件选择变化触发回调，{form:form,id:'xxx'}
     *                                - form 文件选择控件封装表单对象
     *                                - id   当前变化的文件选择控件的ID
     */
    _e._$file = (function(){
        var _seed = +new Date,
            _cache = {}; // {id:{lab:'label',pid:'parent'}}
        // init cache
        var _doInitCache = function(_id){
            var _cch = _cache[_id];
            if (!_cch){
                _cch = {};
                _cache[_id] = _cch;
            }
            return _cch;
        };
        // build parent
        var _doBuildParent = function(_id,_form){
            var _parent,
                _cch = _cache[_id];
            _form = _e._$get(_form);
            if (!!_form){
                _parent = _e._$create('div',_class);
                _form.appendChild(_parent);
            }else{
                _parent = _e._$create('form',_class);
                document.body.appendChild(_parent);
            }
            _cch.pid = _e._$id(_parent);
        };
        var _doAppendFile = function(_id){
            var _cch = _cache[_id],
                _fid = _id+"-"+_cch.nmb,
                _file = _e._$html2node('<input type="file" contenteditable="false" id="'+_fid+'"/>');
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
            _cch.onchange({
                id:_id,
                form:_element.form
            })
            if (_cch.multiple)
                _e._$get(_cch.lab)
                  .htmlFor = _doAppendFile(_arr[0]);
        };
        return function(_element,_options){
            _element = _e._$get(_element);
            if (!_element||
               !!_element.htmlFor||
                 _element.tagName!='LABEL') return;
            _e._$dumpCSSText();
            var _id = _seed++,
                _cch = _doInitCache(_id);
            _options = _options||_o;
            _doBuildParent(_id,_options.form);
            _cch.nmb = 0;
            _cch.lab = _e._$id(_element);
            _cch.multiple = !!_options.multiple;
            _cch.onchange = _options.onchange||_f;
            _element.htmlFor = _doAppendFile(_id);
            _h.__handleFileLabelClick(_element);
        };
    })();
};
define('{lib}util/file/select.js',
      ['{lib}base/element.js'
      ,'{lib}base/event.js'],f);