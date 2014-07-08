/**
 * ------------------------------------------
 * 自定义表单逻辑类文件
 * @version  1.0
 * @author   weiwenqing(wqwei@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var r = NEJ.R;
    var _ = NEJ.P;
    var e = _('nej.e');
    var v = _('nej.v');
    var u = _('nej.u');
    var ut = _('nej.ut');
    var p = _('t');
    /**
     * 自定义表单逻辑类
     * @class 表单逻辑类
     * @param {Object} _options 可选配置参数，已处理参数列表如下
     *                          form      [Node|String]     - 表单节点|表单名称，默认为文档的第一个表单
     */
    t._$$CustomForm = NEJ.C();
    __proForm = t._$$CustomForm._$extend(ut._$$WebForm);
    /**
     * 页面初始化函数
     */
    __proForm.__init = function(){
        this.__supInit();
        this.__requires = ['mobile', 'color'];
        this.__name = {
            mobile: '手机',
            color: '颜色'
        }
    },
    /**
     * 控件重置
     * @param  {Object} _options 可选配置参数
     * @return {Void}
     */
    __proForm.__reset = function(_options){
        this.__supReset(_options);
        // this._$focus();
        v._$addEvent(this.__form, 'submit', this.__onSubmit._$bind(this));
    };
    /**
     * 表单提交的响应函数
     * @param {Object} _event    事件对象
     */
    __proForm.__onSubmit = function(_event){
        this.__data = this._$getData();
        if(!this.__checkRequired()||!this.__validate()){
            v._$stopDefault(_event);
            return;
        }
    };
    /**
     * 检查必填项是否填写
     * @return    {Boolean}    是否通过
     */
    __proForm.__checkRequired = function(){
        if (this.__data) {
            for (var i = 0, _name, _value, _requires = this.__requires, _data = this.__data; _name = _requires[i]; i++) {
                _value = _data[_name];
                if(!_value||(u._$isArray(_value)&&!_value.length)){
                    this.__showRequired(_name);
                    return false;
                }
            }
            return true;
        }
    };
    /**
     * 显示必填项为空信息
     * @param {String} _name    表单元素名
     */
    __proForm.__showRequired = function(_name){
        alert(this.__name[_name] + '不能为空！');
    };
    /**
     * 检测输入是否合法
     */
    __proForm.__validate = function(){
        // 检测手机号码
        if (!/1\d{10}/.test(this.__data.mobile)) {
            this.__showError('mobile');
            return false;
        };
        return true;
    },
    /**
     * 显示输入信息不合法信息
     * @param {String} _name    表单元素名
     */
    __proForm.__showError = function(_name){
        alert(this.__name[_name] + '格式错误！');
    }
    /**
     * 控件销毁
     * @return {Void}
     */
    __proForm.__destroy = function(){
        this.__supDestroy();
        delete this.__form;
        delete this.__data;
    };
};
define('{pro}util/form/customform.js',
      ['{lib}util/form/form.js'],f);