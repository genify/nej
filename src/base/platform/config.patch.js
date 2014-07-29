/*
 * ------------------------------------------
 * 平台适配接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    './config.js',
    '{lib}base/platform.js'
],function(_c,_m,_p,_o,_f,_r){
    // for ie
    NEJ.patch('TR',function(){
        _c.__set(
            'storage.swf',
            (this.NEJ_CONF||_o).storage||
            (_c._$get('root')+'nej_storage.swf')
        );
    });
    // for ie7- data uri not available
    NEJ.patch('TR<=3.0',function(){
        _c.__set(
            'blank.png',
            (this.NEJ_CONF||_o).blank||
            (_c._$get('root')+'nej_blank.gif')
        );
    });

    return _c;
});
