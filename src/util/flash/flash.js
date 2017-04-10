/*
 * ------------------------------------------
 * Flash对象支持实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
/** @module util/flash/flash */
NEJ.define([
    'base/global',
    'base/element',
    'base/event',
    'base/util',
    'util/template/jst',
    'util/timer/animation',
    '{platform}flash.js',
    'text!./flash.html'
],function(NEJ,_e,_v,_u,_t0,_t1,_h,_html,_p,_o,_f,_r){
    var _seed_html = _t0._$add(_html);
    /**
     * 页面嵌入flash，NEJ嵌入Flash如果需要同JS交互的遵循以下规则
     *
     *  1. Flash对象提供JS可访问接口 inited （返回Boolean值）
     *  2. 如果Flash未初始化完成inited返回为false
     *  3. 如果Flash初始化完成inited返回为true
     *  4. inited返回true表示Flash已完成所有初始化，此时JS可调用Flash的API
     *
     * Flash事件规则
     *
     *  1. JS中使用window.onflashevent监听flash中的事件（此步骤NEJ已封装）
     *  2. Flash通过flashvars参数输入当前flash的ID，如 &lt;param name="flashvars" value="id=ab&a=b"/&gt;
     *  3. Flash在需要触发事件时调用window.onflashevent回调函数，并输入一个Object作为参数,Object信息包括
     *     type   [String] - 鼠标事件类型，如click/mouseover/mouseout/play/pause...
     *     target [String] - 触发事件的flash标识，通过flashvars参数输入的id参数，做了encodeURIComponent，如a%23b
     *     ...
     *
     * 结构举例
     * ```html
     * <div id='flash'></div>
     * ```
     *
     * 脚本举例
     * ```javascript
     * NEJ.define([
     *     'util/flash/flash'
     * ],function(_e){
     *     // 生成flash对象，可以设置宽高，地址，父节点，flash参数在params中设置
     *     // flash需要提供inited接口，返回falsh已经准备好的状态
     *     _e._$flash({
     *         src:'../../qunit/res/FlexChart.swf',
     *         hidden:false,
     *         parent:'flash',
     *         width:900,
     *         height:600,
     *         params:{
     *             flashvars:'',
     *             wmode:'transparent',
     *             allowscriptaccess:'always'
     *         },
     *         onready:function(_flash){
     *             // 返回准备好的flash对象
     *             // 如果没有传入flash对象则表示无法识别到flash
     *         },
     *         oncustom:function(_event){
     *             // 自定义事件需Flash同JS预先协定好自定义事件名称，如这里的oncustom
     *             // Flash中通过调用JS的window.onflashevent({id:2222,type:'custom',...})调入此回调
     *         }
     *     });
     * });
     * ```
     *
     * @method   module:util/flash/flash._$flash
     * @param    {Object}      arg0    - 可选配置参数
     * @property {String}      src     - Flash文件地址，必须指定地址
     * @property {Boolean}     hidden  - Flash是否不可见
     * @property {Number}      width   - Flash显示宽度，设为不可见时可以不设此参数
     * @property {Number}      height  - Flash显示高度，设为不可见时可以不设此参数
     * @property {String|Node} parent  - 容器节点，默认为document.body
     * @property {Object}      params  - 设置参数，object标签中的param标签参数
     * @property {String|Node} target  - 触发事件的源节点
     * @property {Function}    onready - Flash初始化完毕触发事件，输入可交互的Flash对象
     * @return   {Void}
     */
    _p._$flash = (function(){
        var _cache = {},_title,
            _reg0 = /^(?:mouse.*|(?:dbl)?click)$/i;
        // flash event
        window.onflashevent = function(_event){
            var _id = decodeURIComponent(_event.target),
                _type = _event.type.toLowerCase();
            // check mouse event bubble
            var _target = _cache[_id+'-tgt'];
            if (!!_target&&_reg0.test(_type)){
                _doMouseEventBubble(
                    _target,_event
                );
            }
            // check id-type handler
            var _handler = _cache[_id+'-on'+_type];
            if (!!_handler){
                var _result = '';
                try{
                    _result = _handler(_event);
                }catch(e){
                    // ignore
                }
                return _result;
            }
        };
        // append flash element
        var _doInitDOM = function(_options){
            // bugfix for ie title with flash
            _title = document.title;
            var _parent = _e._$get(_options.parent)||document.body,
                _html = _t0._$get(_seed_html,_options);
            _parent.insertAdjacentHTML(
               !_options.hidden?'beforeEnd':'afterBegin',_html
            );
        };
        // listen flash mouse event
        var _doMouseEventBubble = function(_id,_event){
            var _type = _event.type.toLowerCase();
            _t1.requestAnimationFrame(function(){
                _v._$dispatchEvent(_id,_type);
            });
        };
        // check flash init state
        var _doCheckFlashInit = function(_flash){
            return !!_flash&&!!_flash.inited&&!!_flash.inited();
        };
        var _doCheckFlash = function(_id){
            var _arr = [document.embeds[_id],
                       _e._$get(_id),document[_id],window[_id]],
                _index = _u._$forIn(_arr,_doCheckFlashInit),
                _flash = _arr[_index],
                _ctkey = _id+'-count';
            _cache[_ctkey]++;
            // remove count check for chrome bug
            if (!!_flash){ // ||_cache[_ctkey]>100
                if (!!_title){
                    document.title = _title;
                    _title = null;
                }
                _cache[_id](_flash);
                delete _cache[_id];
                delete _cache[_ctkey];
                return;
            }
            window.setTimeout(_doCheckFlash._$bind(null,_id),300);
        };
        // init flash event
        var _doInitFlashEvent = function(_options){
            // init flash vars
            var _id = _options.id,
                _params = _options.params;
            if (!_params){
                _params = {};
                _options.params = _params;
            }
            var _vars = _params.flashvars||'';
            _vars += (!_vars?'':'&')+('id='+_id);
            // delegate mouse event bubble
            if (!_options.hidden&&(!!_options.target||
                 _h.__canFlashEventBubble(_params.wmode))){
                var _tid = _e._$id(_options.target)||
                           _e._$id(_options.parent);
                _cache[_id+'-tgt'] = _tid;
            }
            _params.flashvars = _vars;
            // check event callback
            _u._$loop(_options,function(_value,_key){
                if (_u._$isFunction(_value)&&_key!='onready'){
                    _cache[_id+'-'+_key] = _value;
                }
            });
        };
        return function(_options){
            _options = NEJ.X({},_options);
            if (!_options.src) return;
            var _id = '_'+_u._$uniqueID();
            _options.id = _id;
            // delegate event
            _doInitFlashEvent(_options);
            // append flash
            _doInitDOM(_options);
            // check flash ready
            if (!_options.onready) return;
            _cache[_id] = _options.onready;
            _cache[_id+'-count'] = 0;
            _doCheckFlash(_id);
        };
    })();

    if (CMPT){
        NEJ.copy(NEJ.P('nej.e'),_p);
    }

    return _p;
});