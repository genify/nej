var f = function() {
	console.log('my widget file');
};
define('{lib}widget/A/src/a.js',['../{platform}h.js','{lib}base/element.js'],f);