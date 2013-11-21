var f = function(){
    alert('do second js file');
};
define('{pro}second.js',
      ['{lib}util/ajax/xdr.js','{lib}base/platform.js','{lib}base/util.js'],f);