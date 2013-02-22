var f = function(){
    var _  = NEJ.P,
        _p = _('nej.p'),
        _j = _('nej.j'),
        _e = _('nej.e'),
        _v = _('nej.v'),
        _u = _('nej.u'),
        _ok = _e._$get('ok'),
        _allOk = _e._$get('allOk'),
        _param0 = _e._$get('param0'),
        _param1 = _e._$get('param1'),
        _param2 = _e._$get('param2');
    this.__platform = [];
    this.__result = _e._$get('result');
    //解析platform
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
    this.__platform.push("css3d:"+_p._$SUPPORT.css3d);
    this.__platform.push("touch:"+_p._$SUPPORT.touch);
    this.__swf = '../../qunit/res/FlexChart.swf';
    var _drawplan = function(_data){
        if(!this.__flashObj)
            return;
        var _failed = 0,_total = 0;
        _data = _data.result;
        _total = _data.length;
        _u._$forEach(_data,function(_item){
            if(_item.result == 'false')
                _failed++
        },this);
        var _obj = {
            defaultSeriesType:"Pie",
            chart:{
                field:"typeName",
                showDataTips:false,
                showLegend:false,
                width:600,
                height:400,
                data:[
                    {typeName:"Success",value:Math.round((_total-_failed)*100/_total)},
                    {typeName:"Failed",value:Math.round(_failed*100/_total)}
                ]
            }
        };
        var _sn = _e._$addHtmlTemplate('{list xlist as x}\
        {if x.result == "false"}\
            <div class="error-div">\
                <p class="p0">平台：${x.platform}</p>\
                <p class="p1">模块：${x.module}</p>\
                <p class="p2">具体测试：${x.test}</p>\
                <p class="p3">实际结果：${x.actual}</p>\
                <p class="p4">预期结果：${x.expected}</p>\
                <p class="p5">说明信息：${x.message}</p>\
                <p class="p6">测试结果：${x.result}</p>\
            </div>\
        {/if}\
        {/list}');
        var _html = _e._$getHtmlTemplate(_sn,{xlist:_data});
        this.__result.innerHTML = _html;
        this.__flashObj.initChart(_obj);
    }._$bind(this);
    this.__onFlashReady = function(_flash){
        this.__flashObj = _flash;
    };
    _e._$flash({    src:this.__swf
                   ,hidden:false
                   ,parent:_e._$get('flash')
                   ,width:900
                   ,height:600
                   ,params:{flashvars:''
                           ,allowscriptaccess:'always'
                           ,wmode:'transparent'}
                   ,onready:this.__onFlashReady._$bind(this)});
    _v._$addEvent(_ok,'click',function(){
        var _value0 = _param0.value.trim();
        var _value1 = _param1.value.trim();
        var _value2 = _param2.checked;
        var _url = 'http://192.168.146.244:3000/xhr/getTestResultByParams';
        _j._$request(_url,{
            type:'json',
            method:'POST',
            query: {
                type:_value0,
                value:_value1,
                platform:(_value2?this.__platform.join(','):'')
            },
            timeout:30000,
            headers:{},
            onload:function(_data){
                if(!_data)
                    return;
                _drawplan(_data);
            }._$bind(this),
            onerror:function(_error){
                console.log('获取结果失败');
            }}
        );
    }._$bind(this));
    
    _v._$addEvent(_allOk,'click',function(){
        var _url = 'http://192.168.146.244:3000/xhr/getAllTestResult';
        var _value2 = _param2.checked;
        _j._$request(_url,{
            type:'json',
            method:'POST',
            query: {
                platform:(_value2?this.__platform.join(','):'')
            },
            timeout:30000,
            headers:{},
            onload:function(_data){
                if(!_data)
                    return;
                _drawplan(_data);
            }._$bind(this),
            onerror:function(_error){
                console.log('获取所有结果失败');
            }}
        );
    }._$bind(this));
}
define('{pro}getResult.js',
    ['{lib}util/ajax/xdr.js','{lib}base/platform.js','{lib}base/util.js','{lib}util/flash/flash.js'],f);

