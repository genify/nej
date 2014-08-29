var f = function(){
    var _  = NEJ.P,
        _f = NEJ.F,
        _u = _('nej.u'),
        _e = _('nej.e'),
        _p = _('nej.ui'),
        _proMyLayerCard,
        _supMyLayerCard;
    var _seed_html = _e._$addNodeTemplate('<div>您要展示的内容部分</div>');
    /**
     * 弹出层封装基类对象，主要实现层里面内容部分的业务逻辑
     * @class   弹出层封装基类对象
     * @extends {nej.ui._$$CardWrapper}
     * @param   {Object} _options 可选配置参数
     * 
     */
    _p._$$MyLayerCard = NEJ.C();
      _proMyLayerCard = _p._$$MyLayerCard._$extend(_p._$$MyCardWrapper);
      _supMyLayerCard = _p._$$MyLayerCard._$supro;
    
    _proMyLayerCard.__initXGui = function(){
        this.__seed_html = _seed_html;
    };
};
define('{pro}mylayercard.js',
      ['{pro}mylayerwrapper.js'],f);