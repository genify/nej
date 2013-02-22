(function() {
    processUrl = function(_url) {
        var _index = _url.indexOf('?');
        if (_index == -1)
            return {};
        var _data = _url.substring(_index + 1);
        var _arr = _data.split('&');
        var _obj = {};
        for ( var i = 0, l = _arr.length; i < l; i++) {
            var _temp = _arr[i].split('=');
            if (_temp.length == 2)
                _obj[_temp[0]] = _temp[1].replace(/#/g, '');
        }
        return _obj;
    };
    var _urlObj = processUrl(location.href);
    var _parameter = '?v=3';
    if (_urlObj['orca-startup'] == 'auto') {
        _parameter += '&orca-startup=auto';
    }
    if (_urlObj['upload_ext'] == 'true') {
        _parameter += '&upload_ext=true';
    }
    t = app.getTrayIcon();
    t.icon = "orpheus://orpheus/images/ico/ntes_mail_assist.ico";
    t.toolTip = "网易邮箱助手体验版";

    t.onRightClick = function() {
        var menu = [];
        menu.push({
            menu : true,
            separator : false,
            text : '退出',
            enable : true,
            menu_id : 1005,
            children : null
        });
        winhelper.popUpMenu(JSON.stringify(menu));
    };
    winhelper.onMenuClick = function(_menuId) {
        if (_menuId == 1005)
            app.exit();
    }
    t.install();
    var error = app.getErrorHandler();
    error.setErrorHandlerUrl("orca://mailease/res/error.html");
    error.errordata = {
        url : "http://127.0.0.1:8080/error"
    };
    var url = "orpheus://orpheus/src/html/login.html" + _parameter;
    
    window.location.href = url;
})()
