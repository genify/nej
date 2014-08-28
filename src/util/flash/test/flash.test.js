NEJ.define(['util/flash/flash'],function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v');
    test('flash',function(){
        expect(0)
        var _flash = _e._$flash({
              src:'../../../../res/nej_upload_image.swf',
              hidden:false,
              parent:document.body,
              width:900,
              height:600,
              params:{
                  flashvars:'',
                  wmode:'transparent',
                  allowscriptaccess:'always'
              },
              onready:function(_flash){
              },
              oncustom:function(_event){
              }
        });
    });
});