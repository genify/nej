/*
 * ------------------------------------------
 * 水平箭头控件实现文件
 * @version  1.0
 * @author   genify(caijf@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    // variable declaration
    var e = NEJ.P('nej.e'),
        p = NEJ.P('nej.ui'),
        __proArrowsX,
        __supArrowsX;
    if (!!p._$$ArrowsX) return;
    // ui css text
    var _seed_css = e._$pushCSSText('\
                     .#<uispace>{width:1.5em;height:4em;overflow:hidden;$<transition>-property:$<transform>;$<transition>-duration:200ms;$<transition>-timing-function:ease-out;background-size:1.5em 4em;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABPCAYAAAD84nXwAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAeAAAATwBb740oAAADW0lEQVRo3u3Zy4scVRTH8U/V1DCDg4+gQSXEZ0AIRs1CjBIEMYKIioqKBhUJUVHxsXDhuNKN4x8xC3f+D65EUERF0Z0YdKFuXKiYhWinu1zcW0wnqe66t7vGYbAP3E1X1fne37nn3FcXMu2t9zahxEvYh7fx97tvnszyU+aCox3E83gGR2dxkAWOai/AqxF+Jd7A5fHZtikucD8eRo0zuDMqX9oWcFR0PV7DxRhihGWcxG05qnMUr+A53ByVDmMb4Cq8gktS4Ung6OxuPCmEu1HbtCGO4QmUKfBOcHSyHy9jT1Q7cj54NYb80NyKI7TC0zgSwzqc0AY4gBex1qU6JdR3xBBrUdqm/F482OV74sPY471RwRXOTqhJ7QzW8AIOTFNdToGWeDwqHiRAx0N+A05gdRJ8WjhuwVNCnXaFuK09IGR6Gjj2cI9Qs/sy1Y6H/CIhy69uUz1J8X24K3Fcp4X8JhzH8rnws8Dx4cGxEM8KbdpIyPCjwsRzPjhC14SavW7GELeF/FI8i73jqssxKGFaPDZniNtCfhiPompYFYxGlKVr4nisRnCfVuIhfD4Y+BKK9Y1NWC0Kr+Oxc8eiRyvwcV17B79V8ccjde0eIRnqbQTfKkypH1TCWnpcqLtRywf1DJ0pWiJXC5XyCL6rhDH9BJ+1OBjFXh6e0Kk2K/EVvjB5nigrfB9bm9VCAja7jhSr8DXeNzlfiiohjKMIzcn0JjqTfNfVxvr0jfj6xmazzqaCC4y6/FYJjhrFwxxw10s54FlCvTvBta3FPRXaWfcp4D/xS4biKn4zN/hDfJQIbeyfPsCD2Hq1BHA962o1dZxTFN8unCJS63hJmPc/nRd8mbBPzgGf6nopBTwUkiUnqzs7uR1TZvPNfw5uJpwFePeAa3kbvqR3U8Cn8FcGuBAWlbnBP8fWq6WAl2Te2tk6N80FvlE45+bsq7/FN/OBayu4MBO80vVSJ7jeKqcccG913JzuU6zXOs5V3Esd75ji/+cY52zom2/mBv+EP1KcRStwug/w6RRHuZYCXo4txzoPASng/bhWXlb/iB/mBRfy/q0pJdyVpWb10A7sQMYvv1MV91bHO6K4mUBy6ngBnhmcM8a9gX/F74nQxjqvLnbsDmRhC1vYwnaf/QuvJaWTN15WOgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wMy0wOFQxNTo1MjoxNS0wNTowMDeDMOUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDMtMDhUMTU6NTI6MTUtMDU6MDBG3ohZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==) center center no-repeat;}\
                     .#<uispace>{$<transform>:$<rotate|a=90deg>;}\
                     .#<uispace>-reverse{$<transform>:$<rotate|a=-90deg>;}');
    /**
     * 水平箭头控件
     * @class   {nej.ui._$$ArrowsX} 水平箭头控件
     * @extemds {nej.ui._$$Arrows}
     * @param   {Object} 可选配置参数，已处理参数列表如下：
     */
    p._$$ArrowsX = NEJ.C();
    __proArrowsX = p._$$ArrowsX._$extend(p._$$Arrows);
    __supArrowsX = p._$$ArrowsX._$supro;
    /**
     * 初始化外观信息
     * @protected
     * @method {__initXGui}
     * @return {Void}
     */
    __proArrowsX.__initXGui = function(){
        this.__seed_css = _seed_css;
    };
};
define('{lib}ui/arrows/arrows.x.js',
      ['{lib}ui/arrows/arrows.js'],f);