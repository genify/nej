( function() { 
  function StartWith(s, d) {
    if (s.length < d.length)
      return false;
    if (s.substr(0, d.length) != d)
      return false;
    return true;
  }

  var __timer = function(r) {
    this.timer = undefined;
    this.repeate = r;
  };

  __timer.prototype.start = function (cb, duration) {
    this.stop();
    var real_cb = function() {
      if (!this.repeate || !this.timer) {
        cb();
        return;
      } else {
        cb();
        this.timer = setTimeout(BindThis(this, real_cb), duration);
      }
    };
    this.timer = setTimeout(BindThis(this, real_cb), duration);
  };

  __timer.prototype.stop = function() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  function BindThis (me, fun) {
    return function() {
      return fun.apply(me, arguments);
    };
  };


  function BindArguments(args, fun) {
    return function() {
      var src_obj = Array.prototype.shift.call(args);
      return fun.apply(src_obj, args);
    };
  };

  function BindAllProperty(src, dst) {
    for (p in src) {
      dst[p] = src[p];
    }
  }

  function BindGetterAndSetter(src, dst, property) {
    if (src.hasOwnProperty(property)) {
      dst.__defineGetter__(property, function() { return src[property]; });
      dst.__defineSetter__(property, function(v){ src[property] = v; });
    }
  }

  __channel.reciver_pool = {};
  __channel.register_callback = function(obj, evt, cb_name) {
    var reciver = {};
    reciver.src_obj = obj;
    reciver.cb_name = cb_name;
    this.reciver_pool[evt + '.42'] = reciver;
  }

  __channel.execute_callback = function(event_key) {
    var reciver_array = __channel.match_event(event_key);
    for (i = 0; i < reciver_array.length; i++) {
      var src_obj = reciver_array[i].src_obj;
      if (src_obj[reciver_array[i].cb_name]) {
        arguments[0] = src_obj;
        if (BindArguments(arguments, src_obj[reciver_array[i].cb_name])() === true)
          return true;
      }
    }
    return false;
  }

  __channel.match_event = function(event_key) {
    var ret = [];
    for (key in this.reciver_pool) {
      if (StartWith(key, event_key))
        ret.push(this.reciver_pool[key]);
    }
    return ret;
  }

  /* make up the app plugin */

  app = {};
  BindAllProperty(__app, app);

  app.onexitmessage = undefined;
  app.onforegroundpreinstance = undefined;
  app.ontaskbarrestart = undefined;
  app.getTrayIcon = (function() {
    var trayicon = __app.getTrayIcon();
    trayicon.onclick = undefined;
    trayicon.onrightclick = undefined;
    __channel.register_callback(trayicon, "trayicon.onclick", "onclick");
    __channel.register_callback(trayicon, "trayicon.onrightclick", "onrightclick");
    return function(){ return trayicon; };
  })();

  __channel.register_callback(app, "app.ontaskbarrestart", "ontaskbarrestart");
  /* we do not register the onforegroundpreinstance and onexitmessage callback
   we use ipc_dispatcher to deal with the ipc message. */

  /* make up the browser plugin */

  browser = {};
  BindAllProperty(__browser, browser);

  /* make up the os plugin */
  os = {};
  BindAllProperty(__os, os);

  os.onaerostylechanged = undefined;

  __channel.register_callback(os, "os.onaerostylechanged", "onaerostylechanged");

  /* make up the security plugin */

  security = {};
  BindAllProperty(__security, security);
  /* make up the winhelper plugin */

  winhelper = {};
  BindAllProperty(__winhelper, winhelper);
  winhelper.onclose = undefined;
  winhelper.onlosefocus = undefined;
  winhelper.onmenuclick = undefined;
  __channel.register_callback(winhelper, "winhelper.onclose", "onclose");
  __channel.register_callback(winhelper, "winhelper.onlosefocus", "onlosefocus");
  __channel.register_callback(winhelper, "winhelper.onmenuclick", "onmenuclick");

  /* make up the palyer plugin*/
  player = {};
  
  /* we do not use BindAllProperty because of we should reset the getter and setter*/
  player.onplyer = undefined;
  player.onpause = undefined;
  player.onended = undefined;
  player.ontimeupdate = undefined;
  player.onerror = undefined;

  BindGetterAndSetter(__player, player, "src");
  BindGetterAndSetter(__player, player, "duration");
  BindGetterAndSetter(__player, player, "currentTime");
  BindGetterAndSetter(__player, player, "muted");
  BindGetterAndSetter(__player, player, "volume");
  /* custom the error object*/
  player.__defineGetter__("error", function() {
    if (__player.status === "error") {
      player.error = {};
      player.error.errorCode = __player.errorCode;
    } else {
      return null;
    }
  });
  player.__defineGetter__("paused", function() {
    return __player.status === "paused";
  });

  var player_update_timer = new __timer(true);
  var lastest_current_time = player.currentTime;
  var lastest_status = __player.status;
  var player_update_timer_cb = function() {
    if (player.currentTime !== lastest_current_time && player.ontimeupdate) {
      player.ontimeupdate();
      lastest_current_time = player.currentTime;
    } 
    var current_status = __player.status;
    if (current_status != lastest_status) {
      if (current_status === "playing" && player.onplay) {
        player.onplay();
      } else if (current_status === "ended" && player.onended) {
        player.onended();
      } else if (current_status === "paused" && player.onpause) {
        player.onpause();
      } else if (current_status === "error" && player.onerror) {
        player.onerror();
      }
      lastest_status = current_status;
    }
  }

  player.play = function() {
    __player.play();
  };

  player.pause = function() {
    __player.pause();
  }
  player_update_timer.start(player_update_timer_cb, 300);

  /* dispatch the ipc notification */

  var ipc_to_callback = {
    0 : "onexitmessage",
    1 : "onforegroundpreinstance"
  };

  __ipc_dispatcher = {};
  
  __ipc_dispatcher.onipcmessagerecived = function(src_obj, message_id, data) {
    ipc_to_callback[message_id] && app[ipc_to_callback[message_id]] && app[ipc_to_callback[message_id]](data);
  };

  __channel.register_callback(__ipc_dispatcher, "ipc.onipcmessagerecived", "onipcmessagerecived");

 }
)();
