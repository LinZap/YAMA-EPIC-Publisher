/*
	this process can fetch your chennel's playlist on youtube
	return array
*/

const url = "https://www.googleapis.com/youtube/v3/playlists"

var request = require('request'),
	consts = require('../const').youtube,
	key = consts.key,
	channelId = consts.channelId

function fetch(body){
	var d = JSON.parse(body),
		lists = d.items,
		data = { data: [] }

	if(d.nextPageToken) data.nextpage = d.nextPageToken

	lists.forEach(item=>{

		var listid = item.id,
			snippet = item.snippet,
			title = snippet.title,
			description = snippet.description

		data.data.push({
			id: listid,
			title: title,
			des: description
		})
	})
	return data
}

module.exports = function(){

	var gen = arguments[0],
		nextpage = arguments[1],
		option = {
		url: url,
		qs:{
			part: "snippet",
			channelId: channelId,
			maxResults: 50,
			key: key
		}
	}

	if(typeof(nextpage)=='string') option.qs.pageToken = nextpage

	request(option,function(error, response, body){
		var res = false
		if(error) console.error('youtube playlist error',error)
		gen.next(fetch(body))
	})
}



