var f = function(){
    alert('do first js file');
}
define('{pro}first.js',['{lib}ui/editor/custom.js','{lib}base/element.js','{pro}second.js'],f);