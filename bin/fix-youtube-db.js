const request = require('request-promise'),
	  db = require('../lib/youtube-db.js'),
	  querystring = require('querystring'),
	  URL = require('url').URL,
	  {AccessToken} = require('../const.json').graph;

(async function(){

	let uri = `https://graph.facebook.com/v2.11/me/feed?access_token=${AccessToken}&fields=link,name,description&limit=100`,
		json = true;
	while(uri){
		try{
			const res = await request({uri,json});	
			for(let i=0;i<res.data.length;i++){
				let {link,name,description,id} = res.data[i],
					qs = getQueryString(link),
					vid = qs['?v'];
				if(!vid) {
					console.log('can not parse url',res.data[i]);
					continue;
				}
				db.deleteTask({id:vid})
				console.log(`deleted: ${id} vid: ${vid}`);
			}
			uri = res.paging.next;	
		}
		catch(e){
			console.error(e);
			uri = null;
		}
	}

	function getQueryString(link){
		try{
			return querystring.parse(new URL(link).search)
		}
		catch(e){
			return {};
		}
	}
})();




