// 此文件只能定义NEJ.patch不可执行其他业务逻辑
// 打包输出时仅根据平台配置输出所需处理逻辑
NEJ.define(['./hack.js'],
function(){
    // 针对trident平台的处理逻辑
    NEJ.patch('TR',function(){
        // TODO
        console.log('from inline ie');
    });
    // 针对webkit平台的处理逻辑
    NEJ.patch('WR',['./hack.chrome.js'],function(){
        // TODO
        console.log('from inline chrome');
    });
    // 针对gecko平台的处理逻辑
    NEJ.patch('GR',['./hack.firefox.js'],function(){
        // TODO
        console.log('from inline firefox');
    });
    
    // 针对IE6平台的处理逻辑
    NEJ.patch('TR==2.0',['./hack.ie6.js']);
    
    // 针对IE7-IE9的处理逻辑
    NEJ.patch('3.0<=TR<=5.0',function(){
        // TODO
        console.log('from inline ie7-ie9');
    });
});