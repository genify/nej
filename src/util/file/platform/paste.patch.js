/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
NEJ.define([
    'base/util',
    'base/event',
	'./paste.js'
],function(u,v,h){
    // for gecko
    NEJ.patch('GR',function(){
        /**
         * 导出拷贝信息
         * @param event
         * @private
         */
        h.__doDumpContent = function(ret,event){
            var accept = ret.accept||'',
                board = event.clipboardData||{},
                type = (board.types||[])[0]||'';
            // check string type
            if (!accept||type.indexOf(accept)==0){
                v._$stop(event);
                if (type.indexOf('text')==0){
                    ret.onpaste({
                        type:'string',
                        content:board.getData('text')
                    });
                    return;
                }
            }
            // check image data
            h.__doDumpImage(ret);
            // check file type
            u._$forEach(board.files,function(it){
                if (!accept||it.type.indexOf(accept)==0){
                    v._$stop(event);
                    h.__doDumpFile(it,ret);
                    return !0;
                }
            });
        };
    });
    // for trident
    NEJ.patch('TR',function(){
        /**
         * 导出拷贝信息
         * @param event
         * @private
         */
        h.__doDumpContent = function(ret,event){
            console.log(event)
        };
    });
	return h;
});
