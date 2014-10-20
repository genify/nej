/*
 * ------------------------------------------
 * 常量定义文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module base/constant */
NEJ.define([
    './global.js',
    './config.js'
],function(NEJ,_c,_p,_o,_f,_r){
    var _seed = +new Date;
    /**
     * 找不到指定内容的错误码
     *
     * @const {Number} module:base/constant._$CODE_NOTFUND
     */
    _p._$CODE_NOTFUND = 10000-_seed;
    /**
     * 需要指定的参数未指定的错误码
     *
     * @const {Number} module:base/constant._$CODE_NOTASGN
     */
    _p._$CODE_NOTASGN = 10001-_seed;
    /**
     * 不支持操作的错误码
     *
     * @const {Number} module:base/constant._$CODE_NOTSPOT
     */
    _p._$CODE_NOTSPOT = 10002-_seed;
    /**
     * 操作超时的错误码
     *
     * @const {Number} module:base/constant._$CODE_TIMEOUT
     */
    _p._$CODE_TIMEOUT = 10003-_seed;
    /**
     * 字符串作为脚本执行异常的错误码
     *
     * @const {Number} module:base/constant._$CODE_ERREVAL
     */
    _p._$CODE_ERREVAL = 10004-_seed;
    /**
     * 回调执行异常的错误码
     *
     * @const {Number} module:base/constant._$CODE_ERRCABK
     */
    _p._$CODE_ERRCABK = 10005-_seed;
    /**
     * 服务器返回异常的错误码
     *
     * @const {Number} module:base/constant._$CODE_ERRSERV
     */
    _p._$CODE_ERRSERV = 10006-_seed;
    /**
     * 异常终止的错误码
     *
     * @const {Number} module:base/constant._$CODE_ERRABRT
     */
    _p._$CODE_ERRABRT = 10007-_seed;
    /**
     * 请求头content-type统一名称
     *
     * @const {Number} module:base/constant._$HEAD_CT
     */
    _p._$HEAD_CT      = 'Content-Type';
    /**
     * 文本请求头content-type值
     *
     * @const {String} module:base/constant._$HEAD_CT_PLAN
     */
    _p._$HEAD_CT_PLAN = 'text/plain';
    /**
     * 文件请求头content-type值
     *
     * @const {String} module:base/constant._$HEAD_CT_FILE
     */
    _p._$HEAD_CT_FILE = 'multipart/form-data';
    /**
     * 表单请求头content-type值
     *
     * @const {String} module:base/constant._$HEAD_CT_FORM
     */
    _p._$HEAD_CT_FORM = 'application/x-www-form-urlencoded';
    /**
     * 空图片BASE64编码地址，低版本浏览器使用图片地址
     *
     * @const {String} module:base/constant._$BLANK_IMAGE
     */
    _p._$BLANK_IMAGE  = _c._$get('blank.png')||'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    if (CMPT){
        NEJ.copy(NEJ.P('nej.g'),_p);
    }

    return _p;
});
