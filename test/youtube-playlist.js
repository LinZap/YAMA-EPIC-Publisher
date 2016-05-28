var yplaylist = require('../lib/youtube-list'),
	ydb = require('../lib/youtube-db'),
	ygen = (function*(){

		var res = yield yplaylist(ygen),
			collect = res.data

		while (res.nextpage) {
			res = yield yplaylist(ygen,res.nextpage)
			collect.push(res.data)
		}
		
		console.log(collect)

		collect.forEach(item=>{
			ydb.playlist(item)
		})

		//console.log(res)

	})()

ygen.next()