const exec = require('child_process').exec,
	  consts = require('./const'),
	  phantom = `${__dirname}/${consts.phantom}`,
	  crawler = `${__dirname}/${consts.crawler}`

/*
	google crawler
		fork process, exec phantomjs 
		never be blocked way 
	@gen: main process generator
	@q: query string
	return JSON format [{},{},...]
*/
module.exports = function(){
	var gen = arguments[0],
		q = encodeURI(arguments[1])
	exec(`${phantom} ${crawler} ${q}`, (error, stdout, stderr) => {
		if (error) console.error(`exec error: ${error}`);
		gen.next(stdout? JSON.parse(stdout): false)
	})
}