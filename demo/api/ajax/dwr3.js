/*
 * Copyright 2005 Joe Walker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The DWR object is also defined by dwr.util etc.
 */
if (typeof dwr == 'undefined') dwr = {};

(function() {
  if (!dwr.engine) dwr.engine = {};

  /**
    * Set an alternative error handler from the default alert box.
    * @param {Function} handler The function to call when an error happens
    * @see http://getahead.org/dwr/browser/engine/errors
    */
  dwr.engine.setErrorHandler = function(handler) {
    dwr.engine._errorHandler = handler;
  };

  /**
    * Set an alternative warning handler from the default alert box.
    * @param {Function} handler The function to call when a warning happens
    * @see http://getahead.org/dwr/browser/engine/errors
    */
  dwr.engine.setWarningHandler = function(handler) {
    dwr.engine._warningHandler = handler;
  };

  /**
    * Setter for the text/html handler - what happens if a DWR request gets an HTML
    * reply rather than the expected Javascript. Often due to login timeout
    * @param {Function} handler The function to call on an unexpected text/html content type
    */
  dwr.engine.setTextHtmlHandler = function(handler) {
    dwr.engine._textHtmlHandler = handler;
  };

  dwr.engine.setPollStatusHandler = function(handler) {
    dwr.engine._pollStatusHandler = handler;
  };

  /**
    * Set a default timeout value for all calls. 0 (the default) turns timeouts off.
    * @param {Function} handler The function to call when we get bored of waiting for a call
    * @see getahead.org/dwr/browser/engine/errors
    */
  dwr.engine.setTimeout = function(timeout) {
    dwr.engine._timeout = timeout;
  };

  /**
    * The Pre-Hook is called before any DWR remoting is done.
    * @param {Function} handler The function to call before any remote calls
    * @see getahead.org/dwr/browser/engine/hooks
    */
  dwr.engine.setPreHook = function(handler) {
    dwr.engine._preHook = handler;
  };

  /**
   * The Post-Hook is called after any DWR remoting is done.
   * @param {Function} handler The function to call after any remote calls
   * @see getahead.org/dwr/browser/engine/hooks
   */
  dwr.engine.setPostHook = function(handler) {
    dwr.engine._postHook = handler;
  };

  /**
   * Custom headers for all DWR calls
   * @param {Object} headers Object containing name/value pairs for extra headers
   * @see getahead.org/dwr/????
   */
  dwr.engine.setHeaders = function(headers) {
    dwr.engine._headers = headers;
  };

  /**
   * Custom attributes transferred to server for all DWR calls
   * @param {Object} attributes Object containing name/value pairs for attributes
   * @see getahead.org/dwr/????
   */
  dwr.engine.setAttributes = function(attributes) {
    dwr.engine._attributes = attributes;
  };

  /**
   * Ensure that remote calls happen in the order in which they were sent? (Default: false)
   * @param {boolean} ordered true to enable ordered processing
   * @see getahead.org/dwr/browser/engine/ordering
   */
  dwr.engine.setOrdered = function(ordered) {
    dwr.engine._ordered = ordered;
  };

  /**
   * Do we ask the XHR object to be asynchronous? (Default: true)
   * Warning: it is <strong>highly</strong> advised to use the default of async
   * processing, especially when dealing with Internet based requests.
   * @param {boolean} async false to enable sync processing for XHR queries
   * @see getahead.org/dwr/browser/engine/options
   */
  dwr.engine.setAsync = function(async) {
    dwr.engine._async = async;
  };

  /**
   * Does the client actively check the server for updates? (Default: false)
   * @param {boolean} async true to enable low latency reverse ajax
   * @see getahead.org/dwr/browser/engine/options
   */
  dwr.engine.setActiveReverseAjax = function(activeReverseAjax) {
    if (activeReverseAjax) {
      // Bail if we are already started
      if (dwr.engine._activeReverseAjax) return;
      // We always want a retry policy when reverse AJAX is enabled.
      dwr.engine._retryIntervals = dwr.engine._defaultRetryIntervals; 
      dwr.engine._activeReverseAjax = true;
      dwr.engine._poll();
    }
    else {
      // Can we cancel an existing request?
      if (dwr.engine._activeReverseAjax && dwr.engine._pollBatch) {
        dwr.engine.transport.abort(dwr.engine._pollBatch);
      }
      dwr.engine._activeReverseAjax = false;
    }
    // TODO: in iframe mode, if we start, stop, start then the second start may
    // well kick off a second iframe while the first is still about to return
    // we should cope with this but we don't
  };

  /**
   * Turn server notification of page unload on and off
   * @param {boolean} notify true or false depending on if we want to turn unload on or off
   * @see getahead.org/dwr/browser/engine/options
   */
  dwr.engine.setNotifyServerOnPageUnload = function(notify, asyncUnload) {
    dwr.engine._asyncUnload = (asyncUnload !== undefined) ? asyncUnload : false;
    dwr.engine._isNotifyServerOnPageUnload = notify;
  };

  /*
   * The maximum number of retries, when reached we will no longer attempt to check for server status.
   * @param - maxRetries
   */
  dwr.engine.setMaxRetries = function(maxRetries) {
    dwr.engine._maxRetries = maxRetries;
  };

  /*
   * The intervals between successive retries in seconds
   * @param - array of integers representing the retry interval in seconds.
   */
  dwr.engine.setRetryIntervals = function(intervalsArray) {
    dwr.engine._retryIntervals = intervalsArray;
  };

  /**
   * The default message handler.
   * @param {String} message The text of the error message
   * @param {Object} ex An error object containing at least a name and message
   * @see getahead.org/dwr/browser/engine/errors
   */
  dwr.engine.defaultErrorHandler = function(message, ex) {
    dwr.engine._debug("Error: " + ex.name + ", " + ex.message, true);
    if (message == null || message == "") alert("A server error has occurred.");
    // Ignore NS_ERROR_NOT_AVAILABLE if Mozilla is being narky
    else if (message.indexOf("0x80040111") != -1) dwr.engine._debug(message);
    else alert(message);
  };

  /**
   * The default warning handler.
   * @param {String} message The text of the error message
   * @param {Object} ex An error object containing at least a name and message
   * @see getahead.org/dwr/browser/engine/errors
   */
  dwr.engine.defaultWarningHandler = function(message, ex) {
    dwr.engine._debug(message);
  };

  /**
   * The default poll status handler.
   * @param {boolean} newStatus - true = online, false = offline
   * @param {object} ex - The exception if one exists (offline).
   * @see getahead.org/dwr/browser/engine/errors
   */
  dwr.engine.defaultPollStatusHandler = function(newStatus, ex) {
    dwr.engine._debug("pollStatusHandler - online: " + newStatus);    
  };

  /**
   * For reduced latency you can group several remote calls together using a batch.
   * @see getahead.org/dwr/browser/engine/batch
   */
  dwr.engine.beginBatch = function() {
    if (dwr.engine._batch) {
      dwr.engine._handleError(null, { name:"dwr.engine.batchBegun", message:"Batch already begun" });
      return;
    }
    dwr.engine._batch = dwr.engine.batch.create();
  };

  /**
   * Finished grouping a set of remote calls together. Go and execute them all.
   * @param {Object} options A options object to customize processing
   * @see getahead.org/dwr/browser/engine/batch
   */
  dwr.engine.endBatch = function(options) {
    var batch = dwr.engine._batch;
    if (batch == null) {
      dwr.engine._handleError(null, { name:"dwr.engine.batchNotBegun", message:"No batch in progress" });
      return;
    }
    dwr.engine._batch = null;
    if (batch.map.callCount == 0) {
      return;
    }

    // The hooks need to be merged carefully to preserve ordering
    if (options) {
      dwr.engine.batch.merge(batch, options);
    }

    // In ordered mode, we don't send unless the list of sent items is empty
    // (queuing is not possible for sync calls so let them slip through)
    if (batch.async && (dwr.engine._ordered || dwr.engine._internalOrdered) && dwr.engine._batchesLength != 0) {
      dwr.engine._batchQueue[dwr.engine._batchQueue.length] = batch;
    }
    else {
      return dwr.engine.transport.send(batch);
    }
  };

  /**
   * For use with file downloads. When a DWR function returns a binary download
   * you can prompt the user to save it using this function
   * @param {Object} data The binary data passed from DWR
   */
  dwr.engine.openInDownload = function(data) {
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = "<iframe width='0' height='0' scrolling='no' frameborder='0' src='" + data + "'></iframe>";
  };

  /**
   * What is the current version DWR number
   * DWR version numbers are of the form "Version 1.2.3.3128[.beta]", where:
   * 1 is the major release number. Changes in major version number indicate
   * significant enhancements in functionality
   * 2 is the minor release number. Changes in minor version number indicate
   * less significant changes in functionality
   * 3 is the revision release number. Changes here typically indicate bug
   * fixes only
   * 3128 is the build number. This number increments for each build
   * .beta is a release title that is generally only used for non production
   * releases to indicate the purpose/quality of the release
   * The label is these strings concatenated
   */
  dwr.version = {
    /**
     * Changes in major version number indicate significant enhancements
     */
    major:parseInt("${versionMajor}"),

    /**
     * Changes in minor version number indicate smaller enhancements
     */
    minor:parseInt("${versionMinor}"),

    /**
     * Changes with the revision number typically indicate bug-fixes only
     */
    revision:parseInt("${versionRevision}"),

    /**
     * The build number increments for each build
     */
    build:parseInt("${versionBuild}"),

    /**
     * Only used for non production releases to indicate the purpose/quality of
     * the release. Example titles include 'milestone1' or 'beta3'.
     */
    title:"${versionTitle}",

    /**
     * The strings above concatenated
     */
    label:"${versionLabel}"
  };

  //==============================================================================
  // Only private stuff below here
  //==============================================================================

  /** Is GET enabled for the benefit of Safari? */
  dwr.engine._allowGetForSafariButMakeForgeryEasier = "${allowGetForSafariButMakeForgeryEasier}";

  /** The script prefix to strip in the case of scriptTagProtection. */
  dwr.engine._scriptTagProtection = "${scriptTagProtection}";

  /** The default path to the DWR servlet 
   *  pathToDwrServlet is aids cross-domain. If pathToDwrServlet
   *  is defined before engine.js is included pathToDwrServlet will
   *  be used.
   */
  if (typeof pathToDwrServlet != "undefined") {
    dwr.engine._pathToDwrServlet = pathToDwrServlet;
  }
  else {
    dwr.engine._pathToDwrServlet = "${pathToDwrServlet}";
  }

  /** The webapp's context path (used for setting cookie path) */
  dwr.engine._contextPath = "${contextPath}";

  /** Do we use XHR for reverse ajax because we are not streaming? */
  dwr.engine._pollWithXhr = "${pollWithXhr}";

  dwr.engine._pollOnline = true;  

  /** These URLs can be configured from the server */
  dwr.engine._ModePlainCall = "${plainCallHandlerUrl}";
  dwr.engine._ModePlainPoll = "${plainPollHandlerUrl}";
  dwr.engine._ModeHtmlCall = "${htmlCallHandlerUrl}";
  dwr.engine._ModeHtmlPoll = "${htmlPollHandlerUrl}";

  /** Do we make the calls async? Default to 'true' */
  dwr.engine._async = Boolean("${defaultToAsync}");

  /** The local page id */
  dwr.engine._pageId = null;

  /** The browser instance id */
  dwr.engine._dwrSessionId = null;

  /** The global page id (browser instance + local page id) */
  dwr.engine._scriptSessionId = ""; // we must use "" and not null

  /** A function to be called before requests are marshalled. Can be null. */
  dwr.engine._preHook = null;

  /** A function to be called after replies are received. Can be null. */
  dwr.engine._postHook = null;

  /** A map of the batches that we have sent and are awaiting a reply on. */
  dwr.engine._batches = {};

  /** A count of the number of outstanding batches. Should be == to _batches.length unless prototype has messed things up */
  dwr.engine._batchesLength = 0;

  /** In ordered mode, the array of batches waiting to be sent */
  dwr.engine._batchQueue = [];

  /** User setting for saying that calls should execute one by one in the order in which they were sent */
  dwr.engine._ordered = false;

  /** Internal state forcing calls to execute one by one in the order in which they were sent */
  dwr.engine._internalOrdered = false;

  /** The current batch (if we are in batch mode) */
  dwr.engine._batch = null;

  /** The global timeout */
  dwr.engine._timeout = 0;

  /** Are we doing comet or polling? */
  dwr.engine._activeReverseAjax = false;

  /** The batch that we are using to poll */
  dwr.engine._pollBatch = null;

  /** How many milliseconds between internal comet polls */
  dwr.engine._pollCometInterval = 200;

  /** Default SSL secure URL used for iframe src */
  dwr.engine.SSL_SECURE_URL = "about:blank";

  /** How many times have we re-tried a call? */
  dwr.engine._retries = 0;
  dwr.engine._maxRetries = -1; // Unlimited retries

  /** The intervals between successive retries in seconds */
  dwr.engine._retryIntervals = [];

  /** Used as the default for reverse ajax/polling 
   *  Retry immediately twice with one second intervals between, then go offline.
   *  Retry every 10 seconds when offline.
   */
  dwr.engine._defaultRetryIntervals = [ 1, 1, 10 ];

  /** Do we do a document.reload if we get a text/html reply? */
  dwr.engine._textHtmlHandler = null;

  /** If you wish to send custom headers with every request */
  dwr.engine._headers = null;

  /** If you wish to send extra custom request attributes with each request */
  dwr.engine._attributes = null;

  /** Batch ids allow us to know which batch the server is answering */
  dwr.engine._nextBatchId = 0;

  /** The instance id helps us distinguish multiple engine.js loaded in one page */
  dwr.engine._instanceId = -1;

  /** A list of the properties that need merging from calls to a batch */
  dwr.engine._propnames = [ "async", "timeout", "errorHandler", "warningHandler", "textHtmlHandler" ];

  /** Do we stream, or can be hacked to do so? */
  dwr.engine._partialResponseNo = 0;
  dwr.engine._partialResponseYes = 1;
  dwr.engine._partialResponseFlush = 2;

  /** Are we doing page unloading? */
  dwr.engine._isNotifyServerOnPageUnload = false;
  
  /** Should the unload call be asynchronous?  If true it may not be called by the browser. */
  dwr.engine._asyncUnload = false;
  
  /**
   * A map of all mapped classes whose class declarations have been loaded
   * (dwrClassName -> constructor function)
   */
  dwr.engine._mappedClasses = {};

  /** A function to call if something fails. */
  dwr.engine._errorHandler = dwr.engine.defaultErrorHandler;

  /** For debugging when something unexplained happens. */
  dwr.engine._warningHandler = dwr.engine.defaultWarningHandler;

  dwr.engine._pollStatusHandler = dwr.engine.defaultPollStatusHandler;

  /** Undocumented interceptors - do not use */
  dwr.engine._postSeperator = "\n";
  dwr.engine._defaultInterceptor = function(data) { return data; };
  dwr.engine._urlRewriteHandler = dwr.engine._defaultInterceptor;
  dwr.engine._contentRewriteHandler = dwr.engine._defaultInterceptor;
  dwr.engine._replyRewriteHandler = dwr.engine._defaultInterceptor;

  /** Object attributes to ignore when serializing */
  dwr.engine._excludeObjectAttributes = {
    "$dwrClassName": true,
    "$dwrByRef": true,
    "$_dwrConversionRef": true
  };

  /** Is this page in the process of unloading? */
  dwr.engine._unloading = false;

  /** @private Abort any XHRs in progress at page unload (solves zombie socket problems in IE). */
  dwr.engine._unloader = function() {
    dwr.engine._unloading = true;

    // Empty queue of waiting ordered requests
    dwr.engine._batchQueue.length = 0;

    // Abort any ongoing XHRs and clear their batches
    var batch;
    for (var batchId in dwr.engine._batches) {
      batch = dwr.engine._batches[batchId];
      // Only process objects that look like batches (avoid prototype additions!)
      if (batch && batch.map) {
        if (batch.req) {
          batch.req.abort();
        }
      }
    }

    // If we have used reverse ajax then we try to tell the server we are gone
    if (dwr.engine._isNotifyServerOnPageUnload) {
      dwr.engine._debug("calling unloader for: " + dwr.engine._scriptSessionId);
      batch = {
        map:{
          callCount:1,
          'c0-scriptName':'__System',
          'c0-methodName':'pageUnloaded',
          'c0-id':0
        },
        paramCount:0, isPoll:false, async:dwr.engine._asyncUnload,
        headers:{}, preHooks:[], postHooks:[],
        timeout:dwr.engine._timeout,
        errorHandler:null, warningHandler:null, textHtmlHandler:null,
        path:dwr.engine._pathToDwrServlet,
        handlers:[{ exceptionHandler:null, callback:null }]
      };
      dwr.engine.transport.send(batch);
      dwr.engine._isNotifyServerOnPageUnload = false;
    }
  };

  function ignoreIfUnloading(batch, f) {
    if (dwr.engine._unloading) return;
    if (batch && batch.async == false) {
      // Sync calls are reported synchronously
      f();
    }
    else {
      // We delay error reporting for async calls to see if maybe unloading just started
      setTimeout(function() {
        if (dwr.engine._unloading) return;
        f();
      }, 100);
    }
  }

  /**
   * Send a request. Called by the JavaScript interface stub
   * @private
   * @param path part of URL after the host and before the exec bit without leading or trailing /s
   * @param scriptName The class to execute
   * @param methodName The method on said class to execute
   * @param func The callback function to which any returned data should be passed
   *       if this is null, any returned data will be ignored
   * @param args The parameters to passed to the above method
   */
  dwr.engine._execute = function(path, scriptName, methodName, args) {
    var singleShot = false;
    if (dwr.engine._batch == null) {
      dwr.engine.beginBatch();
      singleShot = true;
    }

    var batch = dwr.engine._batch;
    // All the paths MUST be to the same servlet
    if (batch.path == null) {
      batch.path = path;
    }
    else {
      if (batch.path != path) {
        dwr.engine._handleError(batch, { name:"dwr.engine.multipleServlets", message:"Can't batch requests to multiple DWR Servlets." });
        return;
      }
    }

    dwr.engine.batch.addCall(batch, scriptName, methodName, args);

    // Now we have finished remembering the call, we increment the call count
    batch.map.callCount++;
    if (singleShot) {
      return dwr.engine.endBatch();
    }
  };

  /**
   * Poll the server to see if there is any data waiting
   * @private
   */
  dwr.engine._poll = function() {
    if (!dwr.engine._activeReverseAjax) {
      return;
    }
    dwr.engine._pollBatch = dwr.engine.batch.createPoll();
    dwr.engine.transport.send(dwr.engine._pollBatch);
  }; 

  /** @private This is a hack to make the context be this window */
  dwr.engine._eval = function(script) {
    if (script == null) {
      return null;
    }
    if (script == "") {
      dwr.engine._debug("Warning: blank script", true);
      return null;
    }
    // dwr.engine._debug("Exec: [" + script + "]", true);
    return eval(script);
  };

  /** @private call all the post hooks for a batch */
  dwr.engine._callPostHooks = function(batch) {
    if (batch.postHooks) {
      for (var i = 0; i < batch.postHooks.length; i++) {
        batch.postHooks[i]();
      }
      batch.postHooks = null;
    }
  };

  /**
   * Generic error handling routing to save having null checks everywhere
   * @private
   * @param {Object} batch
   * @param {Object} ex
   */
  dwr.engine._handleError = function(batch, ex) {
    // Perform error cleanup synchronously
    var errorHandlers = [];
    if (dwr.engine._retries <= 1) {    
      if (batch) {
        for (var i = 0; i < batch.map.callCount; i++) {
          var handlers = batch.handlers[i];
          if (!handlers.completed) {
            if (typeof handlers.errorHandler == "function") errorHandlers.push(handlers.errorHandler);
            handlers.completed = true;
          }
        }
      }
      if (batch) dwr.engine.batch.remove(batch);
    }
    // Perform error reporting asynchronously (possibly)
    ignoreIfUnloading(batch, function() {
      if (dwr.engine._retries <= 1) {    
        dwr.engine._prepareException(ex);
        var errorHandler;
        while(errorHandlers.length > 0) {
          errorHandler = errorHandlers.shift();
          errorHandler(ex.message, ex);
        }
        if (batch && typeof batch.errorHandler == "function") batch.errorHandler(ex.message, ex);
        else if (dwr.engine._errorHandler) dwr.engine._errorHandler(ex.message, ex);
      }
    });
  };

  /**
   * Handle retries for polling as well as online/offline status.
   * @private
   * @param {Object} batch
   * @param {Object} ex
   */
  dwr.engine._handlePollRetry = function(batch, ex) {
    var retryInterval;
    if (batch && batch.isPoll) {
      if (dwr.engine._retries < dwr.engine._retryIntervals.length) {
        // We are still online, try the next interval.
        retryInterval = dwr.engine._retryIntervals[dwr.engine._retries] * 1000;
      } else {
        // The last interval in retryIntervals is the number that will be used to poll when offline.
        retryInterval = dwr.engine._retryIntervals[dwr.engine._retryIntervals.length - 1] * 1000;
      }      
      if (dwr.engine._maxRetries == -1 || dwr.engine._retries <= dwr.engine._maxRetries) {
        // Call supplied pollStatusHandler and go offline.        
        if (dwr.engine._retries == dwr.engine._retryIntervals.length - 1) {
          dwr.engine._debug("poll retry - going offline: " + retryInterval/1000 + " seconds");
          dwr.engine._handlePollStatusChange(false, ex);       
        }
        dwr.engine._retries++;
        dwr.engine.batch.remove(batch);
        dwr.engine._debug("poll retry - interval: " + retryInterval/1000 + " seconds");
        setTimeout(dwr.engine._poll, retryInterval);
      } else {
        dwr.engine._debug("max retries reached, stop polling for server status.");
      }
    }
  };

  /**
   * Handles polling status changes - online or offline.  
   * @param {boolean} newStatus - true = online, false = offline
   * @param {object} ex - The exception if one exists (offline).
   * @see getahead.org/dwr/browser/engine/errors
   */
  dwr.engine._handlePollStatusChange = function(newStatus, ex) {
    if (!newStatus) {
      dwr.engine._pollOnline = false;
    }   
    if (typeof dwr.engine._pollStatusHandler) dwr.engine._pollStatusHandler(newStatus, ex);
    if (newStatus) {
      dwr.engine._pollOnline = true;
      dwr.engine._retries = 0; 
    }   
  };

  /**
   * Generic error handling routing to save having null checks everywhere.
   * @private
   * @param {Object} batch
   * @param {Object} ex
   */
  dwr.engine._handleWarning = function(batch, ex) {
    ignoreIfUnloading(batch, function() {
      // If this is a poll, we should retry! 
      dwr.engine._prepareException(ex); 
      if (batch && typeof batch.warningHandler == "function") batch.warningHandler(ex.message, ex);
      else if (dwr.engine._warningHandler) dwr.engine._warningHandler(ex.message, ex);
      if (batch) dwr.engine.batch.remove(batch);
    });
  };

  /**
   * Prepares an exception for an error/warning handler.  
   * @private
   * @param {Object} ex
   */
  dwr.engine._prepareException = function(ex) {
    if (typeof ex == "string") ex = { name:"unknown", message:ex };
    if (ex.message == null) ex.message = "";
    if (ex.name == null) ex.name = "unknown";
  };

  /**
   * Create a new object that delegates to obj
   * @param obj 
   */
  dwr.engine._delegate = (function() { 
    function F(){} 
    return (function(obj){ 
      F.prototype = obj; 
      return new F(); 
    }); 
  })();
  
  /**
   * Create a new object that delegates to obj
   * @param obj 
   */
  dwr.engine._createFromMap = function(map) {
    var obj = new this(); // this should be set to a constructor function!
    for(prop in map) if (map.hasOwnProperty(prop)) obj[prop] = map[prop];
    return obj;
  };
  
  /**
   * A reference to the global context (window when in a browser)
   */
  dwr.engine._global = (function(){return this;}).call(null);
  
  /**
   * Navigates properties from the global scope and down to fetch a property
   * value.
   * @param prop hierarchical property name
   * @return property value, or undefined if doesn't exist
   */
  dwr.engine._getObject = function(prop) {
    var parts = prop.split(".");
    var value;
    var scope = dwr.engine._global;
    while(parts.length > 0) {
      var currprop = parts.shift();
      value = scope[currprop];
      if (parts.length > 0 && value == null) return undefined;
      scope = value;
    }
    return value;
  };

  /**
   * Navigates properties from the global scope and down to set a value.
   * @param prop hierarchical property name
   * @param obj property value to set
   */
  dwr.engine._setObject = function(prop, obj) {
    var parts = prop.split(".");
    var level;
    var scope = dwr.engine._global;
    while(parts.length > 0) {
      var currprop = parts.shift();
      if (parts.length == 0) {
        scope[currprop] = obj;
      }
      else {
        level = scope[currprop];
        if (level == null) {
          scope[currprop] = level = {};
        }
        scope = level;
      }
    }
  };
  
  /**
   * Used internally when some message needs to get to the programmer
   * @private
   * @param {String} message
   * @param {Object} stacktrace
   */
  dwr.engine._debug = function(message, stacktrace) {
    var written = false;
    try {
      if (window.console) {
        if (stacktrace && window.console.trace) window.console.trace();
        window.console.log(message);
        written = true;
      }
      else if (window.opera && window.opera.postError) {
        window.opera.postError(message);
        written = true;
      }
      else if (window.Jaxer && Jaxer.isOnServer) {
        Jaxer.Log.info(message);
        written = true;
      }
    }
    catch (ex) { /* ignore */ }

    if (!written) {
      var debug = document.getElementById("dwr-debug");
      if (debug) {
        var contents = message + "<br/>" + debug.innerHTML;
        if (contents.length > 2048) contents = contents.substring(0, 2048);
        debug.innerHTML = contents;
      }
    }
  };

  /**
   * Functions called by the server
   */
  dwr.engine.remote = {
    /**
     * Execute a callback
     * @private
     * @param {int} batchId The ID of the batch that we are replying to
     * @param {int} callId The call ID that the script relates to
     * @param {String} reply The script to execute
     */
    handleCallback:function(batchId, callId, reply) {
      var batch = dwr.engine._batches[batchId];
      if (batch == null) {
        dwr.engine._debug("Warning: batch == null in remoteHandleCallback for batchId=" + batchId, true);
        return;
      }

      // We store the reply in the batch so that in sync mode we can return the data
      batch.reply = reply;

      // Error handlers inside here indicate an error that is nothing to do
      // with DWR so we handle them differently.
      try {
        var handlers = batch.handlers[callId];
        if (!handlers) {
          dwr.engine._debug("Warning: Missing handlers. callId=" + callId, true);
        }
        else {
          batch.handlers[callId].completed = true;
          if (typeof handlers.callback == "function") {
            handlers.callback.apply(handlers.callbackScope, [ reply, handlers.callbackArg ]);
          }
        }
      }
      catch (ex) {
        dwr.engine._handleError(batch, ex);
      }
    },

    /**
     * Called by the server when a JavascriptFunction is executed
     * @param id The ID of the serialized function
     * @param args The arguments to pass to the function
     */
    handleFunctionCall:function(id, args) {
      var func = dwr.engine.serialize.remoteFunctions[id];
      func.apply(window, args);
    },

    /**
     * Called by the server when a JavascriptFunction is executed
     * @param id The ID of the serialized function
     * @param args The arguments to pass to the function
     */
    handleObjectCall:function(id, methodName, args) {
      var obj = dwr.engine.serialize.remoteFunctions[id];
      obj[methodName].apply(obj, args);
    },

    /**
     * Called by the server when a JavascriptFunction is executed
     * @param propertyName The ID of the serialized function
     * @param data The arguments to pass to the function
     */
    handleSetCall:function(id, propertyName, data) {
      var obj = dwr.engine.serialize.remoteFunctions[id];
      obj[propertyName] = data;
    },

    /**
     * Called by the server when a JavascriptFunction is closed
     * @param id The ID of the serialized function
     */
    handleFunctionClose:function(id) {
      delete dwr.engine.serialize.remoteFunctions[id];
    },

    /**
     * Called by the server: Handle an exception for a call
     * @private
     * @param {int} batchId The ID of the batch that we are replying to
     * @param {int} callId The call ID that the script relates to
     * @param {String} reply The script to execute
     */
    handleException:function(batchId, callId, ex) {
      var batch = dwr.engine._batches[batchId];
      if (batch == null) {
        dwr.engine._debug("Warning: null batch in remoteHandleException", true);
        return;
      }

      var handlers = batch.handlers[callId];
      batch.handlers[callId].completed = true;
      if (handlers == null) {
        dwr.engine._debug("Warning: null handlers in remoteHandleException", true);
        return;
      }

      if (ex.message == undefined) {
        ex.message = ""; 
      }

      if (typeof handlers.exceptionHandler == "function") {
        handlers.exceptionHandler.call(handlers.exceptionScope, ex.message, ex, handlers.exceptionArg);
      }
      else if (typeof batch.errorHandler == "function") {
        batch.errorHandler(ex.message, ex);
      }
    },

    /**
     * Called by the server: The whole batch is broken
     * @private
     * @param {Object} ex The data about what broke
     * @param {int} batchId The ID of the batch that we are replying to
     */
    handleBatchException:function(ex, batchId) {
      var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
      if (searchBatch) {
        dwr.engine._receivedBatch = dwr.engine._batches[batchId];
      }
      if (ex.message == undefined) ex.message = "";
      dwr.engine._handleError(dwr.engine._receivedBatch, ex);
      if (searchBatch) {
        dwr.engine._receivedBatch = null;
        dwr.engine.batch.remove(dwr.engine._batches[batchId]);
      }
    },

    /**
     * Called by the server when we need to set a new window name
     */
    handleNewWindowName:function(windowName) {
      dwr.engine._debug("Setting new window name: " + windowName);
      if (window.name != null && window.name != "") {
        dwr.engine._debug("- Warning: This will override existing name of: " + window.name);
      }
      window.name = windowName;
    },

    /**
     * Execute some script in a different window
     * @param {Object} windowName The name of the window in which to eval the script
     * @param {Object} script The script to eval elsewhere
     */
    handleForeign:function(windowName, script) {
      var foreign = window.open(null, windowName);
      if (foreign != null) {
        if (foreign.dwr != null) {
          foreign.dwr.engine._eval(script);
        }
        else {
          dwr.engine._debug("Found window, but DWR did not exist in it");
        }
      }
      else {
        dwr.engine._debug("Could not find window");
      }
    },

    /**
     * Called by the server: Reverse ajax should not be used
     * @private
     * @param {Object} ex
     * @param {int} batchId
     */
    pollCometDisabled:function(ex, batchId){
      dwr.engine.setActiveReverseAjax(false);
      var searchBatch = (dwr.engine._receivedBatch == null && batchId != null);
      if (searchBatch) {
        dwr.engine._receivedBatch = dwr.engine._batches[batchId];
      }
      if (ex.message == undefined) {
        ex.message = "";
      }
      dwr.engine._handleError(dwr.engine._receivedBatch, ex);
      if (searchBatch) {
        dwr.engine._receivedBatch = null;
        dwr.engine.batch.remove(dwr.engine._batches[batchId]);
      }
    },

    /**
     * Called by the server: Create a new object of a mapped class
     * @private
     * @param {string} dwrClassName the name of the mapped class
     * @param {Object} memberMap the object's data members
     */
    newObject:function(dwrClassName, memberMap){
      var classfunc = dwr.engine._mappedClasses[dwrClassName]; 
      if (classfunc && classfunc.createFromMap) {
        return classfunc.createFromMap(memberMap);
      }
      else {
        memberMap.$dwrClassName = dwrClassName;
        return memberMap;
      }
    }
  };

  /**
   * Functions to serialize a data set into a list of parameters
   */
  dwr.engine.serialize = {
    /**
     * ActiveX objects to use when we want to convert an xml string into a DOM object
     */
    domDocument:[
      "Msxml2.DOMDocument.6.0",
      "Msxml2.DOMDocument.5.0",
      "Msxml2.DOMDocument.4.0",
      "Msxml2.DOMDocument.3.0",
      "MSXML2.DOMDocument",
      "MSXML.DOMDocument",
      "Microsoft.XMLDOM"
    ],

    /**
     * A holder for functions that we have serialized for remote calling.
     */
    remoteFunctions:{},

    /**
     * The ID of the next function that we serialize
     */
    funcId:0,

    /**
     * Convert a text representation of XML into a DOM element
     * @param {String} xml An xml string
     */
    toDomElement:function(xml) {
      return dwr.engine.serialize.toDomDocument(xml).documentElement;
    },

    /**
     * Convert a text representation of XML into a DOM document
     * @param {String} xml An xml string
     */
    toDomDocument:function(xml) {
      var dom;
      if (window.DOMParser) {
        var parser = new DOMParser();
        dom = parser.parseFromString(xml, "text/xml");
        if (!dom.documentElement || dom.documentElement.tagName == "parsererror") {
          var message = dom.documentElement.firstChild.data;
          message += "\n" + dom.documentElement.firstChild.nextSibling.firstChild.data;
          throw message;
        }
        return dom;
      }
      else if (window.ActiveXObject) {
        dom = dwr.engine.util.newActiveXObject(dwr.engine.serialize.domDocument);
        dom.loadXML(xml); // What happens on parse fail with IE?
        return dom;
      }
      else {
        var div = document.createElement("div");
        div.innerHTML = xml;
        return div;
      }
    },

    /**
     * Marshall a data item
     * @private
     * @param batch A map of variables to how they have been marshalled
     * @param directrefmap A map of already marshalled variables to prevent recurrsion (these have direct links from their data object)
     * @param otherrefmap A map of already marshalled variables to prevent recursion (these have no links from data objects)
     * @param data The data to be marshalled
     * @param name The name of the data being marshalled
     */
    convert:function(batch, directrefmap, otherrefmap, data, name, depth) {
      if (data == null) {
        batch.map[name] = "null:null";
        return;
      }

      switch (typeof data) {
      case "boolean":
        batch.map[name] = "boolean:" + data;
        break;
      case "number":
        batch.map[name] = "number:" + data;
        break;
      case "string":
        batch.map[name] = "string:" + encodeURIComponent(data);
        break;
      case "object":
        var ref = dwr.engine.serialize.lookup(directrefmap, otherrefmap, data, name);
        var objstr = Object.prototype.toString.call(data);
        if (data.$dwrByRef) batch.map[name] = dwr.engine.serialize.convertByReference(batch, directrefmap, otherrefmap, data, name, depth + 1);
        else if (ref != null) batch.map[name] = ref;
        else if (objstr == "[object String]") batch.map[name] = "string:" + encodeURIComponent(data);
        else if (objstr == "[object Boolean]") batch.map[name] = "boolean:" + data;
        else if (objstr == "[object Number]") batch.map[name] = "number:" + data;
        else if (objstr == "[object Date]") batch.map[name] = "date:" + data.getTime();
        else if (objstr == "[object Array]") batch.map[name] = dwr.engine.serialize.convertArray(batch, directrefmap, otherrefmap, data, name, depth + 1);
        else if (data && data.tagName && data.tagName.toLowerCase() == "input" && data.type && data.type.toLowerCase() == "file") {
          batch.fileUpload = true;
          batch.map[name] = data;
        }
        else {
          // This check for an HTML is not complete, but is there a better way?
          // Maybe we should add: data.hasChildNodes typeof "function" == true
          if (data.nodeName && data.nodeType) {
            batch.map[name] = dwr.engine.serialize.convertXml(batch, directrefmap, otherrefmap, data, name, depth + 1);
          }
          else {
            batch.map[name] = dwr.engine.serialize.convertObject(batch, directrefmap, otherrefmap, data, name, depth + 1);
          }
        }
        break;
      case "function":
        // Ignore functions unless they are directly passed in
        if (depth == 0) {
          batch.map[name] = dwr.engine.serialize.convertByReference(batch, directrefmap, otherrefmap, data, name, depth + 1);
        }
        break;
      default:
        dwr.engine._handleWarning(null, { name:"dwr.engine.unexpectedType", message:"Unexpected type: " + typeof data + ", attempting default converter." });
        batch.map[name] = "default:" + data;
        break;
      }
    },

    /**
     * Marshall an object by reference
     * @private
     * @see dwr.engine.serialize.convert() for parameter details
     */
    convertByReference:function(batch, directrefmap, otherrefmap, data, name, depth) {
      var funcId = "f" + dwr.engine.serialize.funcId;
      dwr.engine.serialize.remoteFunctions[funcId] = data;
      dwr.engine.serialize.funcId++;
      return "byref:" + funcId;
    },

    /**
     * Marshall an array
     * @private
     * @see dwr.engine.serialize.convert() for parameter details
     */
    convertArray:function(batch, directrefmap, otherrefmap, data, name, depth) {
      var childName, i;
      if (dwr.engine.isIE <= 7) {
        // Use array joining on IE1-7 (fastest)
        var buf = ["array:["];
        for (i = 0; i < data.length; i++) {
          if (i != 0) buf.push(",");
          batch.paramCount++;
          childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
          dwr.engine.serialize.convert(batch, directrefmap, otherrefmap, data[i], childName, depth + 1);
          buf.push("reference:");
          buf.push(childName);
        }
        buf.push("]");
        reply = buf.join("");
      }
      else {
        // Use string concat on other browsers (fastest)
        var reply = "array:[";
        for (i = 0; i < data.length; i++) {
          if (i != 0) reply += ",";
          batch.paramCount++;
          childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
          dwr.engine.serialize.convert(batch, directrefmap, otherrefmap, data[i], childName, depth + 1);
          reply += "reference:";
          reply += childName;
        }
        reply += "]";
      }

      return reply;
    },

    /**
     * Marshall an object by value
     * @private
     * @see dwr.engine.serialize.convert() for parameter details
     */
    convertObject:function(batch, directrefmap, otherrefmap, data, name, depth) {
      // treat objects as an associative arrays
      var reply = "Object_" + dwr.engine.serialize.getObjectClassName(data).replace(/:/g, "?") + ":{";
      var elementset = (data.constructor && data.constructor.$dwrClassMembers ? data.constructor.$dwrClassMembers : data);
      var element;
      for (element in elementset) {
        if (typeof data[element] != "function" && !dwr.engine._excludeObjectAttributes[element]) {
          batch.paramCount++;
          var childName = "c" + dwr.engine._batch.map.callCount + "-e" + batch.paramCount;
          dwr.engine.serialize.convert(batch, directrefmap, otherrefmap, data[element], childName, depth + 1);
          reply += encodeURIComponent(element) + ":reference:" + childName + ", ";
        }
      }

      if (reply.substring(reply.length - 2) == ", ") {
        reply = reply.substring(0, reply.length - 2);
      }
      reply += "}";

      return reply;
    },

    /**
     * Marshall an object
     * @private
     * @see dwr.engine.serialize.convert() for parameter details
     */
    convertXml:function(batch, directrefmap, otherrefmap, data, name, depth) {
      var output;
      if (window.XMLSerializer) output = new XMLSerializer().serializeToString(data);
      else if (data.toXml) output = data.toXml;
      else output = data.innerHTML;

      return "xml:" + encodeURIComponent(output);
    },

    /**
     * Have we already converted this object?
     * @private
     * @see dwr.engine.serialize.convert() for parameter details
     */
    lookup:function(directrefmap, otherrefmap, data, name) {
      // Look for reference to previous conversion
      var ref;
      if ("$_dwrConversionRef" in data) {
        ref = data.$_dwrConversionRef;
        if (ref && directrefmap[ref] != data) ref = null;
      }
      if (ref == null) {
        for(r in otherrefmap) {
          if (otherrefmap[r] == data) {
            ref = r;
            break;
          }
        }
      }
      if (ref != null) return "reference:" + ref;
      // This was a new conversion - save the reference!
      try {
        data.$_dwrConversionRef = name;
        directrefmap[name] = data;
      }
      catch(err) {
        otherrefmap[name] = data;
      }
      return null;
    },

    /**
     * Clean up our conversion markers from user data
     * @private
     */
    cleanup:function(directrefmap) {
      for(name in directrefmap) {
        var data = directrefmap[name];
        try {
          delete data.$_dwrConversionRef;
        }
        catch(err) {
          data.$_dwrConversionRef = undefined;
        }
      }
    },
    
    /**
     * Returns the classname of supplied argument obj. Similar to typeof, but
     * which returns the name of the constructor that created the object rather
     * than 'object'
     * @private
     * @param {Object} obj The object to detect the type of
     * @return The name of the object
     */
    getObjectClassName:function(obj) {
      // Different handling depending on if, and what type of, class-mapping is used
      if (obj.$dwrClassName)
        return obj.$dwrClassName; // Light class-mapping uses the classname from a property on the instance
      else if (obj.constructor && obj.constructor.$dwrClassName)
        return obj.constructor.$dwrClassName; // Full class-mapping uses the classname from a property on the constructor function
      else
        return "Object";
    }
  };

  /**
   * Functions to handle the various remoting transport
   */
  dwr.engine.transport = {
    /**
     * Manage the DWR session and then send.
     * @private
     * @param {Object} batch
     */
    send:function(batch) {
      dwr.engine.transport.updateDwrSessionFromCookie();
      if (!dwr.engine._dwrSessionId) {
        dwr.engine._internalOrdered = true;
        var idbatch = {
          map:{
            callCount:1,
            'c0-scriptName':'__System',
            'c0-methodName':'generateId',
            'c0-id':0
          },
          paramCount:0, isPoll:false, async:batch.async,
          headers:{}, preHooks:[], 
          postHooks:[function() {
            dwr.engine._internalOrdered = false;
          }],
          timeout:dwr.engine._timeout,
          errorHandler:batch.errorHandler, warningHandler:batch.warningHandler, textHtmlHandler:batch.textHtmlHandler,
          path:batch.path,
          handlers:[{
            exceptionHandler:null, 
            callback:function(id) {
              dwr.engine.transport.updateDwrSessionFromCookie();
              if (!dwr.engine._dwrSessionId) {
                dwr.engine.transport.setDwrSession(id);
              }
              dwr.engine.transport.send2(batch);
            }
          }]
        };
        dwr.engine.transport.send2(idbatch);
      }
      else {
        dwr.engine.transport.send2(batch);
      }
    },

    /**
     * Actually send the block of data in the batch object.
     * @private
     * @param {Object} batch
     */
    send2:function(batch) {
      dwr.engine.batch.prepareToSend(batch);

      // Work out if we are going cross domain
      var isCrossDomain = false;
      if (batch.path == null) {
        batch.path = dwr.engine._pathToDwrServlet;
      }
      if (batch.path.indexOf("http://") == 0 || batch.path.indexOf("https://") == 0) {
        var dwrShortPath = batch.path.split("/", 3).join("/"); 
        var hrefShortPath = window.location.href.split("/", 3).join("/");
        isCrossDomain = (dwrShortPath != hrefShortPath);
      }

      if (batch.fileUpload) {
        if (isCrossDomain) {
          throw new Error("Cross domain file uploads are not possible with this release of DWR");
        }
        batch.transport = dwr.engine.transport.iframe;
      }
      else if (isCrossDomain && !dwr.engine.isJaxerServer) {
        batch.transport = dwr.engine.transport.scriptTag;
      }
      // else if (batch.isPoll && dwr.engine.isIE) {
      //   batch.transport = dwr.engine.transport.htmlfile;
      // }
      else {
        batch.transport = dwr.engine.transport.xhr;
      }

      return batch.transport.send(batch);
    },

    /**
     * Called to signal that the batch response has been delivered
     */
    complete:function(batch) {
        dwr.engine.batch.validate(batch);
        dwr.engine.transport.remove(batch);
    },
    
    /**
     * Called as a result of a request timeout
     * @private
     * @param {Object} batch The batch that is aborting
     */
    abort:function(batch) {
      var transport = batch.transport;
      dwr.engine.transport.remove(batch);
      if (transport.abort) {
        transport.abort(batch);
      }
      dwr.engine._handleError(batch, { name:"dwr.engine.timeout", message:"Timeout" });
    },

    /**
     * Remove all remoting artifacts
     * @param {Object} batch The batch that has completed
     */
    remove:function(batch) {
      if (batch.transport) {
        dwr.engine._callPostHooks(batch);
        batch.transport.remove(batch);
        batch.transport = null;
      }
      dwr.engine.batch.remove(batch);
    },

    setDwrSession:function(dwrsess) {
      dwr.engine._dwrSessionId = dwrsess;
      document.cookie = "DWRSESSIONID=" + dwrsess + "; path=" + (dwr.engine._contextPath != "" ? dwr.engine._contextPath : "/");
      dwr.engine._scriptSessionId = dwrsess + "/" + dwr.engine._pageId;
    },

    updateDwrSessionFromCookie:function() {
      if (!dwr.engine._dwrSessionId) {
        var match = document.cookie.match(/(?:^|; )DWRSESSIONID=([^;]+)/);
        if (match) {
          dwr.engine.transport.setDwrSession(match[1]);
        }
      }
    },

    /**
     * Remoting through XHR
     */
    xhr:{
      /**
       * The default HTTP method to use
       */
      httpMethod:"POST",

      /**
       * The ActiveX objects to use when we want to do an XMLHttpRequest call.
       * TODO: We arrived at this by trial and error. Other toolkits use
       * different strings, maybe there is an officially correct version?
       */
      XMLHTTP:["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"],

      /**
       * Setup a batch for transfer through XHR
       * @param {Object} batch The batch to alter for XHR transmit
       */
      send:function(batch) {
        if (batch.isPoll) {
          batch.map.partialResponse = dwr.engine._partialResponseYes;
        }

        // Do proxies or IE force us to use early closing mode?
        if (batch.isPoll && dwr.engine._pollWithXhr == "true") {
          batch.map.partialResponse = dwr.engine._partialResponseNo;
        }
        if (batch.isPoll && dwr.engine.isIE) {
          batch.map.partialResponse = dwr.engine._partialResponseNo;
        }

        if (window.XMLHttpRequest) {
          batch.req = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
          batch.req = dwr.engine.util.newActiveXObject(dwr.engine.transport.xhr.XMLHTTP);
        }

        // Proceed using XMLHttpRequest
        if (batch.async == true) {
          batch.req.onreadystatechange = function() {
            if (typeof dwr != 'undefined') {
              dwr.engine.transport.xhr.stateChange(batch);
            }
          };
        }

        httpMethod = dwr.engine.transport.xhr.httpMethod;

        // Workaround for Safari 1.x POST bug
        var indexSafari = navigator.userAgent.indexOf("Safari/");
        if (indexSafari >= 0) {
          var version = navigator.userAgent.substring(indexSafari + 7);
          if (parseInt(version, 10) < 400) {
            if (dwr.engine._allowGetForSafariButMakeForgeryEasier == "true") {
              httpMethod = "GET";
            }
            else {
              dwr.engine._handleWarning(batch, {
                name: "dwr.engine.oldSafari",
                message: "Safari GET support disabled. See getahead.org/dwr/server/servlet and allowGetForSafariButMakeForgeryEasier."
              });
            }
          }
        }

        batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
        var request = dwr.engine.batch.constructRequest(batch, httpMethod);

        try {
          batch.req.open(httpMethod, request.url, batch.async);
          try {
            for (var prop in batch.headers) {
              var value = batch.headers[prop];
              if (typeof value == "string") {
                batch.req.setRequestHeader(prop, value);
              }
            }
            if (!batch.headers["Content-Type"]) {
              batch.req.setRequestHeader("Content-Type", "text/plain");
            }
          }
          catch (ex) {
            dwr.engine._handleWarning(batch, ex);
          }

          batch.req.send(request.body);
          if (batch.async == false) {
            dwr.engine.transport.xhr.stateChange(batch);
          }
        }
        catch (ex) {
          dwr.engine._handleError(batch, ex);
        }

        if (batch.isPoll && batch.map.partialResponse == dwr.engine._partialResponseYes) {
          dwr.engine.transport.xhr.checkCometPoll();
        }

        // This is only of any use in sync mode to return the reply data
        return batch.reply;
      },

      /**
       * Called by XMLHttpRequest to indicate that something has happened
       * @private
       * @param {Object} batch The current remote operation
       */
      stateChange:function(batch) {
        var toEval;

        if (batch.completed) {
          dwr.engine._debug("Error: _stateChange() with batch.completed");
          return;
        }

        // Try to get the response HTTP status if applicable
        var req = batch.req;
        var status = 0;
        try {
          if (req.readyState >= 2) {
            status = req.status; // causes Mozilla to except on page moves
          }
        }
        catch(ignore) {}

        // If we couldn't get the status we bail out, unless the request is
        // complete, which means error (handled further below)
        if (status == 0 && req.readyState < 4) {
          return;
        }

        // If the status is 200, we are now online. 
        // Future improvement per Mike W. - A solution where we only use the callbacks/handlers of the poll call to trigger 
        // the retry handling would be ideal.  We would need something like a new internal callback that reports 
        // progress back to the caller, and the design should be compatible with getting it to work with iframes as well.   
        if (status == 200 && !dwr.engine._pollOnline) {
          dwr.engine._handlePollStatusChange(true);    
        }  

        // The rest of this function only deals with request completion
        if (req.readyState != 4) {
          return;
        }

        if (dwr.engine._unloading && !dwr.engine.isJaxerServer) {
          dwr.engine._debug("Ignoring reply from server as page is unloading.");
          return;
        }

        try {
          var reply = req.responseText;
          reply = dwr.engine._replyRewriteHandler(reply);

          if (status != 200) {
            dwr.engine._handleError(batch, { name:"dwr.engine.http." + status, message:req.statusText });
          }
          else if (reply == null || reply == "") {
            dwr.engine._handleError(batch, { name:"dwr.engine.missingData", message:"No data received from server" });
          }
          else {                     
            var contentType = req.getResponseHeader("Content-Type");
            if (dwr.engine.isJaxerServer) {
              // HACK! Jaxer does something b0rken with Content-Type
              contentType = "text/javascript";
            }
            if (!contentType.match(/^text\/plain/) && !contentType.match(/^text\/javascript/)) {
              if (contentType.match(/^text\/html/) && typeof batch.textHtmlHandler == "function") {
                batch.textHtmlHandler({ status:status, responseText:reply, contentType:contentType });
              }
              else {
                dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidMimeType", message:"Invalid content type: '" + contentType + "'" });
              }
            }
            else {
             // Comet replies might have already partially executed
             if (batch.isPoll && batch.map.partialResponse == dwr.engine._partialResponseYes) {
                dwr.engine.transport.xhr.processCometResponse(reply, batch);
              }
              else {
                if (reply.search("//#DWR") == -1) {
                  dwr.engine._handleWarning(batch, { name:"dwr.engine.invalidReply", message:"Invalid reply from server" });
                }
                else {
                  toEval = reply;
                }
              }
            }
          }
        }
        catch (ex) {
          dwr.engine._handleWarning(batch, ex);
        }

        // Outside of the try/catch so errors propagate normally:
        dwr.engine._receivedBatch = batch;
        if (toEval != null) toEval = toEval.replace(dwr.engine._scriptTagProtection, "");
        dwr.engine._eval(toEval);
        dwr.engine._receivedBatch = null;
        dwr.engine.transport.complete(batch);
      },

      /**
       * Check for reverse Ajax activity
       * @private
       */       
      checkCometPoll:function() {
        var req = dwr.engine._pollBatch && dwr.engine._pollBatch.req;
        if (req) {         
          var text = req.responseText;
          if (text != null) {
            dwr.engine.transport.xhr.processCometResponse(text, dwr.engine._pollBatch);
          }          
        }      
        // If the poll resources are still there, come back again
        if (dwr.engine._pollBatch) {
          setTimeout(dwr.engine.transport.xhr.checkCometPoll, dwr.engine._pollCometInterval);
        }
      },

      /**
       * Some more text might have come in, test and execute the new stuff.
       * This method could also be called by the iframe transport
       * @private
       * @param {Object} response from xhr.responseText
       * @param {Object} batch The batch that the XHR object pertains to
       */
      processCometResponse:function(response, batch) {
        if (batch.charsProcessed == response.length) return;
        if (response.length == 0) {
          batch.charsProcessed = 0;
          return;
        }

        var firstStartTag = response.indexOf("//#DWR-START#", batch.charsProcessed);
        if (firstStartTag == -1) {
          // dwr.engine._debug("No start tag (search from " + batch.charsProcessed + "). skipping '" + response.substring(batch.charsProcessed) + "'");
          batch.charsProcessed = response.length;
          return;
        }
        // if (firstStartTag > 0) {
        //   dwr.engine._debug("Start tag not at start (search from " + batch.charsProcessed + "). skipping '" + response.substring(batch.charsProcessed, firstStartTag) + "'");
        // }

        var lastEndTag = response.lastIndexOf("//#DWR-END#");
        if (lastEndTag == -1) {
          // dwr.engine._debug("No end tag. unchanged charsProcessed=" + batch.charsProcessed);
          return;
        }

        // Skip the end tag too for next time, remembering CR and LF
        if (response.charCodeAt(lastEndTag + 11) == 13 && response.charCodeAt(lastEndTag + 12) == 10) {
         batch.charsProcessed = lastEndTag + 13;
        }
        else {
          batch.charsProcessed = lastEndTag + 11;
        }

        var exec = response.substring(firstStartTag + 13, lastEndTag);

        try {
          dwr.engine._receivedBatch = batch;
          dwr.engine._eval(exec);
          dwr.engine._receivedBatch = null;
        }
        catch (ex) {
          // This is one of these annoying points where we might be executing
          // while the window is being destroyed. If dwr == null, bail out.
          if (dwr != null) {
            dwr.engine._handleError(batch, ex);
          }
        }
      },

      /**
       * Aborts ongoing request (for timeouts etc)
       */
      abort:function(batch) {
        if (batch.req) {
          batch.req.abort();
        }
      },
      
      /**
       * Tidy-up when an XHR call is done
       * @param {Object} batch
       */
      remove:function(batch) {
        // XHR tidyup: avoid IE handles increase
        if (batch.req) {
          delete batch.req;
        }
      }
    },

    /**
     * Functions for remoting through IFrame
     */
    iframe:{
      /**
       * The default HTTP method to use
       */
      httpMethod:"POST",

      /**
       * Setup a batch for transfer through IFrame
       * @param {Object} batch The batch to alter for IFrame transmit
       */
      send:function(batch) {
        if (document.body == null) {
          setTimeout(function(){dwr.engine.transport.iframe.send(batch);}, 100);
          return;
        }
        batch.httpMethod = dwr.engine.transport.iframe.httpMethod;
        if (batch.fileUpload) {
          batch.httpMethod = "POST";
          batch.encType = "multipart/form-data";
        }
        var idname = dwr.engine.transport.iframe.getId(batch);
        batch.div1 = document.createElement("div");
        document.body.appendChild(batch.div1);
        batch.div1.innerHTML = "<iframe src='" + dwr.engine.SSL_SECURE_URL + "' frameborder='0' style='width:0px;height:0px;border:0;display:none;' id='" + idname + "' name='" + idname + "'></iframe>";
        batch.iframe = batch.div1.firstChild;
        batch.document = document;
        batch.iframe.batch = batch;
        dwr.engine.transport.iframe.beginLoader(batch, idname);
      },

      /**
       * Create a unique ID so multiple iframes can fire at the same time
       * @param {Object} batch A source of a unique number for the batch
       * @return {String} a name prefix for created elements
       */
      getId:function(batch) {
        return batch.isPoll ? "dwr-if-poll-" + batch.map.batchId : "dwr-if-" + batch.map.batchId;
      },

      /**
       * Setup a form or construct a src attribute to use the iframe.
       * This is abstracted from send() because the same logic will do for htmlfile
       * @param {Object} batch
       */
      beginLoader:function(batch, idname) {
        if (batch.iframe.contentWindow.document.body == null) {
          setTimeout(function(){dwr.engine.transport.iframe.beginLoader(batch, idname);}, 100);
          return;
        }
        if (batch.isPoll) {
          batch.map.partialResponse = dwr.engine._partialResponseYes;
        }
        batch.mode = batch.isPoll ? dwr.engine._ModeHtmlPoll : dwr.engine._ModeHtmlCall;
        var request = dwr.engine.batch.constructRequest(batch, batch.httpMethod);
        if (batch.httpMethod == "GET") {
          batch.iframe.setAttribute("src", request.url);
        }
        else {
          // TODO: On firefox we can now get the values of file fields, maybe we should use this
          // See http://soakedandsoaped.com/articles/read/firefox-3-native-ajax-file-upload
          // setting enctype via the DOM does not work in IE, create the form using innerHTML instead
          batch.div2 = document.createElement("div");
          document.body.appendChild(batch.div2);
          batch.div2.innerHTML = "<form" + (batch.encType ? " encType='" + batch.encType + "' encoding='" + batch.encType + "'" : "") + "></form>";
          batch.form = batch.div2.firstChild;
          batch.form.setAttribute("action", request.url);
          batch.form.setAttribute("target", idname);
          batch.form.setAttribute("style", "display:none");
          batch.form.setAttribute("method", batch.httpMethod);
          for (var prop in batch.map) {
            var value = batch.map[prop];
            if (typeof value != "function") {
              if (value && value.tagName && value.tagName.toLowerCase() == "input" && value.type && value.type.toLowerCase() == "file") {
                // Since we can not set the value of a file object, we must post the actual file object
                // that the user clicked browse on. We will put a clone in it's place.
                var clone = value.cloneNode(true);
                value.removeAttribute("id", prop);
                value.setAttribute("name", prop);
                value.style.display = "none";
                value.parentNode.insertBefore(clone, value);
                value.parentNode.removeChild(value);
                batch.form.appendChild(value);
              } else {
                var formInput = batch.document.createElement("input");
                formInput.setAttribute("type", "hidden");
                formInput.setAttribute("name", prop);
                formInput.setAttribute("value", value);
                batch.form.appendChild(formInput);
              }
            }
          }
          batch.form.submit();
        }
      },

      /**
       * Functions designed to be called by the server
       */
      remote:{
        /**
         * Called by the server: An IFrame reply is about to start
         * @private
         * @param {Object} iframe
         * @param {int} batchId
         */
        beginIFrameResponse:function(iframe, batchId) {
          if (iframe != null) dwr.engine._receivedBatch = iframe.batch;
        },

        /**
         * Called by the server: An IFrame reply is just completing
         * @private
         * @param {int} batchId
         */
        endIFrameResponse:function(batchId) {
          dwr.engine._receivedBatch = dwr.engine._batches[batchId];
          dwr.engine.transport.complete(dwr.engine._receivedBatch);
          dwr.engine._receivedBatch = null;
        }
      },

      remove:function(batch) {
        // Safari 3 and Chrome 1 will show endless loading spinner if removing 
        // iframe during execution of iframe script, so we delay it a bit
        setTimeout(function(){
          if (batch.iframe && batch.iframe.parentNode) {
            batch.iframe.parentNode.removeChild(batch.iframe);
            batch.iframe = null;
          }
          if (batch.div1 && batch.div1.parentNode) {
            batch.div1.parentNode.removeChild(batch.div1);
            batch.div1 = null;
          }
          if (batch.form && batch.form.parentNode) {
            batch.form.parentNode.removeChild(batch.form);
            batch.form = null;
          }
          if (batch.div2 && batch.div2.parentNode) {
            batch.div2.parentNode.removeChild(batch.div2);
            batch.div2 = null;
          }
        }, 100);
      }

      /*
      // If we have an iframe comet solution where we need to read data streamed
      // into an iframe then we need code like this to slurp the data out.
      // Compare this with xhr.checkCometPoll()
      outstandingIFrames:[],

      checkCometPoll:function() {
        for (var i = 0; i < dwr.engine.transport.iframe.outstandingIFrames.length; i++) {
          var text = "";
          var iframe = dwr.engine.transport.iframe.outstandingIFrames[i];
          try {
            text = dwr.engine.transport.iframe.getTextFromCometIFrame(iframe);
          }
          catch (ex) {
            dwr.engine._handleWarning(iframe.batch, ex);
          }
          if (text != "") dwr.engine.transport.xhr.processCometResponse(text, iframe.batch);
        }

        if (dwr.engine.transport.iframe.outstandingIFrames.length > 0) {
          setTimeout(dwr.engine.transport.iframe.checkCometPoll, dwr.engine._pollCometInterval);
        }
      }

      // We probably also need to update dwr.engine.remote.beginIFrameResponse()
      // to call checkCometPoll.

      // Extract the whole (executed and all) text from the current iframe
      getTextFromCometIFrame:function(frameEle) {
        var body = frameEle.contentWindow.document.body;
        if (body == null) return "";
        var text = body.innerHTML;
        // We need to prevent IE from stripping line feeds
        if (text.indexOf("<PRE>") == 0 || text.indexOf("<pre>") == 0) {
          text = text.substring(5, text.length - 7);
        }
        return text;
      };

      // And an addition to iframe.remove():
      {
        if (batch.iframe) {
          // If this is a poll frame then stop comet polling
          for (var i = 0; i < dwr.engine.transport.iframe.outstandingIFrames.length; i++) {
            if (dwr.engine.transport.iframe.outstandingIFrames[i] == batch.iframe) {
              dwr.engine.transport.iframe.outstandingIFrames.splice(i, 1);
            }
          }
        }
      }
      */
    },

    /**
     * Functions for remoting through Script Tags
     */
    scriptTag:{
      /**
       * Setup a batch for transfer through a script tag
       * @param {Object} batch The batch to alter for script tag transmit
       */
      send:function(batch) {
        if (batch.isPoll) {
          batch.map.partialResponse = dwr.engine._partialResponseNo;
        }
        batch.mode = batch.isPoll ? dwr.engine._ModePlainPoll : dwr.engine._ModePlainCall;
        var request = dwr.engine.batch.constructRequest(batch, "GET");
        // The best option is DOM manipulation
        batch.script = document.createElement("script");
        batch.script.id = "dwr-st-" + batch.map.batchId;
        batch.script.src = request.url;
        batch.script.type = "text/javascript";
        batch.script.async = true;
        dwr.engine.util.addEventListener(batch.script, "load", function(ev) {
          if (typeof dwr != "undefined") dwr.engine.transport.scriptTag.complete(batch);
        });
        dwr.engine.util.addEventListener(batch.script, "error", function(ev) {
          if (typeof dwr != "undefined") dwr.engine.transport.scriptTag.complete(batch);
        });
        dwr.engine.util.addEventListener(batch.script, "readystatechange", function(ev) {
          if (typeof dwr != "undefined") {
            if (batch.script.readyState == "complete" || batch.script.readyState == "loaded") {
              dwr.engine.transport.scriptTag.complete(batch);
            }
          }
        });
        document.getElementsByTagName("head")[0].appendChild(batch.script);
      },

      /**
       * Notified when the script tag has been loaded and executed
       */
      complete:function(batch) {
        dwr.engine.transport.complete(batch);
      },
      
      /**
       * Cleanup script tag
       */
      remove:function(batch) {
        // Bail out if we were already called
        if (!batch.script) return;
        
        // Cleanup script tag
        batch.script.parentNode.removeChild(batch.script);
        batch.script = null;
      }
    },

    /**
     * Remoting through IE's htmlfile ActiveX control
     */
    htmlfile:{
      /**
       * Setup a batch for transfer through htmlfile
       * @param {Object} batch The batch to alter for htmlfile transmit
       */
      send:function(batch) {
        var idname = dwr.engine.transport.iframe.getId(batch);
        batch.htmlfile = new window.ActiveXObject("htmlfile");
        batch.htmlfile.open();
        batch.htmlfile.write("<" + "html>");
        batch.htmlfile.write("<div><iframe className='wibble' src='javascript:void(0)' id='" + idname + "' name='" + idname + "' onload='dwr.engine.transport.iframe.loadingComplete(" + batch.map.batchId + ");'></iframe></div>");
        batch.htmlfile.write("</" + "html>");
        batch.htmlfile.close();
        batch.htmlfile.parentWindow.dwr = dwr;
        batch.document = batch.htmlfile;

        dwr.engine.transport.iframe.beginLoader(batch, idname);
      }
    }
  };

  /**
   * Functions to manipulate batches
   * @private
   */
  dwr.engine.batch = {
    /**
     * Generate a new standard batch
     * @private
     */
    create:function() {
      var batch = {
        async:dwr.engine._async,
        charsProcessed:0,
        handlers:[],
        isPoll:false,
        map:{ callCount:0, windowName:window.name },
        paramCount:0,
        preHooks:[],
        postHooks:[],
        timeout:dwr.engine._timeout,
        errorHandler:dwr.engine._errorHandler,
        warningHandler:dwr.engine._warningHandler,
        textHtmlHandler:dwr.engine._textHtmlHandler
      };

      if (dwr.engine._preHook) {
        batch.preHooks.push(dwr.engine._preHook);
      }
      if (dwr.engine._postHook) {
        batch.postHooks.push(dwr.engine._postHook);
      }

      dwr.engine.batch.populateHeadersAndAttributes(batch);
      return batch;
    },

    /**
     * Generate a new batch for polling
     * @private
     * @see dwr.engine.batch.create()
     */
    createPoll:function() {
      var batch = {
        async:true,
        charsProcessed:0,
        handlers:[{
          callback:function(pause) {  
            dwr.engine._pollBatch = null;
            setTimeout(dwr.engine._poll, pause);
          }
        }],
        isPoll:true,
        map:{ windowName:window.name, callCount:1 },
        paramCount:0,
        path:dwr.engine._pathToDwrServlet,
        preHooks:[],
        postHooks:[],
        timeout:0,
        windowName:window.name
      };     
      dwr.engine.batch.populateHeadersAndAttributes(batch);
      return batch;
    },

    /**
     * Copy the global headers and parameters into this batch object
     * @private
     * @param {Object} batch The destination
     */
    populateHeadersAndAttributes:function(batch) {
      var propname, data;
      batch.headers = {};
      if (dwr.engine._headers) {
        for (propname in dwr.engine._headers) {
          data = dwr.engine._headers[propname];
          if (typeof data != "function") batch.headers[propname] = data;
        }
      }
      batch.attributes = {}; // props to add as request attributes
      if (dwr.engine._attributes) {
        for (propname in dwr.engine._attributes) {
          data = dwr.engine._attributes[propname];
          if (typeof data != "function") batch.attributes[propname] = data;
        }
      }
    },

    /**
     * Augment this batch with a new call
     * @private
     */
    addCall:function(batch, scriptName, methodName, args) {
      // From the other params, work out which is the function (or object with
      // call meta-data) and which is the call parameters
      var callData, stopAt;
      var lastArg = args[args.length - 1];
      if (lastArg == null || typeof lastArg == "function") {
        callData = { callback:lastArg };
        stopAt = args.length - 1;
      }
      else if (typeof lastArg == "object" && (typeof lastArg.callback == "function"
        || typeof lastArg.exceptionHandler == "function" || typeof lastArg.callbackHandler == "function"
        || typeof lastArg.errorHandler == "function" || typeof lastArg.warningHandler == "function" )) {
        callData = lastArg;
        stopAt = args.length - 1;
      }
      else {
        callData = {};
        stopAt = args.length;
      }

      // Merge from the callData into the batch
      dwr.engine.batch.merge(batch, callData);
      batch.handlers[batch.map.callCount] = {
        exceptionHandler:callData.exceptionHandler,
        exceptionArg:callData.exceptionArg || callData.arg || null,
        exceptionScope:callData.exceptionScope || callData.scope || window,
        callback:callData.callbackHandler || callData.callback,
        callbackArg:callData.callbackArg || callData.arg || null,      
        callbackScope:callData.callbackScope || callData.scope || window          
      };

      // Copy to the map the things that need serializing
      var prefix = "c" + batch.map.callCount + "-";
      batch.map[prefix + "scriptName"] = scriptName;
      batch.map[prefix + "methodName"] = methodName;
      batch.map[prefix + "id"] = batch.map.callCount;
      var directrefmap = {}, otherrefmap = {};
      for (var i = 0; i < stopAt; i++) {
        dwr.engine.serialize.convert(batch, directrefmap, otherrefmap, args[i], prefix + "param" + i, 0);
      }
      dwr.engine.serialize.cleanup(directrefmap);
    },

    /**
     * Take further options and merge them into a batch
     * @private
     * @param {Object} batch The batch that we are altering
     * @param {Object} overrides The object containing properties to copy into batch
     */
    merge:function(batch, overrides) {
      var propname, data;
      for (var i = 0; i < dwr.engine._propnames.length; i++) {
        propname = dwr.engine._propnames[i];
        if (overrides[propname] != null) batch[propname] = overrides[propname];
      }
      if (overrides.preHook != null) batch.preHooks.unshift(overrides.preHook);
      if (overrides.postHook != null) batch.postHooks.push(overrides.postHook);
      if (overrides.headers) {
        for (propname in overrides.headers) {
          data = overrides.headers[propname];
          if (typeof data != "function") batch.headers[propname] = data;
        }
      }
      var attrs = null;
      if (overrides.attributes) attrs = overrides.attributes;
      if (attrs) {  
        for (propname in attrs) {
          data = attrs[propname];
          if (typeof data != "function") batch.attributes[propname] = data;
        }
      }      
    },

    /**
     * Executed just before a transport sends the batch
     * @private
     * @param {Object} batch The batch to prepare for sending
     */
    prepareToSend:function(batch) {
      batch.map.batchId = dwr.engine._nextBatchId;
      dwr.engine._nextBatchId++;
      dwr.engine._batches[batch.map.batchId] = batch;
      dwr.engine._batchesLength++;
      batch.completed = false;
      batch.map.instanceId = dwr.engine._instanceId;

      // security details are filled in late so previous batches have completed
      batch.map.page = encodeURIComponent(window.location.pathname + window.location.search);
      batch.map.scriptSessionId = dwr.engine._scriptSessionId;
      batch.map.windowName = window.name;

      for (var i = 0; i < batch.preHooks.length; i++) {
        batch.preHooks[i]();
      }
      batch.preHooks = null;
      // Set a timeout
      if (batch.timeout && batch.timeout != 0) {
        batch.timeoutId = setTimeout(function() { dwr.engine.transport.abort(batch); }, batch.timeout);
      }
    },

    /**
     * Work out what the URL should look like
     * @private
     * @param {Object} batch the data that we are sending
     * @param {Object} httpMethod Are we using GET/POST etc?
     */
    constructRequest:function(batch, httpMethod) {
      // A quick string to help people that use web log analysers
      var urlBuffer = [];
      urlBuffer.push(batch.path);
      urlBuffer.push(batch.mode);
      if (batch.isPoll) {
        urlBuffer.push("ReverseAjax.dwr");
      }
      else if (batch.map.callCount == 1) {
        urlBuffer.push(batch.map["c0-scriptName"]);
        urlBuffer.push(".");
        urlBuffer.push(batch.map["c0-methodName"]);
        urlBuffer.push(".dwr");
      }
      else {
        urlBuffer.push("Multiple.");
        urlBuffer.push(batch.map.callCount);
        urlBuffer.push(".dwr");
      }
      // Play nice with url re-writing
      var sessionMatchExpr = new RegExp(
        "^"               // start of string
        + "[^;\\?#]+"     // protocol, host, and path (up to first of ; ? or #)
        + "(;[^\\?#]+)"); // group 1: ; and sessionid (up to first of ? or #)
      var sessionMatch = location.href.match(sessionMatchExpr); 
      if (sessionMatch != null) { 
        urlBuffer.push(sessionMatch[1]); 
      }

      // Add attributes to the output map
      if (batch.attributes) {
        for (var attrname in batch.attributes) {
          var data = batch.attributes[attrname];
          if (typeof data != "function") batch.map["a-" + attrname] = "" + data;
        }
      }

      var request = {};
      var prop;
      if (httpMethod == "GET") {
        // Some browsers (Opera/Safari2) seem to fail to convert the callCount value
        // to a string in the loop below so we do it manually here.
        batch.map.callCount = "" + batch.map.callCount;
        urlBuffer.push("?");
        for (prop in batch.map) {
          if (typeof batch.map[prop] != "function") {
            urlBuffer.push(encodeURIComponent(prop));
            urlBuffer.push("=");
            urlBuffer.push(encodeURIComponent(batch.map[prop]));
            urlBuffer.push("&");
          }
        }
        urlBuffer.pop(); // remove the trailing &
        request.body = null;
      }
      else {
        // PERFORMANCE: for iframe mode this is thrown away.
        request.body = "";
        if (dwr.engine.isIE <= 7) {
          // Use array joining on IE1-7 (fastest)
          var buf = [];
          for (prop in batch.map) {
            if (typeof batch.map[prop] != "function") {
              buf.push(prop + "=" + batch.map[prop] + dwr.engine._postSeperator);
            }
          }
          request.body = buf.join("");
        }
        else {
          // Use string concat on other browsers (fastest)
          for (prop in batch.map) {
            if (typeof batch.map[prop] != "function") {
              request.body += prop + "=" + batch.map[prop] + dwr.engine._postSeperator;
            }
          }
        }
        request.body = dwr.engine._contentRewriteHandler(request.body);
      }
      request.url = dwr.engine._urlRewriteHandler(urlBuffer.join(""));
      return request;
    },

    /**
     * @private This function is invoked when a batch reply is received.
     * It checks that there is a response for every call in the batch. Otherwise,
     * an error will be signaled (a call without a response indicates that the
     * server failed to send complete batch response).
     */
    validate:function(batch) {
      // If some call left unreplied, report an error.
      if (!batch.completed) {
        for (var i = 0; i < batch.map.callCount; i++) {
          if (batch.handlers[i].completed !== true) {
            dwr.engine._handleError(batch, { name:"dwr.engine.incompleteReply", message:"Incomplete reply from server" });
            break;
          }
        }
      }
    },

    /**
     * A call has finished by whatever means and we need to shut it all down.
     * @private
     * @param {Object} batch The batch that we are altering
     */
    remove:function(batch) {
      if (!batch) {
        dwr.engine._debug("Warning: null batch in dwr.engine.batch.remove()", true);
        return;
      }

      if (batch.completed) {
        return;
      }
      batch.completed = true;

      // Transport tidyup
      dwr.engine.transport.remove(batch);

      // Timeout tidyup
      if (batch.timeoutId != null) {
        clearTimeout(batch.timeoutId);
        delete batch.timeoutId;
      }

      // TODO: co-locate all the functions that work on a set of batches
      if (batch.map && (batch.map.batchId || batch.map.batchId == 0)) {
        delete dwr.engine._batches[batch.map.batchId];
        dwr.engine._batchesLength--;
      }

      // If there is anything on the queue waiting to go out, then send it.
      // We don't need to check for ordered mode, here because when ordered mode
      // gets turned off, we still process *waiting* batches in an ordered way.
      if (dwr.engine._batchQueue.length != 0) {
        var sendbatch = dwr.engine._batchQueue.shift();
        dwr.engine.transport.send(sendbatch);
      }
    }
  };

  /**
   * Various utility functions
   * @private
   */
  dwr.engine.util = {
    /**
     * Create one of a number of ActiveX strings
     * @param {Object} axarray An array of strings to attempt to create ActiveX objects from
     */
    newActiveXObject:function(axarray) {
      var returnValue;
      for (var i = 0; i < axarray.length; i++) {
        try {
          returnValue = new ActiveXObject(axarray[i]);
          break;
        }
        catch (ex) { /* ignore */ }
      }
      return returnValue;
    },

    /**
     * Transform a number into a token string suitable for ids
     */
    tokenify: function(number) {
      var tokenbuf = [];
      var charmap = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*$";
      var remainder = number;
      while (remainder > 0)
      {
        tokenbuf.push(charmap.charAt(remainder & 0x3F));
        remainder = Math.floor(remainder / 64); // Can't use shift operator due to 32-bit limit in JS
      }
      return tokenbuf.join("");
    },
    
    addEventListener: function(elem, name, func) {
      if (elem.addEventListener)
        elem.addEventListener(name, func, false);
      else
        elem.attachEvent("on" + name, func);
    }
  };

  /**
   * Work out what type of browser we are working on
   */

  var userAgent = navigator.userAgent;
  var versionString = navigator.appVersion;
  var version = parseFloat(versionString);

  dwr.engine.isOpera = (userAgent.indexOf("Opera") >= 0) ? version : 0;
  dwr.engine.isKhtml = (versionString.indexOf("Konqueror") >= 0) || (versionString.indexOf("Safari") >= 0) ? version : 0;
  dwr.engine.isSafari = (versionString.indexOf("Safari") >= 0) ? version : 0;
  dwr.engine.isJaxerServer = (window.Jaxer && Jaxer.isOnServer);

  var geckoPos = userAgent.indexOf("Gecko");
  dwr.engine.isMozilla = ((geckoPos >= 0) && (!dwr.engine.isKhtml)) ? version : 0;

  dwr.engine.isFF = 0;
  dwr.engine.isIE = 0;
  try {
    if (dwr.engine.isMozilla) {
      dwr.engine.isFF = parseFloat(userAgent.split("Firefox/")[1].split(" ")[0]);
    }
    if ((document.all) && (!dwr.engine.isOpera)) {
      dwr.engine.isIE = parseFloat(versionString.split("MSIE ")[1].split(";")[0]);
    }
  }
  catch(ex) { }

  /*
   * Other load-time initializations
   */

  // Make random local page id
  dwr.engine._pageId = dwr.engine.util.tokenify(new Date().getTime()) + "-" + dwr.engine.util.tokenify(Math.random() * 1E16);

  // Reuse any existing dwr session
  dwr.engine.transport.updateDwrSessionFromCookie();

  // Register the unload handler
  if (!dwr.engine.isJaxerServer) {
    dwr.engine.util.addEventListener(window, 'unload', dwr.engine._unloader);
  }

  // Set up a receiver context for this engine instance
  var g = dwr.engine._global;
  if (!g.dwr) {
    g.dwr = {};
  }
  if (!g.dwr._) {
    g.dwr._ = [];
  }
  dwr.engine._instanceId = g.dwr._.length;
  g.dwr._[dwr.engine._instanceId] = {
    handleCallback: dwr.engine.remote.handleCallback,
    handleException: dwr.engine.remote.handleException,
    handleNewWindowName: dwr.engine.remote.handleNewWindowName,
    handleBatchException: dwr.engine.remote.handleBatchException,
    handleFunctionCall: dwr.engine.remote.handleFunctionCall,
    handleObjectCall: dwr.engine.remote.handleObjectCall,
    handleSetCall: dwr.engine.remote.handleSetCall,
    handleFunctionClose: dwr.engine.remote.handleFunctionClose,
    handleObjectCall: dwr.engine.remote.handleObjectCall,
    handleForeign: dwr.engine.remote.handleForeign,
    pollCometDisabled: dwr.engine.remote.pollCometDisabled,
    newObject: dwr.engine.remote.newObject,
    toDomElement: dwr.engine.serialize.toDomElement,
    toDomDocument: dwr.engine.serialize.toDomDocument,
    beginIFrameResponse: dwr.engine.transport.iframe.remote.beginIFrameResponse,
    endIFrameResponse: dwr.engine.transport.iframe.remote.endIFrameResponse,
    _eval: dwr.engine._eval
  };

  /*
   * Run page init code as desired by server
   */

  eval("${initCode}");
  
  /**
   * Routines for the DWR pubsub hub
   */
  dwr.hub = {
    /**
     * Publish some data to a given topic
     * @param {Object} topicName The topic to publish to
     * @param {Object} data The data to publish
     */
    publish:function(topicName, data) {
      dwr.engine._execute(dwr.engine._pathToDwrServlet, '__System', 'publish', topicName, data, {});
    },

    /**
     * Subscribe to get notifications of publish events to a given topic
     * @param {String} topicName The topic to subscribe to
     * @param {Function} callback The function to call when a publish happens
     * @param {Object} scope The 'this' object on which the callback executes (optional)
     * @param {Object} subscriberData Data that the subscriber wishes to remember (optional)
     * @return An opaque type for use with unsubscribe
     */
    subscribe:function(topicName, callback, scope, subscriberData) {
      var subscription = "" + dwr.hub._subscriptionId;
      dwr.hub._subscriptionId++;
      dwr.hub._subscriptions[subscription] = {
        callback:callback,
        scope:scope,
        subscriberData:subscriberData
      };
      dwr.engine._execute(dwr.engine._pathToDwrServlet, '__System', 'subscribe', topicName, subscription, {});
      return subscription;
    },

    /**
     * Called by the server: A publish event has happened that we care about
     * @private
     * @param {Object} subscriptionId
     * @param {Object} publishData
     */
    _remotePublish:function(subscriptionId, publishData) {
      var subscriptionData = dwr.hub._subscriptions[subscriptionId];
      if (!subscriptionData) return;
      subscriptionData.callback.call(subscriptionData.scope, publishData, subscriptionData.subscriberData);
    },

    /**
     * Each time we subscribe to something, we use a unique number
     */
    _subscriptionId:0,

    /**
     * We need to remember what we are subscribed to so we can recall the callback
     */
    _subscriptions:{}
  };

/**
 * High level data-sync API for use by Widget libraries like a Dojo-Data-Store.
 * For full documentation see org.directwebremoting.export.Data
 */
dwr.data = {

  /**
   * This is just documentation that defines how the listener parameter must act
   * in order to receive asynchronous updates
   */
  StoreChangeListener:{
    /**
     * Something has removed an item from the store
     * @param {StoreProvider} source The store from which it was moved
     * @param {string} itemId The ID of the item
     */
    itemRemoved:function(source, itemId) { },

    /**
     * Something has added an item to the store
     * @param {StoreProvider} source The store from which it was moved
     * @param {Item} item The thing that has changed
     */
    itemAdded:function(source, item) { },

    /**
     * Something has updated an item in the store
     * @param {StoreProvider} source The store from which it was moved
     * @param {Item} item The thing that has changed
     * @param {string[]} changedAttributes A list of changed attributes. If null then
     * you should assume that everything has changed
     */
    itemChanged:function(source, item, changedAttributes) { }
  },

  /**
   * Create a cache object containing the functions to interact with a server
   * side StoreProvider
   * @param {string} storeId ID of server provided storage
   * @param {dwr.data.StoreChangeListener} listener See server documentation
   * This is likely to be true if dwr.engine.activeReverseAjax == true
   */
  Cache:function(storeId, listener) {
    this.storeId = storeId;
    this.listener = listener;
  }
};

  /**
   * Notes that there is a region of a page that wishes to subscribe to server
   * side data and registers a callback function to receive the data.
   * @param {Object} region filtering and sorting options. Includes:
   * - start: The beginning of the region of specific interest
   * - count: The number of items being viewed
   * - sort: The sort criteria
   * - query: The filter criteria
   * @param {function|object} callbackObj A standard DWR callback object
   * @return 
   */
  dwr.data.Cache.prototype.viewRegion = function(region, callbackObj) {
    if (!region) region = { };
    if (!region.start) region.start = 0;
    if (!region.count) region.count = -1;
    if (!region.sort) region.sort = [];
    else {
      for (var index = 0; index < region.sort.length; index++) {
        if (typeof region.sort[index].descending == "undefined") {
          region.sort[index].descending = false;
        }
      }
    }
    if (!region.query) region.query = {};

    return dwr.engine._execute(dwr.engine._pathToDwrServlet, '__Data', 'viewRegion', [ this.storeId, region, this.listener, callbackObj ]);
  };

  /**
   * As dwr.data.Cache.viewRegion() except that we only want to see a single item.
   * @param {string} itemId ID of object within the given store
   * @param {function|object} callbackObj A standard DWR callback object
   */
  dwr.data.Cache.prototype.viewItem = function(itemId, callbackObj) {
    return dwr.engine._execute(dwr.engine._pathToDwrServlet, '__Data', 'viewItem', [ this.storeId, itemId, this.listener, callbackObj ]);
  };

  /**
   * Undo the action of dwr.data.view()
   * @param {function|object} callbackObj A standard DWR callback object
   */
  dwr.data.Cache.prototype.unsubscribe = function(callbackObj) {
    if (this.listener) {
      return dwr.engine._execute(dwr.engine._pathToDwrServlet, '__Data', 'unsubscribe', [ this.storeId, this.listener, callbackObj ]);
    }
  };

  /**
   * Request an update to server side data
   * @param {Object} items An array of update descriptions
   * @param {function|object} callbackObj A standard DWR callback object
   */
  dwr.data.Cache.prototype.update = function(items, callbackObj) {
    return dwr.engine._execute(dwr.engine._pathToDwrServlet, '__Data', 'update', [ this.storeId, items, callbackObj ]);
  };

})();
