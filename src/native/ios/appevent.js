/**
 * ------------------------------------------
 * App状态监控文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    nej.ut._$$CustomEvent._$allocate({
        event:'appevent'
    });
};
define('{lib}native/ios/appevent.js',
      ['{lib}util/event/event.js'],f);