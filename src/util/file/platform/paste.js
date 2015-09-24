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
    'base/element'
],function(u,v,e,p){

    //function dataURItoBlob(dataURI, callback) {
    //    // convert base64 to raw binary data held in a string
    //    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    //    var byteString = atob(dataURI.split(',')[1]);
    //
    //    // separate out the mime component
    //    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    //
    //    // write the bytes of the string to an ArrayBuffer
    //    var ab = new ArrayBuffer(byteString.length);
    //    var ia = new Uint8Array(ab);
    //    for (var i = 0; i < byteString.length; i++) {
    //        ia[i] = byteString.charCodeAt(i);
    //    }
    //
    //    // write the ArrayBuffer to a blob, and you're done
    //    var bb = new BlobBuilder();
    //    bb.append(ab);
    //    return bb.getBlob(mimeString);
    //}
    /**
     * 导出文件信息
     * @param file
     * @param ret
     * @param callback
     * @private
     */
    p.__doDumpFile = function(file,config){
        var event = {
            type:'file',
            content:file,
            url:URL.createObjectURL(file)
        };
        if (!!config.dataurl){
            var reader = new FileReader();
            reader.onload = function(ev){
                event.dataurl = ev.target.result;
                config.onpaste(event);
            };
            reader.readAsDataURL(file);
        }else{
            config.onpaste(event);
        }
    };
    /**
     * 导出图片信息
     * @private
     */
    p.__doDumpImage = (function(){
        var div = e._$create('div');
        div.contentEditable = true;
        e._$style(div,{
            position:'absolute',
            top:0,
            left:'300px',
            width:'200px',
            height:'200px',
            border:'1px solid #aaa'
        });
        document.body.appendChild(div);
        return function(config){
            div.focus();
            window.setTimeout(function(){
                var img = div.getElementsByTagName('img')[0];
                if (!!img){
                    config.onpaste({
                        type:'file',
                        url:img.src,
                        content:img.src,
                        dataurl:img.src
                    });
                }
            },15);
        };
    })();
    /**
     * 导出内容信息
     * @param event
     * @private
     */
    p.__doDumpContent = (function(){
        var pmap = {
            string:function(it,ret){
                it.getAsString(function(content){
                    ret.onpaste({
                        type:'string',
                        content:content||''
                    });
                });
            },
            file:function(it,ret){
                p.__doDumpFile(it.getAsFile(),ret);
            }
        };
        return function(ret,event){
            var accept = ret.accept||'',
                board = event.clipboardData||{};
            u._$forEach(board.items,function(it){
                if (!accept||it.type.indexOf(accept)==0){
                    v._$stop(event);
                    var func = pmap[it.kind];
                    if (u._$isFunction(func)){
                        func(it,ret);
                    }
                    return !0;
                }
            });
        };
    })();

    return p;
});