/*
	this process can fetch your items of playlist on youtube
	return array
*/

const url = "https://www.googleapis.com/youtube/v3/playlistItems"

var request = require('request'),
	consts = require('../const').youtube,
	key = consts.key

function fetch(body){

	var d = JSON.parse(body),
		lists = d.items,
		data = { data: [] }

	if(d.nextPageToken) data.nextpage = d.nextPageToken

	lists.forEach(item=>{

		var snippet = item.snippet,
			title = snippet.title,
			des = snippet.description,
			id = snippet.resourceId.videoId

		data.data.push({
			id: id,
			title: title,
			des: des
		})
	})
	return data
}

module.exports = function(){

	var gen = arguments[0],
		playlistid = arguments[1],
		nextpage = arguments[2],
		option = {
		url: url,
		qs:{
			part: "snippet",
			playlistId: playlistid,
			maxResults: 50,
			key: key
		}
	}

	if(typeof(nextpage)=='string') option.qs.pageToken = nextpage

	request(option,function(error, response, body){
		var res = false
		if(error) console.error('youtube playlist item error',error)
		gen.next(fetch(body))
	})
}



