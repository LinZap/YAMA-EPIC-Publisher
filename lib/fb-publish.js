var request = require('request'),
consts = require('../const').graph,
graph = consts.url,
AccessToken = consts.AccessToken

/*
	publish youtube video to facebook
	@set format as blow
	{
		msg: "",
		youtube link: ""
	}
*/
module.exports = function(){

	var gen = arguments[0],
		set = arguments[1],
		option = {
			url: `${graph}/me/feed`,
			form: {
				message: set.msg,
				link: `https://www.youtube.com/watch?v=${set.id}`,
				access_token: AccessToken
			},
			json: true
		}

	request.post(option,function(error, response, body){
		var res = false
		if(error) console.error('grapg api publish error',error)
		else res = body
		gen.next(res)
	})

}