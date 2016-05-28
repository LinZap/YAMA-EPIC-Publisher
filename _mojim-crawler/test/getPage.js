var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	consts = require('../const');

request('https://mojim.com/twzlist2016-05.htm', function(error, response, body){
	if (!error && response.statusCode == 200) {
		fs.writeFileSync('./2016-05.html',body)
	}else console.error(error);
})