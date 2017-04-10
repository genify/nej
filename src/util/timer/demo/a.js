NEJ.define([
    'util/timer/animation'
],function(p){
    var abc = function () {
        log(+new Date);
        p.requestAnimationFrame(abc);
    };
    p.requestAnimationFrame(abc);
});