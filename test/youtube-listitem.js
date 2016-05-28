/*
	unit-test
	usage: 
		node youtube-listitem.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}

var yplaylist = require('../lib/youtube-listitem'),
	ygen = (function*(){

		var res = yield yplaylist(ygen,process.argv[2])
		console.log(res)

	})()

ygen.next()