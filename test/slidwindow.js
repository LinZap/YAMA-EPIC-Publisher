/*
	unit-test
	usage: 
		node slidwindow.js "what string you want to test"

*/
if(!process.argv[2]){
	console.error('no data input')
	process.exit()
}

var seg_gen = require('../lib/gen-segment')(process.argv[2]),
	result = seg_gen.next()

while (!result.done) {
	console.log(result.value.data)
	result = seg_gen.next()
}