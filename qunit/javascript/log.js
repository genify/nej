var f = function(){
    var _  = NEJ.P,
        _j = _('nej.j'),
        _p = _('nej.p'),
        _e = _('nej.e'),
        _u = _('nej.u');
    return function(){
        // return false;
        QUnit.testStart(function(_obj){
            this.__moduleName = _obj.module;
            this.__testName = _obj.name;
//            console.log('test call array is ' + _obj.module + '模块的' + _obj.name + '测试');
        });
        
        QUnit.testDone(function(_obj){
        });
        
        QUnit.moduleStart(function(_obj){
            this.__platform = [];
            var parsePlatform = function(){
                _u._$forIn(_p._$IS,function(_item,_index){
                    if(_item == true)
                        this.__platform.push(_index);
                },this);
            }._$bind(this);
            parsePlatform();
            var parseBrowser = function(){
                _u._$forIn(_p._$KERNEL,function(_item,_index){
                    if(typeof _item == 'string')
                        this.__platform.push(_item);
                },this);
            }._$bind(this);
            parseBrowser();
            this.__platform.push('css3d:'+_p._$SUPPORT.css3d);
            this.__platform.push('touch:'+_p._$SUPPORT.touch);
            if(!window.noclear){
                var _url = 'http://192.168.146.244:3000/get/clearLog?module='+_obj.name+
                '&platform='+this.__platform.join(',');
                var _img = _e._$create('img');
                _img.src = _url;
            }
        });
        
        QUnit.moduleDone(function(_obj){
        });
        
        QUnit.begin(function(_obj){
        });
        
        QUnit.done(function(_obj){
        });
        
        QUnit.log(function(_obj){
            var _url = 'http://192.168.146.244:3000/get/insertLog?module='+this.__moduleName
            +'&test='+this.__testName
            +'&message='+(_obj.message||'')
            +'&result='+_obj.result
            +'&actual='+_obj.actual
            +'&expected='+_obj.expected
            +'&platform='+this.__platform.join(',');
            var _img = _e._$create('img');
            setTimeout(function(){
                 _img.src = _url;
            },0);
            
        }
        );
    }();
};

define('{pro}log.js',
      ['{lib}util/ajax/xdr.js','{lib}base/platform.js','{lib}base/util.js'],f);