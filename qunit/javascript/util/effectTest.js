var f = function(){
    //定义测试模块
    module("effect test");
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');
    
    //开始单元测试
    test('effect test', function() {
        expect(0);
        var _box = _e._$get('box'),
            _paused = _e._$get('paused-box'),
            _restart = _e._$get('restart-box');
        var _stop = _e._$get('stop-box');
        var _effect = _p._$$Effect._$allocate(
            {
                node:_box,
                transition:[
                    {
                        property:'top',
                        timing:'ease-in',
                        delay:1,
                        duration:10
                    },
                    {
                        property:'z-index',
                        timing:'ease-in',
                        delay:2,
                        duration:10
                    },
                    {
                        property:'font-size',
                        timing:'ease-out',
                        delay:3,
                        duration:10
                    },
                    {
                        property:'font-weight',
                        timing:'ease-in-out',
                        delay:4,
                        duration:10
                    },
                    {
                        property:'opacity',
                        timing:'ease-in',
                        delay:5,
                        duration:10
                    },
                    {
                        property:'left',
                        timing:'ease-out',
                        delay:6,
                        duration:10
                    },
                    {
                        property:'height',
                        timing:'linear',
                        delay:7,
                        duration:10
                    },
                    {
                        property:'margin',
                        timing:'ease-out',
                        delay:8,
                        duration:10
                    }
                ],
                styles:['top:460','z-index:2999','font-size:+=24','font-weight:900','opacity:1','left:800px','height:+=200px','margin:+=10'],
                onstop:function(){

                },
                onplaystate:function(){

                }
            }
        );
        // _v._$addEvent(_paused,'click',_effect._$paused._$bind(_effect));
        // _v._$addEvent(_restart,'click',_effect._$restart._$bind(_effect));
        _v._$addEvent(_stop,'click',_effect._$stop._$bind(_effect));
        _effect._$start();
        // var _effect2 = _p._$$Effect._$allocate({
        //         node:'box',
        //         transition:[
        //             {
        //                 property:'all',
        //                 timing:'ease-in',
        //                 delay:1,
        //                 duration:10
        //             }
        //         ],
        //         styles:['top:+=460','z-index:999'],
        //         onstop:function(){
        //        },
        //         onplaystate:function(){
        //         }
        //     });
        // _v._$addEvent(_stop,'click',_effect2._$stop._$bind(_effect2));
        // _effect2._$start();
        // var _box2 = _e._$get('box2'),
        //     _paused2 = _e._$get('paused-box2'),
        //     _restart2 = _e._$get('restart-box2'),
        //     _stop2 = _e._$get('stop-box2');
        // var _effect2 = _p._$$Effect._$allocate(
        //     {
        //         node:_box2,
        //         transition:[
        //             {
        //                 property:'width',
        //                 timing:'ease-out',
        //                 delay:1,
        //                 duration:3
        //             },
        //             {
        //                 property:'opacity',
        //                 timing:'ease-out',
        //                 delay:1,
        //                 duration:3
        //             },
        //             {
        //                 property:'top',
        //                 timing:'ease-out',
        //                 delay:1,
        //                 duration:4
        //             }
        //         ],
        //         styles:['width:-=200px','opacity:+=0.7','top:100px'],
        //         onstop:function(){

        //         },
        //         onplaystate:function(){

        //         }
        //     }
        // );
        // // _v._$addEvent(_paused2,'click',_effect2._$paused._$bind(_effect2));
        // // _v._$addEvent(_restart2,'click',_effect2._$restart._$bind(_effect2));
        // _v._$addEvent(_stop2,'click',_effect2._$stop._$bind(_effect2));
        // _effect2._$start();
    });
};
module('依赖模块');
test('define',function(){expect(0);
    define('{pro}effectTest.js',
    ['{lib}util/effect/effect.js','{pro}log.js'],f);
});
