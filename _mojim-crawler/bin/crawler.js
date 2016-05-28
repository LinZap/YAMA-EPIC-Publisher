var pg = require('pg'),
	cheerio = require('cheerio'),
	request = require('request'),
	consts = require('../const')

const conn_params = consts.db,
	  BaseURL = consts.baseURL

var client = new pg.Client(conn_params),getTaskSQL,Peding,

	gen = (function*(){

		var tasks = yield q(getTaskSQL)

		while(tasks.rows.length){

			var $ = yield r(tasks.rows[0].cmd)
				gen_pd = parseData($),
				gen_res = gen_pd.next()

			while (!gen_res.done) {
				var type = gen_res.value.type,
					params = gen_res.value.params
				switch(type) {
					case 'album': yield insertAlbum(params); break;
					case 'music': yield insertMusic(params); break;
				}
				gen_res = gen_pd.next()
			}
			yield doneCB(tasks.rows[0])
			tasks = yield q(getTaskSQL)
		}

		yield client.end()

	})()



/*
	exec sql
	@sql: exec sql
	@paprams: Prepared Statements Data (option)
	@cb: callback function(result.rows)
*/
function q(){
	var sql = arguments[0],
		paprams = Array.isArray(arguments[1])? arguments[1]: [],
		cb = typeof(arguments[1])=='function'?arguments[1]:
			 typeof(arguments[2])=='function'?arguments[2]:function(){}
	client.query(sql,paprams,function(err, result) {
		console.log('done',sql,paprams);
		if(err){
			console.error('error running query', err)
			process.exit()
		} else gen.next(result)
	})
}


/*
	request and get page
	@url
*/
function r(){
	var url = arguments[0]
	request(url, function(error, response, body){
		if (!error && response.statusCode == 200) 
			gen.next(cheerio.load(body))
		else{
			console.error('error request page', err)
			process.exit()
		}
	})
}


/*
	parse html
	@$: cheerio loaded html
*/
function* parseData(){
	var $ = arguments[0],
		dd = $('dd')

	for(var i=0;i<dd.length;i++){

		var that = $('dd')[i],
			title = $(that).children('h1').eq(0),
			content = $(that).children('div').eq(0),
			t_singer = title.children('a').eq(0),
			t_album = title.children('a').eq(1),
			t_musics = content.children('span').children('a'),
			singer = t_singer.text().trim(),
			album = t_album.text().trim(),
			singer_url = BaseURL+t_singer.attr('href').trim(),
			album_url = BaseURL+t_album.attr('href').trim()

			yield {
				type:'album',
				params:[album,singer,album_url,singer_url]
			}

			for(var j=0;j<t_musics.length;j++){
				var it = t_musics[j],
					music = $(it).text().trim(),
					music_url = BaseURL+$(it).attr('href').trim()
				yield {
					type:'music',
					params:[album_url,music,music_url]
				}
			}
	}
}


/*
	insert into Album
*/
function insertAlbum(params){
	q('select insertAlbum($1,$2,$3,$4) as aid',params)
}
/*
	insertMusic(_aid int,_song varchar,_songURL varchar)
*/
function insertMusic(params){
	q('select insertMusic($1,$2,$3) as mid',params)
}
/*
	task done
	in peding case, we will use crontab exec it 
	so do not slove multi-task

*/
function doneCB(task){
	if(!Peding) q('update task set status=true where tid=$1',[task.tid])
	else{
		client.end()
		process.exit()
	}
}


module.exports = function(sql){
	var sql = arguments[0]
	client.connect()
	Peding = arguments[1] || false
	getTaskSQL = sql
	gen.next()
}