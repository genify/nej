/**
 * ------------------------------------------
 * 自定义富媒体编辑器实现文件
 * @version  1.0
 * @author   weiwenqing(wqwei@corp.netease.com)
 * ------------------------------------------
 */
define(['{lib}ui/editor/editor.js', 
	    '{lib}util/editor/command/bold.js',
  		'{lib}util/editor/command/italic.js', 
  		'{lib}util/editor/command/insertorderedlist.js', 
  		'{lib}util/editor/command/insertunorderedlist.js',
  		'{lib}util/editor/command/underline.js', 
  		'{lib}util/editor/command/strikethrough.js', 
  		'{lib}util/editor/command/justifyleft.js', 
  		'{lib}util/editor/command/justifycenter.js', 
  		'{lib}util/editor/command/justifyright.js',
  		'{lib}util/editor/command/link.js', 
  		'{lib}util/editor/command/blockquote.js', 
  		'{lib}util/editor/command/removeformat.js', 
  		'{pro}ui/links.js', 
  		'{lib}util/editor/command/space.js'
], function() {
  var using = NEJ.P;
  var e = using('nej.e');
  var v = using('nej.v');
  var i = using('nej.ui');
  var dw = using('dd.widget');
  /**
   * 富媒体编辑器封装
   * @class   富媒体编辑器封装
   * @extends {nej.ui._$$Editor}
   * @param   {Object} _options 可选配置参数，已处理参数列表如下
   *
   */
  dw._$$Editor = NEJ.C();
  var proto = dw._$$Editor._$extend(i._$$Editor);
  /**
   * 控件重置
   */
  proto.__reset = function(_options) {
	  _options.style = 'body{padding:10px;-moz-box-sizing:border-box;box-sizing:border-box;font-size:12px;}';
	  this.__supReset(_options);
  }
  /**
   * 动态构建控件节点模板
   * @return {Void}
   */
  proto.__initNodeTemplate = (function() {
    var list0 = [{
      cmd: 'bold',
      txt: '加粗',
      icn: 'z-i-30'
    }, {
      cmd: 'italic',
      txt: '斜体',
      icn: 'z-i-31'
    }, {
      cmd: 'underline',
      txt: '下划线',
      icn: 'z-i-32'
    }, {
      cmd: 'strikethrough',
      txt: '删除线',
      icn: 'z-i-40'
    }];
    var list1 = [{
      cmd: 'insertorderedlist',
      txt: '有序列表',
      icn: 'z-i-61'
    }, {
      cmd: 'insertunorderedlist',
      txt: '无序列表',
      icn: 'z-i-62'
    }, {
      cmd: 'justifyLeft',
      txt: '左对齐',
      icn: 'z-i-50'
    }, {
      cmd: 'justifyCenter',
      txt: '居中对齐',
      icn: 'z-i-51'
    }, {
      cmd: 'link',
      txt: '超链接',
      icn: 'z-i-42'
    }];
    return function() {
      this.__seed_html = e._$addNodeTemplate(
        this.__doGenEditorXhtml({
          toolbar: this.__doGenCmdXhtml({
            xlist: list0,
            hr: !0
          }) + this.__doGenCmdXhtml({
            xlist: list1,
            hr: !0
          })
        }));
    };
  })();
});