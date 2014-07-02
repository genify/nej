var f = function() {
	NEJ.patch('TR<5',['b.js'],function(){
		console.log('TR<5');
	});

	NEJ.patch('TR>5',['c.js'],function(){
		console.log('TR>5');
	});

	NEJ.patch('WR',['d.js'],function(){
		console.log('WR');
	});
};
define(f);
