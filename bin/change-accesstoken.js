/*
	chanege facebook AccessToken from Graph API Explorer to a long time AccessToken 
 	usage:
 	node change-accesstoken.js [App ID] [App secret] [AccessToken]
*/

if(!process.argv[2] || !process.argv[3] || !process.argv[4]){
	console.error('not enough information\nusage:\n\tnode change-accesstoken.js [App ID] [App secret] [AccessToken]')
	process.exit()
}

var request = require('request'),
	consts = require('../const').graph,
	graph = consts.url,
	appid = process.argv[2],
	secret = process.argv[3],
	actoken = process.argv[4],
	option = {
		url: `${graph}/oauth/access_token`,
		qs:{
			grant_type: "fb_exchange_token",
			client_id: appid,
			client_secret: secret,
			fb_exchange_token: actoken
		}
	}

request(option,function(error, response, body){
	if(error) console.error('change AccessToken error',error)
	else{
		var res = JSON.parse(body)
		console.log(res.access_token)
	}
})