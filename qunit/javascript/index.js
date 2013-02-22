(function(){
    //定义测试模块
    module("测试示例");
    //定义一个简单的函数，判断参数是不是数字
    function simpleTest(para) {
      if(typeof para == "number") {
        return true;
      }else{
        return false;
      }
    }
    function isNumber(num){
        return typeof(num);
    }
    
    //开始单元测试
    test('simpleTest()', function() {
      //列举各种可能的情况，注意使用 ! 保证表达式符合应该的逻辑
      ok(simpleTest(2), '2是一个数字');
      ok(!simpleTest("2"), '"2"不是一个数字');
    });
    
    test('isNumber()',function(){
        //测试是否数字
        equals(isNumber("2"),'number','这不是一个数字');
        equals(isNumber(2),'number','这是一个数字');
    });
    
})();
