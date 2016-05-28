/*
	unit-test
	usage: 
		node google.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}


var seach = require('../_google-crawler/index'),
	
	g_gen = (function*(){

		var result = yield seach(g_gen,process.argv[2])
		console.log(JSON.parse(result))

	})()

g_gen.next()