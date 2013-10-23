NEJ
===

简洁，美观，真正的跨平台web前端开发框架



## changlog

2013/3/21 __移除__ 了chainable中的所有的便利方法(例如_$click, _$after), 这些方法会导致是无法用NEJ工具混淆。应统一使用 _$insert 以及 _$on 等方法代替