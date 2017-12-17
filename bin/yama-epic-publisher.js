/*
	YAMA EPIC Song - Post auto Publishing robot

	[main process]
	usage:
		node yama-epic-publish.js [-v]
		[-v] : (option) preview mode, just show what msg will be published
	
	step:
		1. get a peding task (lowdb), or exit
		2. get video info (lowdb)
		3. parse video title and get singer and music name
		   or segment title as hash tag
		4. google: '"singer" official site' and get first result
		5. google: '"singer" twitter' and get first result
		6. format post and publish to facebook page
		7. delete peding task
		8. done

*/
var mode = process.argv[2]=="-v",
	ydb = require('../lib/youtube-db'),
	parse_title = require('../lib/parse-title'),
	segment = require('../lib/title-regexp'),
	google = require('../_google-crawler/index'),
	formatPost = require('../lib/fb-msgFormat'),
	fbpublish = require('../lib/fb-publish'),
	filterStopwords = require('../lib/filter-stopwords'),
	q = require('../lib/gen-q'),

	yama_gen = (function*(){

		var {task,info} = getTaskAndMusicInfo(),
			muinfo = info,

			/*
				parse title, return format
				{ sid, esinger, csinger, mid, emusic, cmusic, album }
			*/
			pinfo = yield parse_title(yama_gen,muinfo.title),
			
			/*
				if can not parse title then some segmentations will help us 
				return format
				["seg1", "seg2", "seg3", ...]
			*/
			addition = pinfo? false : segment(muinfo.title),
			
			/*
				search official site
				if can not parse title, provide a url as "FYI" 
				google return format
				[
					{title, href}...
				]
			*/
			singer = pinfo? pinfo.csinger : filterStopwords(addition).join(" "),
			gstring = pinfo? `"${singer}" official site` : `${singer} "official site"`
			infosite =  yield google(yama_gen,gstring),

			/*
				search official twitter
				if can not parse title, skip it
			*/
			tstring = pinfo? `"${singer}" twitter` : false,
			twsite = tstring? yield google(yama_gen,tstring,3000) : false,

			/*
				format post msg
			*/
			collector = {
				muinfo: muinfo,
				pinfo: pinfo,
				addition: addition,
				infosite: infosite,
				twsite: twsite
			},

			msg = formatPost(collector)


			if(mode) {
				console.log(msg)
				console.log(`https://www.youtube.com/watch?v=${muinfo.id}`)
			}

			else {
				var fbresponse = yield fbpublish(yama_gen,{
					id: muinfo.id,
					msg: msg
				})

				if(fbresponse.id){
					removeTask(task)
					console.log(`Publishing Success\nhttps://www.facebook.com/${fbresponse.id}`);
				}
			}

	})()


yama_gen.next()


/*
	step 1
	get task and music info
	return
	{
		@info
		@task
	}
*/
function getTaskAndMusicInfo(){

	var NA = true;
	var task, info
	while(NA){
		task = ydb.getTask()
		if(!task){
			console.log("no peding task")
			process.exit()
		}
		info = ydb.getMusic(task.id)
		if(info.title=="Deleted video") removeTask(task);
		else NA = false	
	}
	console.log('task',info.title);
	return {info,task}
}

/*
	step 7
	remove task
*/
function removeTask(){
	var task = arguments[0]
	if(task)
		return ydb.deleteTask(task)
}