var ydb = require('../lib/youtube-db')
	ylist = require('../lib/youtube-list'),
	yitem = require('../lib/youtube-listitem')
	playlists = ydb.playlist(),

	main_gen = (function*(){

		/*
			init and get playlist
		*/
		if(!playlists){
			var listnext = true
			while(listnext){
				var listres = yield ylist(main_gen,listnext)
				listnext = listres.nextpage
				listres.data.forEach(item=>{ ydb.playlist(item) })
			}
			playlists = ydb.playlist()
		}

		/*
			update playlist item into lowdb
			and add new task (also init)
		*/
		for (var listid in playlists) {
			var itemnext = true
			while(itemnext) {
				var itemres = yield yitem(main_gen,listid,itemnext)
				itemnext =itemres.nextpage
				itemres.data.forEach(item=>{ 
					ydb.addMusic(Object.assign(item,{tag:[playlists[listid].title]})) 
					console.log('[Youtube Crawler] addMusic: ' + item.title);
				})
			}
		}

	})()

main_gen.next()