var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _proMyCard,
        _supMyCard;
    var _seed_html = _e._$addNodeTemplate('<div>您要展示的内容部分</div>');
    /**
     * 弹出层封装基类对象，主要实现层里面内容部分的业务逻辑
     * @class   弹出层封装基类对象
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} _options 可选配置参数，已处理参数列表如下
     * 
     */
    _p._$$MyCard = NEJ.C();
      _proMyCard = _p._$$MyCard._$extend(_p._$$CardWrapper);
      _supMyCard = _p._$$MyCard._$supro;
    
    _proMyCard.__initXGui = function(){
        this.__seed_html = _seed_html;
    };
};
define('{pro}ui/mycard.js',
      ['{lib}ui/layer/card.wrapper.js'],f);