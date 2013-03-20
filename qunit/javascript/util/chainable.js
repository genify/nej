

var perfTest = function(fn, times){
    var date =  +new Date()
    times = times || 0;
    for(var i = 0;i< times;i++){
        fn()
    }
    console.log(+new Date - date)
};
var f = function() {
    module("chainable");

    var _ = NEJ.P,
        _e = _('nej.e'),
        _u = _("nej.u"),
        _v = _("nej.v"),
        $ = _('nej.$'),
        _x = _('nej.x');


    test('NodeList initialize', function() {

        // 正常千万别这么写
        var _res = $("#chainable li:nth-child(2n+1)"),
            _len = nes.all("#chainable li:nth-child(2n+1)").length;

        equal($("#chainable li:nth-child(2n+1)").length, _len, "数量与节点数量一致")

        equal($("").length, 0, "可以传入不合法参数，返回空_NodeList对象");
        equal($(nes.all("#chainable"))[0], $("#chainable")[0], "可以直接传入节点数组");
        equal($(nes.one("#chainable"))[0], nes.one("#chainable"), "可以直接传入单节点")
        var _node = $("#chainable")
        notEqual(_node, $(_node), "重新包装会返回新对象")

        deepEqual($("#chainable li:nth-child(2n+1)")._$get(), nes.all("#chainable li:nth-child(2n+1)"), "_$get返回真实数组")
        deepEqual($("#chainable li:nth-child(2n+1)")._$get(1), nes.all("#chainable li:nth-child(2n+1)")[1], "传入下标，_$get返回数组中的值")

        ok(!Function.prototype.splitProcee, "原型修复splitProcess")
        ok(!Function.prototype.autoSet, "原型修复autoSet")
    })

    test('NodeList implement', function() {
        var fn1 = function() {
                return "fn1"
            }
        var fn2 = function() {
                return "fn2"
            }
        var fn3 = function() {
                return "fn3"
            }
        $._$implement("_$test1", fn1)
        deepEqual($()._$test1, fn1)
        $._$implement({
            "fn2": fn2,
            "fn3": fn3
        })
        deepEqual($().fn2, fn2, "也可以传入对象数组")

        // 2. 静态方法的 implement
        // no return static
        var staticFn = function(_node) {
                _e._$setStyle(_node, "height", "40px");
                return _e
            }
            // get static
        var staticFn2 = function(_node) {
                return 20
            }

        $._$implement("sfn1", staticFn, {
            static: true
        })
        $._$implement("sfn2", staticFn2, {
            static: true
        })

        var _list = $("#chainable li")
        equal(_list.sfn1(), _list, "set型方法可链式");
        var _notAll = false
        _u._$forEach(_list, function(_node) {
            if (_e._$getStyle(_node, "height") !== "40px") _notAll = true
        })

        ok(_notAll === false, "所有的节点都被影响了")

        equal(_list.sfn2(), 20, "set型方法不可链式，且有返回值");
    })
    

    module("NEJ 方法merge")
    test("_$style 和 _$attr", function(){
        $style = $("#nej .style");
        $attr = $("#nej .attr"); 

        $style._$style("width", "80px");
        equal($style._$style("width"), "80px", "style get与set down"); 

        $style._$style({
             height: "80px",
             width: "40px",
             backgroundColor:"#ccc"
        });
        deepEqual($style._$style(["height", "width"]),{"height":"80px","width":"40px"}, "style 多重getter与setter down")

        $attr._$attr("title", "haha")
        equal($attr._$attr("title"), "haha", "attr get与set down"); 
        $attr._$attr({
             title: "title",
             rel:"link"
        });
        deepEqual($attr._$attr(["title", "rel"]),{"title":"title","rel":"link"}, "attr 多重getter与setter down")

    });
    test("nej方法merge", function(){
        _x._$title = function(_node, title){
            if(title) _node.title = title
            else return _node.title
        }

        _x.isChange = true;

        $("body,div")._$title("haha")
        equal($("body,div")._$title(), "haha", "get")
        $("body,div")._$title("haha2")
        equal($("body,div")._$title(), "haha2", "setter")


        //  var _list =  [//class相关
        // "addClassName", "delClassName", "hasClassName", "replaceClassName", "toggle",// class相关
        // //css相关
        // "setStyle", "getStyle","css3d", "style", "offset", "getScrollViewPort", 
        // // 动画 特效 UI
        // "fixed", "effect", "fade", "focus", "highlight", "hover", "page", "placeholder", "tab", "wrapInline",
        // // 属性相关
        // "attr", "dataset",
        // // 节点
        // "remove", "removeByEC",
        // // // 杂项
        // "dom2xml","bindClearAction","bindCopyAction", "counter","addEvent", "clearEvent", "delEvent", "dispatchEvent"]
        // var _node = $("body"), num= 0;
        // _u._$forEach(_list, function(_name){
        //     if(typeof _node["_$" + _name] === "function"){
        //         num++
        //     }
        // })
        // equal(num, _list.length, "全部方法merge")
    })

    module("Base:过滤、逻辑")
    test("_$fiter、_$map、_$forEach", function() {
        deepEqual(nes.all("#chainable li:nth-child(even)"), $("#chainable li")._$filter(":nth-child(even)")._$get(), "fitler 可传入 选择器")
        var _res = $("#chainable li")._$filter(function(_node, _index) {
            return _index % 2 === 0; // 注意下表是从0开始
        })._$get();

        deepEqual(nes.all("#chainable li:nth-child(odd)"), _res, "fitler 可以传入 函数")

        var _res2 = $("#chainable li")._$map(function(_node){
            return _node
        })
        deepEqual(nes.all("#chainable li:nth-child(odd)"), _res, "fitler 可以传入 函数");
    })
    module("节点遍历")
    test("_$prev、_$next、_$parent、_$children ", function() {
       var _res = $("#chainable li")._$next(":nth-child(odd)", true)._$get();
       deepEqual(_res, nes.all("#chainable li ~ :nth-child(odd)"), "_$next all 成功返回")

       var _res = $("#chainable-footer")._$prev(true)._$get();
       $._$uniqueSort(_res) // 不保证是有序的
       deepEqual(_res, nes.all("#chainable-header, #chainable-body"), "_$prev all 成功返回")
       var _res = $("#chainable-footer")._$prev()._$get();
       deepEqual(_res, nes.all("#chainable-body"), "_$prev single 成功返回")

       var _res = $("#chainable-header")._$next(true)._$get();
       deepEqual(_res, nes.all("#chainable-body, #chainable-footer"), "_$next all 成功返回")
       var _res = $("#chainable-header")._$next()._$get();
       deepEqual(_res, nes.all("#chainable-body"), "_$next single 成功返回")

       var _parent = $('#chainable li')._$parent("ul", true)._$get();
       deepEqual(_parent, nes.all("#chainable ul"), "_$parent all 成功返回")

       var _parent = $('#chainable li')._$parent("ul,div", true)._$sort()._$get();
       deepEqual(_parent, nes.all("#chainable ul, #chainable, #chainable-header"), "_$parent all 成功返回")

       var _parent = $('#chainable li')._$parent("ul, div")._$get();

       // 全部兄弟元素
       var _siblings = $("#chainable li:last-child")._$siblings("li")._$sort()._$get();

       deepEqual(_siblings, nes.all("#chainable li:not(:last-child)"), "siblings会选择所有满足选择器的兄弟节点(但不包括li)");


       var _children = $("#chain2")._$children("ul")._$get()
       deepEqual(_children, nes.all("#chain2 > ul"), "可以取到直接子节点");

       var _children = $("#chain2")._$children("li:first-child")._$get()
       deepEqual(_children, [], "不会查找非直接子节点")

       // 加all 参数 使用全体子节点查找
       var _children = $("#chain2")._$children("li:first-child", true)._$get()
       deepEqual(_children, nes.all("li:first-child", nes.one("#chain2")))
    })
    module("事件Event")
    test("Events: base _$on, $off, $trigger", function() {
        var _locals = {"0":0}
        var _handle1 = function(e){_locals[0]++;}//每次递增1
        var _handleForMultEvents = function(){_locals[1] == (_locals[1]||0)+1;}
        // 可以
        var $node = $("#chain2");
        var _uid = $._$uid($node[0]);

        // step 1 确保 原有调用方式不错
        // $node._$on("click", _handle1)
        _v._$addEvent($node[0],"click",_handle1)
        equal($._delegateHandlers[_uid], undefined, "不使用事件代理，不会保存handler");
        _v._$dispatchEvent($node[0],"click",{})
        equal(_locals[0],1, "被正确触发")
        
        $node._$trigger("click");
        equal(_locals[0],2, "被正确触发")
        $node._$off("click",_handle1);
        $node._$trigger("click")
        equal(_locals[0],2, "不再被触发，因为已经解除绑定")

        var _prev = _locals[0]
        $node._$on(["click","mouseover", "mouseout"], _handle1)
        // $node._$trigger("click")
        $node._$trigger(["click", "mouseover"])
        equal(_locals[0],_prev+2, "可以使用数组绑定多个事件, 并且可以trigger多个事件")
        var _prev = _locals[0];
        $node._$off(["click","mouseover"])
        $node._$trigger(["click","mouseover"])
        equal(_locals[0],_prev, "click, mouseover, 无法触发因为都被解绑了")
        $node._$trigger("mouseout",{hello:1})
        equal(_locals[0],_prev+1, "mouseout仍然存")
        $node._$off()
        $node._$trigger(["mouseout","click","mouseover"])
        equal(_locals[0],_prev+1, "所有事件都被取消")

        var _prev = _locals[0]
        var _handle2 = function(e){_locals[0]+= e.step||1}
        $node._$on(["mouseout","click","mouseover"], _handle2)

        $node._$trigger("mouseout", {step:2})
        equal(_locals[0],_prev+2, "简单参数传入")

        var _prev = _locals[0];
        $node._$trigger({
            "mouseout":{step:3},
            "mouseover":{step:2}
        })
        equal(_locals[0],_prev+5, "多重trigger并传入参数")

        var _prev = _locals[0];
        $node._$trigger(["mouseout","click"],{step:3})
        equal(_locals[0],_prev+6, "多个trigger并传入同一个参数")


    })

    test("_event fixtue", function(){
        $node = $("#event-fixture");
        $node._$on("click", function(_e){
            ok(_e.__fixed, "有__fixed标示说明被patch")
        })
        $node._$trigger("click", {hello:1});
    });

    test("_$click、_$dblclick....", function(){
        var $node = $("#event");
        var _locals = [0]
        var _methods = ("click dbclick blur change focus focusin focusout keydown keypress "+ 
    "keyup mousedown mouseover mouseup mousemove mouseout scroll select submit").split(" ");

        _u._$forEach(_methods, function(_method, _index){
            ok(typeof $node["_$"+_method] === "function", _method+"方法存在");
        })

        $node._$click(function(){
            _locals[0]++;
        })
        $node._$click()

        equal(_locals[0],1, "可以通过_$click的方式绑定事件和触发事件")

        _locals[1] = 0;

        $node._$click({ //暂时手动测试 事件代理 @UI
            "li":function(e){
                alert("li click")
                console.log(e.hello)
            }
        })
    })

    module("节点操作")
    test("节点操作:_$clone等",function(){

        var $mani = $("#mani");

        var $cmani = $mani._$clone();//不深度复制

        notEqual($._$uid($mani[0]), $._$uid($cmani[0]), "节点标示会被重新设置")
        ok(!$cmani[0].getAttribute("id"), "节点ID被清空")
        equal($cmani[0].innerHTML, "", "不会复制子节点")

        var $cmani2 = $mani._$clone(true);//不深度复制
        var $cmaniDl = $cmani2._$children("dl");
        notEqual($._$uid($mani[0]), $._$uid($cmani[0]), "节点标示会被重新设置")
        ok(!!$cmaniDl,"会复制子节点")
        ok(!$cmaniDl[0].getAttribute("id"), "子节点ID也被清空")

    });
    test("_$insert、_$insert2、_$top2....", function(){
        var $node = $("#chain2");            
        var _methods = "bottom top before after bottom2 top2 before2 after2".split(" ");

        // 首先确定所有方法已经都存在了
        _u._$forEach(_methods, function(_method){
            ok(typeof $node["_$"+_method] === "function", _method+"方法存在")
        })

        var $mani = $("#mani");
        var $maniC = $("#mani-c div") //mani container

        // 分别测试 bottom top before after
        var $cmani = $mani._$clone(true);
        var $cmani2 = $mani._$clone(true);
        var $cmani3 = $mani._$clone(true);
        var $cmani4 = $mani._$clone(true);

        equal($cmani[0], $mani._$parent()._$bottom($cmani)._$children()._$last(), "复制的节点cmani被插入底部");
        equal($cmani2[0], $mani._$parent()._$top($cmani2)._$children()._$first(), "复制的节点cmani2被插入顶部");
        equal($cmani3[0], $mani._$before($cmani3)._$prev()._$first(), "复制的节点cmani3被插入cmani之前");
        equal($cmani4[0], $mani._$after($cmani4)._$next()._$first(), "复制的节点cmani4被插入cmani之后");

        equal($maniC.length, 2, "要被插入的节点集有两个元素")
        var $cmani = $mani._$clone(true);
        $cmani._$insert2("#mani-c div")
        equal($maniC._$children().length, 2, "两个元素分别被插入了两个节点")

    });
    test("属性操作", function(){
        var $node = $("#html-text .content");
        equal($node._$text("haha"), $node, "$text可链式")
        equal($node._$text(), "haha", "可取得textContent值")
        equal($node._$last(true)._$text(), "haha", "多个节点也可以赋值")

        equal($node._$html("haha"), $node, "$html")
        equal($node._$html(), "haha", "可取得")
        equal($node._$last(true)._$html(), "haha", "_$html多个节点也可以赋值")

        var $input = $("#html-text")._$children("input,textarea");
        equal($input._$val("haha"), $input, "$val可链式")
        equal($input._$val(), "haha", "可取得value")
        equal($input._$last(true)._$val(), "haha", "多个节点也可以赋值")

    })

    module("链式操作")
    test("基本操作:UI", function(){
        // 获取 奇数行的代码 设置样式
        deepEqual(
        $("#chainable li:nth-child(odd)")._$style({
            "background": "#cca",
            "cursor": "pointer"
        })
        // 然后抛弃他们 找他们的下一个位置条件满足是4倍数的兄弟节点并设置样式
        ._$next(":nth-child(2n)")._$style({
            "background": "#a19",
            "cursor": "help"
        })
        // 过滤出其中是4倍数的行,并绑定click事件
        ._$filter(":nth-child(4n)")._$click(function(_e) {
            $(this)._$style("background", "#111");
        // 并给他们中的第一行设置边框
        })._$get(1, true)._$style("border", "3px solid #222")
        // 找到父节点div并且有chainable的id并且设置样式
        ._$parent("div#chainable")._$style({
            width: "800px",
            left: "300px",
            position:"absolute"
        // 绑定事件以及代理事件
        })._$on({
            "click" :function(){
                var div = document.createElement("div")
                div.innerHTML = "haha插入一行"
                //每次点击插入一行
                $(this)._$insert(div, "bottom");
            },
            "mouseover li:nth-child(odd)":function(_e){
                if(!_e.__fixed) alert("delegate event object not fixed")
                this._isLight = !this._isLight;
                // 每次点击改变背景色
                $(this)._$style("background-color", this._isLight? "#cca":"#331")
            },
            "click li:nth-child(odd)":function(_e){
                alert("_e");
            }
        // 获得样式值
        })._$off("click li:nth-child(odd)")//这个无法触发
        ._$style(["width", "left"]), {width: "800px", left: "300px"}, " 链式操作成功，并且getter返回值成功")
        
        $("li")._$on("contextmenu",function(_e){
            alert(_e.which)
            alert("contextmenu")
        })

    })

}
define('{pro}util/chainable.js', ['{lib}util/chain/chainable.js'], f);

