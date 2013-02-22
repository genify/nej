window.onload = function(){
    winhelper.showWindow('show')
    var _winInfo = winhelper.getWindowPosition();
    if(_winInfo.width<100&&_winInfo.height<100)
        winhelper.setWindowPosition({x:_winInfo.x,y:_winInfo.y,width:455, height:395,topmost:false})
    var url = location.href;
    var info = url.split('?');
    if(info.length>1)
        var qs = info[1].split('&');
    else
        var qs=[];
    var message = "";
    for(i =0; i < qs.length; i++){
      message += qs[i].replace("=",":");
    }
    document.getElementById("info").innerHTML = '网络连接错误！<br/>'+message;
}
t = app.getTrayIcon();
t.onRightClick = function() {
    //var menu = "[{\"menu\":true, \"separator\":false, \"text\":\"退出\", \"enable\":true, \"menu_id\":1005, \"children\":null}]";
    var menu =[];
    menu.push({menu:true,separator:false,text:'退出',enable:true,menu_id:1005,children:null});
  winhelper.popUpMenu(JSON.stringify(menu));
};
winhelper.onMenuClick =function(_menuId){
      if(_menuId==1005)
          app.exit();
}
winhelper.onClose = function(){
    window.close();
    return true;
}