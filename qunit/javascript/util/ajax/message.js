var f = function(){
	var _  = NEJ.P,
	    _v = _('nej.v'),
		_j = _('nej.j');
	_v._$addEvent(window,'message',function(_event){
		nej.j._$postMessage(_event.source,{
                    data:'你好！',
                    origin:_event.origin
                });
	});
}

define('{pro}message.js',
    ['{lib}util/ajax/message.js'],f);
  