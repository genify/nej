var http = require('http');
var url = require('url');

var log = function(m){
    console.log.apply(console,arguments);
    console.log(new Array(50).join('-'));
};

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
    var delta = 1000000-req.headers['content-length'];
    log(delta);
    if (delta<0){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('error');
        req.socket.destroy();
    }else{
        req.on('data',function(chunk){
            log('data');
            
        });
        req.on('end',function(){
            log('end');
            
        });
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('okay');
    }
}).listen(8022,'127.0.0.1');

proxy.on('connection',function(sock){
    log('connection');
    
});
proxy.on('request',function(req, res){
    log('request');
    
});
proxy.on('close',function(){
    log('close');
    
});
proxy.on('checkContinue',function(req, res){
    log('checkContinue');
    
});
proxy.on('connect',function(request, socket, head){
    log('connect');
    
});
proxy.on('upgrade',function(request, socket, head){
    log('upgrade');
    
});
proxy.on('clientError',function(exception, socket){
    log('clientError');
    
});
log('start server on 127.0.0.1:8022');
