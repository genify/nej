/*
 * ------------------------------------------
 * 需要平台适配的接口实现文件
 * @version  1.0
 * @author   
 * ------------------------------------------
 */
NEJ.define([
    './dispatcher.js',
    'base/platform'
],function(_h,_m,_p,_o,_f,_r){
    // TR 2.0 - IE 6
    // TR 3.0 - IE 7
    // TR 4.0 - IE 8
    // TR 5.0 - IE 9
    // TR 6.0 - IE 10
    // TR 7.0 - IE 11
    
    // for ie11+
    NEJ.patch('TR>=7.0',['base/util'],function(_u){
        /**
         * 修正标题被Hash污染问题
         * @param  {String} 原始标题
         * @return {Void}
         */
        _h.__doFixHashTitle = function(_title){
            new MutationObserver(function(_list){
                _u._$reverseEach(
                    _list,function(_record){
                        if (_record.target.tagName=='TITLE'||
                            _record.type=='characterData'){
                            _title = _h.__doFixTitle(_title);
                            return !0;
                        }
                    }
                );
            }).observe(
                document,{
                    subtree:!0,
                    childList:!0,
                    characterData:!0
                }
            );
        };
    });
    // for ie10-
    NEJ.patch('TR<7.0',['base/event'],function(_v){
        /**
         * 修正标题被Hash污染问题
         * @param  {String} 原始标题
         * @return {Void}
         */
        _h.__doFixHashTitle = function(_title){
            _v._$addEvent(
                document,'propertychange',function(_event){
                    if (_event.propertyName!='title'){
                        return;
                    }
                    _title = _h.__doFixTitle(_title);
                }
            );
        };
    });
    
    return _h;
});
