/*
	unit-test
	usage: 
		node parseTitle.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}

var title_match = require('../lib/parse-title'),

	main_gen = (function*(){

		var result = yield title_match(main_gen,process.argv[2])
		console.log('result',result)


	})()

main_gen.next()