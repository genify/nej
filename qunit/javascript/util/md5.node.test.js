var _crypto = require('crypto'),
    _key    = '123';
var _list = ['中文中文','0','2','100','999'];
// hmacsha12hex
for(var i = 0; i < _list.length; i++){	
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest('hex');
	console.log(_hash)
}
// hmacsha12b64
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest('base64');
    console.log(_hash)
}
// hmacsha12str
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest();
    console.log(_hash)
}
// hmacmd52hex
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('md5',_key).update(_text).digest('hex');
    console.log(_hash)
}
// hmacmd52b64
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('md5',_key).update(_text).digest('base64');
    console.log(_hash)
}
// hmacmd52str
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('md5',_key).update(_text).digest();
    console.log(_hash)
}
// sha12hex
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest('hex');
    console.log(_hash)
}
// sha12b64
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest('base64');
    console.log(_hash)
}
// sha12str
for(var i = 0; i < _list.length; i++){  
    var _text = _list[i];
    var _hash = _crypto.createHmac('sha1',_key).update(_text).digest();
    console.log(_hash)
}
// md52hex
for(var i = 0; i < _list.length; i++){
    var _buffer = new Buffer(_list[i],'ascii');
	var _md5sum = _crypto.createHash('md5');
	var _hash = _md5sum.update(_buffer).digest('hex');
    console.log(_hash)
}
// md52b64
for(var i = 0; i < _list.length; i++){
    var _buffer = new Buffer(_list[i],'ascii');
    var _md5sum = _crypto.createHash('md5');
    var _hash = _md5sum.update(_buffer).digest('base64');
    console.log(_hash)
}
// md52str
for(var i = 0; i < _list.length; i++){
    var _buffer = new Buffer(_list[i],'ascii');
    var _md5sum = _crypto.createHash('md5');
    var _hash = _md5sum.update(_buffer).digest();
    console.log(_hash)
}
// str2hex
for(var i = 0; i < _list.length; i++){  
    var _buffer = new Buffer(_list[i],'binary');
    var _hash = _buffer.toString('hex')
    console.log(_hash)
}

