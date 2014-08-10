/*
 * ------------------------------------------
 * 自定义富媒体编辑器封装实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */

NEJ.define([
    '{lib}base/global.js',
    '{lib}base/klass.js',
    '{lib}ui/editor/editor.js',
    '{lib}util/editor/command/fontsize.js',
    '{lib}util/editor/command/fontname.js',
    '{lib}util/editor/command/bold.js',
    '{lib}util/editor/command/italic.js',
    '{lib}util/editor/command/insertorderedlist.js',
    '{lib}util/editor/command/insertunorderedlist.js',
    '{lib}util/editor/command/underline.js',
    '{lib}util/editor/command/strikethrough.js',
    '{lib}util/editor/command/forecolor.js',
    '{lib}util/editor/command/backcolor.js',
    '{lib}util/editor/command/justifyleft.js',
    '{lib}util/editor/command/justifycenter.js',
    '{lib}util/editor/command/justifyright.js',
    '{lib}util/editor/command/link.js',
    '{lib}util/editor/command/format.js',
    '{lib}util/editor/command/uploadimage.js',
    '{lib}util/editor/command/blockquote.js'
],function(NEJ,_k,_u,_t0,_t1,_t2,_t3,_t4,_t5,_t6,_t7,_t8,_t9,_t10,_t11,_t12,_t13,_t14,_t15,_t16,_p,_o,_f,_r){
    var _pro,
        _seed_html;
    /**
     * 富媒体编辑器封装
     * @class   {nej.ui._$$CustomEditor} 富媒体编辑器封装
     * @extends {nej.ui._$$Editor}
     * @param   {Object} 可选配置参数，已处理参数列表如下
     */
    _p._$$CustomEditor =_k._$klass();
    _pro = _p._$$CustomEditor._$extend(_u._$$Editor);
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    _pro.__initXGui = function(){
        this.__super();
        this.__seed_html = _seed_html;
    };
    /**
     * 动态构建控件节点模板
     * @protected
     * @method {__initNodeTemplate}
     * @return {Void}
     */
    _pro.__initNodeTemplate = (function(){
        var _flist = [{cmd:'bold',txt:'加粗',icn:'z-i-30'}
                     ,{cmd:'italic',txt:'斜体',icn:'z-i-31'}
                     ,{cmd:'underline',txt:'下划线',icn:'z-i-32'}
                     ,{cmd:'strikethrough',txt:'删除线',icn:'z-i-40'}
                     ,{cmd:'insertorderedlist',txt:'有序列表',icn:'z-i-61'}
                     ,{cmd:'insertunorderedlist',txt:'无序列表',icn:'z-i-62'}
                     ,{cmd:'foreColor',txt:'字体颜色',icn:'z-i-41'}
                     ,{cmd:'hiliteColor',txt:'背景颜色',icn:'z-i-122'}],
            _tlist = [{cmd:'justifyLeft',txt:'左对齐',icn:'z-i-50'}
                     ,{cmd:'justifyCenter',txt:'居中对齐',icn:'z-i-51'}
                     ,{cmd:'justifyRight',txt:'右对齐',icn:'z-i-52'}
                     ,{cmd:'link',txt:'超链接',icn:'z-i-42'}
                     ,{cmd:'format',txt:'清除格式',icn:'z-i-72'}
                     ,{cmd:'uploadImage',txt:'照片上传',icn:'z-i-82'}];
        return function(){
            _seed_html = _e._$addNodeTemplate(
                this.__doGenEditorXhtml({
                    toolbar:this.__doGenFontSizeXhtml()
                           +this.__doGenFontNameXhtml()
                           +this.__doGenCmdXhtml({xlist:_flist,hr:!0})
                           +this.__doGenCmdXhtml({xlist:_tlist})
                }));
            this.__seed_html = _seed_html;
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.ui'),_p);
    }

    return _p;
});