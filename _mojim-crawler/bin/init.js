/*
	初始化任務資料
	僅需要在第一次程式啟動時呼叫
*/
var request = require('request'),
	cheerio = require('cheerio'),
	conn = require('../lib/pg')(),
	consts = require('../const')

const BaseURL = consts.baseURL
const EntryPage = consts.entryPage
const RELOAD = false

request(BaseURL+EntryPage, function(error, response, body){
	if (!error && response.statusCode == 200) {
		parseTask(cheerio.load(body))
	}else console.error(error);
})



function parseTask($){

	var reg = new RegExp(/^\d+月$/)

	$('a.X3').each(function(){
		var txt = $(this).text().trim(),
			url = BaseURL+$(this).attr('href').trim()

		if(reg.test(txt)) insertTask(url)
	})

	conn.close();
}


function insertTask(url){
	var params = [4,url];
	conn.query('select insertTask($1,$2) as tid',params)
	.then(function(res){
		console.log(`done ${res[0].tid} ${url}`);
	})
	.catch(function(err){
		console.error(err,params);
	})
}