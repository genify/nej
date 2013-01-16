#测试用例规则
#测试初始化必须给模块命名
#例:module('event');
#具体test必须命名,便于定位问题
#例:test('测试给节点添加事件',function(){
	
});
#数据库根据platform+module信息先清空所有数据,然后添加测试log
字段
module    : 测试模块名，一个js文件可能包含多个模块
test      : 具体测试名，一个模块可能包含多个测试
result    : 断言结果，一个测试可能包括多个断言
actual    : 实际结果
expected  : 预期结果
paltform  : 平台信息，包括系统信息，浏览器信息，是否支持css3d，是否支持touch
