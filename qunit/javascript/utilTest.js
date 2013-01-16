var f = function(){
    //定义测试模块
    module('util');
    var _util = NEJ.P('nej.u');
    //开始单元测试
    test('util',function(){
        //判断
        equal(_util._$isFunction(function(){}),true,'判断函数类型');
        equal(_util._$isFunction(),false,'判断函数类型');
        equal(_util._$isFunction(null),false,'判断函数类型');
        equal(_util._$isString('abc'),true,'判断字符串类型');
        equal(_util._$isString(),false,'判断字符串类型');
        equal(_util._$isString(null),false,'判断字符串类型');
        equal(_util._$isNumber("123"),false,'判断数字类型');
        equal(_util._$isNumber(),false,'判断数字类型');
        equal(_util._$isNumber(null),false,'判断数字类型');
        equal(_util._$isNumber(0),true,'判断数字类型');
        equal(_util._$isNumber(-0),true,'判断数字类型');
        equal(_util._$isNumber(+0),true,'判断数字类型');
        equal(_util._$isNumber(-1),true,'判断数字类型');
        equal(_util._$isNumber(NaN),true,'判断数字类型');
        equal(_util._$isNumber(Number.NEGATIVE_INFINITY),true,'判断数字类型');
        equal(_util._$isNumber(Number.MAX_VALUE),true,'判断数字类型');
        equal(_util._$isNumber(Number.MIN_VALUE),true,'判断数字类型');
        equal(_util._$isBoolean(0),false,'判断布尔类型');
        equal(_util._$isBoolean(),false,'判断布尔类型');
        equal(_util._$isBoolean(null),false,'判断布尔类型');
        equal(_util._$isBoolean(false),true,'判断布尔类型');
        equal(_util._$isBoolean(true),true,'判断布尔类型');
        equal(_util._$isDate(),false,'判断date类型');
        equal(_util._$isDate(null),false,'判断date类型');
        equal(_util._$isDate(new Date()),true,'判断date类型');
        equal(_util._$isArray(),false,'判断Array类型');
        equal(_util._$isArray(null),false,'判断Array类型');
        equal(_util._$isArray([1,'a',{a:1}]),true,'判断Array类型');
        equal(_util._$isObject(function(){}),false,'判断Object类型');
        equal(_util._$isObject(),false,'判断Object类型');
        equal(_util._$isObject(null),false,'判断Object类型');
        equal(_util._$isObject({}),true,'判断Object类型');
        equal(_util._$isObject({a:1}),true,'判断Object类型');

        //功能
        var _node = document.getElementById('js-node');
        equal(_util._$indexOf([1,2,3],3),2,'查找列表中的某一项');
        //常用来编码html结构,比如:<div> - > &lt;div&gt;
        equal(_util._$encode({r:/\<|\>/g,'<':'&lt;','>':'&gt;'},'<div>'),'&lt;div&gt;','根据正则编码字符串');
        equal(_util._$encode({r:/\d/g,'9':'t'},'99999'),'ttttt','编码字符串');
        equal(_util._$escape('<a>util</a>&'),'&lt;a&gt;util&lt;/a&gt;&amp;','编码html代码');
        equal(_util._$unescape('&lt;&amp;a&gt;util&lt;/a&gt;'),'<&a>util</a>','反编码html代码');
        notEqual(_util._$format(new Date(),'yyyy-MM-dd'),'2012-01-11','格式化时间');
        equal(_util._$fixed(3.1415926,2),'3.14','浮点数值保留指定位数小数点');
//        equal(_util._$dom2xml(_node),'<div xmlns=\"http://www.w3.org/1999/xhtml\" id=\"js-node\">node</div>','将dom节点转为xml串');
//        equal(document.body.appendChild(_util._$xml2dom('<div xmlns="http://www.w3.org/1999/xhtml" id="js-node2">node</div>')),document.getElementById('js-node2'),'将xml串转为dom节点然后加到页面上，自己跟自己做比较');
        var _obj = {"div":"node"};
//        equal(_util._$dom2object(_node,{}).div,_obj.div,'拷贝页面节点到空对象，跟现有节点比较');
        //返回的对象为{div:'node'}
		var _xml = '<?xml version="1.0" encoding="UTF-8" ?>\
		<netease>\
		  <albums>\
		      <p><id><code><id>id</id>\
                  <code>code</code>\
                  <name>name</name>\</code></id></p>\
			  <album>\
			      <id>id</id>\
				  <code>code</code>\
				  <name>name</name>\
			  </album>\
		  </albums>\
		</netease>';
		var _xml2 = '<?xml version="1.0" encoding="UTF-8"?>\
<netease>\
<albums>\
    <code>1</code>\
    <album>\
        <id>198114001</id>\
        <name></name>\
        <desc></desc>\
        <auth>2</auth>\
        <privacy>2</privacy>\
        <count>110</count>\
        <tcover>4/zxeW5iOfq3ppXe1etviJwg==/611645124409898904.jpg</tcover>\
        <coverurl>1/_0CvRVkR39uuLIIEHVSAJQ==/1278740819214249961.jpg</coverurl>\
        <coverurl160>5/eoc7HI1101yikVJnzbBADg==/3082713944952843165.jpg</coverurl160>\
    </album>\
</albums>\
</netease>';
        equal(_util._$xml2object(_xml2).netease.albums.album.auth,'2','XML转对象');
        var _obj2 = {123:"123",abc:"abc"};
        equal(_util._$string2object('abc=abc,123=123',',').abc,_obj2.abc,'key-value字符串转对象');
        equal(_util._$object2string(_obj2),'123=123,abc=abc','key-value对象转成key=value对后用分隔符join');
        equal(_util._$query2object('abc=abc&123=123').abc,_obj2.abc,'查询串转对象');
        equal(_util._$query2object('abc=abc&123=123')['123'],_obj2['123'],'查询串转对象');
        equal(_util._$object2query(_obj2),'123=123&abc=abc','查询串转对象');
        var _map = {0:'0',1:'1',2:'2',length:3};
        equal(_util._$object2array(_map)[1],'1','对象转数组');
        equal(typeof(_util._$randString()),'string','随机一个字符串');
        var _str = _util._$randNumberString();
        var _isNumber = function(_str){
            try{
                if(/[^\d]/.test(_str))
                    return false;
                return true;
            }catch(e){
                return false;
            }
        };
        equal(_isNumber(_str),true,'随机生成一个全部为数字的字符串，可指定长度');
        var _num = _util._$randNumber(0,1000);
        equal(typeof(_num) == 'number' && _num > 0 && _num < 1000,true,'随机生成一个数字，可指定范围');
        var _obj = {a:0};
        var _f2 = function(){
            _obj.a = 2;
        }._$aop(
        function(){
            _obj.a = 1;
        }
        ,function(){
            _obj.a = 3;
        })
        _f2();
        equal(_obj.a,3,'AOP增强操作');
        stop();
        var _list = [0,1,2];
        _util._$forEach(_list,function(_item,_index,_list){
            equal(_index == _item,true,'foreach回调方法');
            start();
        });
        stop();
        var _obj = {a:'1',b:'2',c:'3'};
        var _value = _util._$forIn(_obj,function(_item,_index,_list){
            if(_item == '2')
                return true;
        });
        equal(_value,'b','遍历列表或对象');
        start();
        stop();
        var _list = [0,1,2,3];
        var _value = _util._$reverseEach(_list,function(_item,_index,_list){
            _list[_index] = _item+1;
            return false;
        });
        equal(_list[0],1,'逆序遍历列表或对象');
        start();
        var _obj = [1,2,3];
        var _value = _util._$forIn(_obj,function(_item,_index,_list){
            if(_item == 2)
                return true;
        });
        equal(_value,1,'forIn找到符合条件的项的索引或标识');
        start();
        stop();
        var _list = [1,2,3];
        var _index = _util._$indexOf(_list,function(_value){return _value==2});
        equal(_index , 1,'线性查找指定项');
        start();
        var _obj = {"a":"a","b":"b"};
        _util._$safeDelete(_obj,["a","b"]);
        equal(_obj.a,undefined,"安全删除对象属性");
        _obj = {"a":1,"b":2};
        _util._$safeDelete(_obj,"b");
        equal(_obj.b,undefined,"安全删除对象属性");
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}utilTest.js',
          ['{lib}base/util.js','{pro}log.js'],f);
});


