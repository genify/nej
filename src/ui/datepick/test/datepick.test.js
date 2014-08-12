var f = function(){
    //定义测试模块
    module("datepick");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _ut= _('nej.ut');


    //开始单元测试
    test('datepick-ui',function(){
        stop();
        var _dp = _p._$$DatePick._$allocate({
            parent:_e._$get('datepick-box'),
            onchange:function(_date){
                ok(true,'选择了一个日期，返回此日期'+_date);
                start();
            }
        });
		_dp._$setDate('2012-12-21');
		_dp._$getDate();
    });

    test('datepick-util',function(){
        expect(0);
        var pDate = new Date(1997,7,9)
        var nDate = new Date(2013,7,9);
        var _days = _e._$get('days');
        _html = _e._$addHtmlTemplate('{list 1..2 as x}<div>{list 1..6 as y}<p class="z-day"></p>{/list}</div>{/list}');
        _days.innerHTML = _e._$getHtmlTemplate(_html);
        var _dp = _ut._$$Calendar._$allocate({
            parent:_e._$get('datepick-box2'),
            offset:1,
            list:_e._$getByClassName(_days,"z-day"),
            year:_e._$get('year'),
            month:_e._$get('month'),
            yprv:_e._$get('yprv'),
            mprv:_e._$get('mprv'),
            ynxt:_e._$get('ynxt'),
            mnxt:_e._$get('mnxt'),
            onchange:function(_date){
                // ok(true,'日期变化'+_date);
                // start();
            },
            onselect:function(_date){
				_dp._$setDate(_date)
                // ok(true,'直接用calendar选择了一个日期，返回此日期'+_date);
                // start();
            },
            range:[pDate,nDate]
        });
		_dp._$setDate('1998-09-03');
		_dp._$getDate();
    });
}
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}datepick.test.js',['{lib}ui/datepick/datepick.js'],f);
});