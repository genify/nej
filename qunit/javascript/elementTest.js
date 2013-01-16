var f = function(){
    //定义测试模块
    module('element');
    var p = NEJ.P('nej.p');
    var e = NEJ.P('nej.e');
    
    //开始单元测试
    test('判断平台',function(){
        equal(typeof(p._$KERNEL),'object','浏览器是'+p._$KERNEL.browser+'----前缀是'+p._$KERNEL.prefix.css+'----scc3d='+p._$SUPPORT.css3d);
    });
    
    test('element',function(){
        var _node = document.getElementById('js-node');
        e._$setStyle(_node,'z-index',888);
        equal(e._$getStyle(_node,'z-index'),888,'设置z-index样式');
        equal(e._$get('js-node'),_node,'取节点对象，通过ID');
        equal(e._$get(_node),_node,'取节点对象，通过对象');
        //需要重复测试
        equal(typeof(e._$id(_node)),'string','为节点设置一个唯一的ID');//返回本身id，没有id生成一个auto-id-xxxxxxxx
        /**
         * <div class="node" id="js-node">
         *     <span>node</span>
         *     <span>node2</span>
         * </div>
         */
        equal(e._$getChildren(_node)[0].innerHTML,'node','取节点的子节点列表');
        equal(e._$getChildren(_node,'node2')[0].innerHTML,'node2','根据样式标识取子节点列表');
        equal(e._$getByClassName(document,'node')[0],_node,'根据类名取节点列表');
        /**
         * 创建<div id='js-div'></div>节点
         * 追加到document.body下
         */
        equal(e._$create('div','js-div',document.body),e._$getByClassName(document,'js-div')[0],'创建一个节点');
        //xFrame
        stop();
        var _xFrame = e._$createXFrame({
            src:'http://www.baidu.com',
             name:'百度',
            parent:'frameCnt',
            visible:false,
            onload:function(){
                ok(true,'框架载入成功');
                equal(_xFrame.name,'百度','name设置');
                equal(_xFrame.style.display,'none','visible设置');
                start();
            }
        });
        var _id = e._$id(e._$getByClassName(document,'js-div')[0]);
        var _ele = e._$get(_id);
        //css3D
        var _css3d = e._$get('css3d');
        e._$css3d(_css3d,'translate',{x:'100px',y:'20px',z:'30px'});
        equal(_css3d.style['-webkit-transform'],'translate3d(100px, 20px, 30px)','设置translate3d属性,仅safari和chrome支持');
        e._$css3d(_css3d,'translate',{x:'100px',y:'20px',z:'40px'});
        equal(_css3d.style['-webkit-transform'],'translate3d(100px, 20px, 40px)','重新设置translate3d属性,仅safari和chrome支持');
        e._$css3d(_css3d,'scale',{x:1,y:2,z:2});
        equal(_css3d.style['-webkit-transform'],'scale3d(1, 2, 2)','设置scale3d属性,仅safari和chrome支持');
        e._$css3d(_css3d,'scale',{x:2,y:3,z:3});
        equal(_css3d.style['-webkit-transform'],'scale3d(2, 3, 3)','重新设置scale3d属性,仅safari和chrome支持');
        e._$css3d(_css3d,'rotate',{x:1,y:2,z:2,a:'45deg'});
        equal(_css3d.style['-webkit-transform'],'rotate3d(1, 2, 2, 45deg)','设置rotate3d属性,仅safari和chrome支持');
        e._$css3d(_css3d,'rotate',{x:2,y:1,z:1,a:'-75deg'});
        equal(_css3d.style['-webkit-transform'],'rotate3d(2, 1, 1, -75deg)','重新设置rotate3d属性,仅safari和chrome支持');
        e._$style(_css3d,{color:'red',background:'black'});
        equal(_css3d.style['color'],'red','通过_$style设置样式');
        equal(e._$getStyle(_css3d,'color'),'rgb(255, 0, 0)','去节点的color样式');
        /**
         * |a:1,b:0,c:0,d:1,e:0:f:0|
         * |m11:1,m12:0,m13:0,m14:0|
         * |m21:0,m22:1,m23:0,m24:0|
         * |m31:0,m32:0,m33:1,m34:0|
         * |m41:0,m42:0,m43:0,m44:1|
         */
        var _matrix = e._$matrix("matrix(1,0,0,1,0,0)");
        //移除节点
        e._$remove(_ele,true);
        equal(e._$get(_id),null,'删除节点，是否在删除节点前移除事件，要测试v._$clearEvent(_element)接口');
        var _ele = e._$create('div','js-div',document.body);
		_ele.innerText = 'hello';
        e._$removeByEC(_ele);
/* */    equal(e._$getByClassName(document,'js-div').length,0,'节点移除到内存中');
        var _ele = e._$create('div','js-div',document.body);
        //设置data
        var _a = e._$dataset(_ele,'img','就是一个值');
        equal(_a,'就是一个值','给对象设置属性值');
        /** _$dom2xml&&_$xml2dom
            var _d2m = e._$dom2xml(_css3d);
            var _m2d = e._$xml2dom(_d2m);
            equal(_css3d,_m2d,'dom转xml，xml转dom，转后结果一致');
            var _d2m = e._$dom2xml(_css3d);
            var _t2t = e._$text2type(_d2m,"xml");
            equal(_css3d,_css3d,'dom转xml字符串，再转成dom节点');
        */
        //_$html2node
        var _ele = e._$html2node('<div id="testnode"><img src="" /></div>');
        equal(_ele.id,'testnode','html代码转节点对象');
        var _ele = e._$html2node('<div id="testnode"></div><div id="testnode1"></div><div id="testnode2"></div>');
        equal(e._$getChildren(_ele).length,3,'html代码转节点对象');
        //_$pushCSSText
        e._$pushCSSText('.css3d{width:300px;}');
        equal(_css3d.style.width,'','未激活样式');
        e._$dumpCSSText();
        equal(_css3d.offsetWidth,300,'激活样式');
        //_$getPageBox
        var _pb = e._$getPageBox();
        equal(typeof(_pb.scrollTop),'number','取盒子的最大值');
        equal(typeof(_pb.scrollLeft),'number','取盒子的最大值');
        equal(typeof(_pb.clientWidth),'number','取盒子的最大值');
        equal(typeof(_pb.clientHeight),'number','取盒子的最大值');
        equal(typeof(_pb.scrollWidth),'number','取盒子的最大值');
        equal(typeof(_pb.scrollHeight),'number','取盒子的最大值');
        /**_$query
        var _qdom = e._$query('.css3d',document);
        equal(_qdom[0],_css3d,'通过选择器取节点');
        */
        var _bd = e._$getScrollViewPort(_node);
        equal(_bd,document.body,'获取滚动视窗');
        //equal(_bd,document.documentElement,'获取滚动视窗');
        //_$offset,没有to参数就计算到根节点
        equal(typeof(e._$offset(_node).x),'number','计算两个节点之间的偏移量');
        equal(typeof(e._$offset(_node).y),'number','计算两个节点之间的偏移量');
        var _result = e._$offset(e._$get('ele2'),e._$get('ele'));
        equal(_result.x,10,"计算两个节点之间的偏移量，指定了2个节点");
        e._$setStyle(_node,'color','#f00');
        equal(e._$getStyle(_node,'color'),'rgb(255, 0, 0)','设置color样式');
        e._$setStyle(_node,'color2','red2');
        equal(_node.style.color2,'red2','非标准属性一样设置成功，但是节点上没有显示，设置样式');
        equal(e._$getStyle(_node,'color'),'rgb(255, 0, 0)','取样式值');
        notEqual(e._$getStyle(_node,'color'),'red','样式值跟存的不一样,取的时候按照标准属性');
        equal(e._$getStyle(_node,'color2'),'','非标准属性返回空字符串');
        e._$addStyle('body{font-size:20px}');
        equal(e._$getStyle(_node,'fontSize'),'20px','添加样式');
        e._$addScript('document.getElementById("js-node").style.color = "green"');
        equal(e._$getStyle(_node,'color'),'rgb(0, 128, 0)','添加脚本');
        e._$addClassName(_node,'fc01 fc03');
        equal(_node.className,'node fc01 fc03','新增样式类，多个样式用空格分开');
        e._$delClassName(_node,'node');
        equal(_node.className,'fc01 fc03','删除样式类，多个样式用空格分开');
        e._$replaceClassName(_node,'fc01 fc03','node');
        equal(_node.className,'node','替换节点的样式类名称，多个样式用空格分隔');
        e._$addClassName(_node,'node');
        equal(e._$hasClassName(_node,'node'),true,'检测节点是否包含指定样式，多个样式用空格分隔，检测时包含其中之一即表示包含');
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}elementTest.js',
    ['{lib}base/element.js','{pro}log.js'],f);
});