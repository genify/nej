NEJ.define(['util/audio/audio'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('audio',function(){
        expect(0);
        // _e._$audio(
        //      {
        //          key:'test-audio',
        //          extra:'xxx_id',
        //          onstatechange:function(_event){
        //            ok('回调成功' + 'state ' +_event.state +　'data ' + _event.data);
        //             debugger;
        //              // _event.state -> 状态值
        //            // _event.data  -> extra值
        //            _e._$stopBgSound('test-audio');
        //            start()
        //          },
        //          onerror:function(_event){
        //              // _event.code  -> 错误类型
        //          }
        //      }
        //  );
        //  _e._$playBgSound('')
        var _audio = _e._$audio({
             preload:true,
             url:'http://www.zhlongyin.com/UploadFiles/xrxz/2011/5/201105051307513619.mp3',
             onstatechange:function(_event){
                   ok('回调成功' + 'state ' +_event.state +　'data ' + _event.data);
                   //  debugger;
                   //  _audio._$pause();
                   //  // 停止
                   //  _audio._$stop();
                   // start()
             }
         });
         // 播放
         _audio._$play();
    });
});