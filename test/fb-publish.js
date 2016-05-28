/*
	unit-test
	usage: 
		node google.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}


var fbpub = require('../lib/fb-publish'),
	f_gen = (function*(){

		var result = yield fbpub(f_gen,{
			msg: process.argv[2],
			id: 'pWY-S_wGlOs'
		})
		console.log(result)
	})()

f_gen.next()
	
