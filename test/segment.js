/*
	unit-test
	usage: 
		node segment.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}


var reg = require('../lib/title-regexp')

console.log(reg(process.argv[2]))