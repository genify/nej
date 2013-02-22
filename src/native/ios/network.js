/**
 * ------------------------------------------
 * 网络状况接口实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // html5 online/offline event support
//    if (window.ononline!==undefined&&
//        window.onoffline!==undefined)
//        return;
    nej.ut._$$CustomEvent._$allocate({
        event:['online','offline'],
        oninit:function(){
            PhoneGap._$exec('Network.enableNetworkMonitor');
        },
        ondispatch:function(_event){
            if (!_event.noargs){
                _event.stopped = !0;
                return;
            }
            navigator.onLine = _event.type==='online';
        }
    });
};
NEJ.define('{lib}native/ios/network.js',
      ['{lib}util/event/event.js'
      ,'{lib}native/ios/phonegap.js'],f);