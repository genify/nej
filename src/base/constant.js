/*
 * ------------------------------------------
 * 常量定义文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _c = _('nej.c'),
        _p = _('nej.g'),
        _seed = +new Date;
    /**
     * 找不到指定内容的错误码<br/>
     * @const {nej.g._$CODE_NOTFUND}
     * @type  {Number}
     */
    _p._$CODE_NOTFUND = 10000-_seed;
    /**
     * 需要指定的参数未指定的错误码<br/>
     * @const {nej.g._$CODE_NOTASGN}
     * @type  {Number}
     */
    _p._$CODE_NOTASGN = 10001-_seed;
    /**
     * 不支持操作的错误码<br/>
     * @const {nej.g._$CODE_NOTSPOT}
     * @type  {Number}
     */
    _p._$CODE_NOTSPOT = 10002-_seed;
    /**
     * 操作超时的错误码<br/>
     * @const {nej.g._$CODE_TIMEOUT}
     * @type  {Number}
     */
    _p._$CODE_TIMEOUT = 10003-_seed;
    /**
     * 字符串作为脚本执行异常的错误码<br/>
     * @const {nej.g._$CODE_ERREVAL}
     * @type  {Number}
     */
    _p._$CODE_ERREVAL = 10004-_seed;
    /**
     * 回调执行异常的错误码<br/>
     * @const {nej.g._$CODE_ERRCABK}
     * @type  {Number}
     */
    _p._$CODE_ERRCABK = 10005-_seed;
    /**
     * 服务器返回异常的错误码<br/>
     * @const {nej.g._$CODE_ERRSERV}
     * @type  {Number}
     */
    _p._$CODE_ERRSERV = 10006-_seed;
    /**
     * 异常终止的错误码<br/>
     * @const {nej.g._$CODE_ERRABRT}
     * @type  {Number}
     */
    _p._$CODE_ERRABRT = 10007-_seed;
    /**
     * 请求头content-type统一名称<br/>
     * @const {nej.g._$HEAD_CT}
     * @type  {Number}
     */
    _p._$HEAD_CT      = 'Content-Type';
    /**
     * 文本请求头content-type值<br/>
     * @const {nej.g._$HEAD_CT_PLAN}
     * @type  {String}
     */
    _p._$HEAD_CT_PLAN = 'text/plain';
    /**
     * 文件请求头content-type值<br/>
     * @const {nej.g._$HEAD_CT_FILE}
     * @type  {String}
     */
    _p._$HEAD_CT_FILE = 'multipart/form-data';
    /**
     * 表单请求头content-type值<br/>
     * @const {nej.g._$HEAD_CT_FORM}
     * @type  {String}
     */
    _p._$HEAD_CT_FORM = 'application/x-www-form-urlencoded';
    /**
     * 空图片BASE64编码地址<br/>
     * @const {nej.g._$BLANK_IMAGE}
     * @type  {String}
     */
    _p._$BLANK_IMAGE  = _c._$get('blank.png')||'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
};
NEJ.define(
    '{lib}base/constant.js',[
    '{lib}base/config.js',
    '{lib}base/global.js'
],f);