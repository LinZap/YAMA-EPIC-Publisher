/*
	unit-test
	usage: 
		node google.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}


var seach = require('../index'),
	
	g_gen = (function*(){

		var result = yield seach(g_gen,process.argv[2])
		console.log(result)

	})()

g_gen.next()