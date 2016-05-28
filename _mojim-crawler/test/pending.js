var request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	consts = require('../const');

const BaseURL = consts.baseURL
const EntryPage = consts.entryPage
const RELOAD = false

if(RELOAD)
	request(BaseURL+EntryPage, function(error, response, body){
		if (!error && response.statusCode == 200) {
			fs.writeFileSync('./a.html',body)
			parseTask(cheerio.load(body))
		}else console.error(error);
	})

else{
	var html = fs.readFileSync('./a.html')
	parseTask3(cheerio.load(html))
}

// init task
// function parseTask($){
// 	var reg = new RegExp(/^\d+月$/);
// 	$('a.X3').each(function(){
// 		var txt = $(this).text().trim();
// 		if(reg.test(txt)){
// 			var res = txt+' '+BaseURL+$(this).attr('href')
// 			console.log(res)
// 		}
		
// 	})
// }

// get info
function parseTask2($){
	// get album blocks
	$('dd').each(function(){
		var title = $(this).children('h1').eq(0),
			content = $(this).children('div').eq(0),
			t_singer = title.children('a').eq(0),
			t_album = title.children('a').eq(1),
			t_musics = content.children('span').children('a').eq(0),
			singer = t_singer.text(),
			album = t_album.text()

		
		var mus = [];
		t_musics.each(function(){
			var music = $(this).text();
			mus.push(music);
		})

		console.log(album,singer,mus);

	});
}

function parseTask3($){
	var a  = $('dd').children('div').children('span').children('a');
	for(var i=0;i< a.length;i++){
		var th = a[i],
			href = $(th).attr('href');
			console.log(href);
	}
}