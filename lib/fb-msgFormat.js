/*
	data format 

	set {
		muinfo: muinfo,
		pinfo: pinfo,
		addition: addition,
		infosite: infosite,
		twsite: twsite
	}
	
	muinfo {
		id, title, des, tag
	}

	pinfo (mutex addition) { 
		sid, esinger, csinger, mid, emusic, cmusic 
	}

	addition (mutex pinfo)[
		"seg1", "seg2", "seg3", ...
	]
	
	infosite [
		{title, href}...
	]

	twsite (mutex pinfo) [
		{title, href}...
	]

*/
const 	official_stopwords = [
			"youtube",
			"wikipedia",
			"facebook"
		],
		fyi_stopwords = [
			"youtube"
		],
		twitter_positive = [
			"twitter"
		]


var segment = require('./title-regexp'),
	filterStopwords = require('./filter-stopwords'),
	consts = require('../const').publish,
	des_len = consts.des_length,
	regx_official = official_stopwords.map(ptn=>`(${ptn})+`).join('|'),
	regx_fyi = fyi_stopwords.map(ptn=>`(${ptn})+`).join('|'),
	regx_tw = twitter_positive.map(ptn=>`(${ptn})+`).join('|')

module.exports = function(set){
	
	var muinfo=set.muinfo,
		pinfo=set.pinfo,
		addition=set.addition,
		infosite=set.infosite,
		twsite=set.twsite,
		str_hashtag = hashTag(muinfo,pinfo,addition),
		url = `https://www.youtube.com/watch?v=${muinfo.id}`,
		str_des = music_des(muinfo),
		site_url = filterURL(infosite, pinfo?regx_official:fyi_stopwords, false),
		twit_url = filterURL(twsite,twitter_positive,true),
		str_site = site_url? `${pinfo?'official site':'FYI'}: ${site_url} \n` : "",
		str_twitter = twit_url? `twitter: ${twit_url} \n` : ""

	return `${str_hashtag}${str_des}${str_site}${str_twitter}`
}


function hashTag(muinfo,pinfo,addition){

	var set = []

	muinfo.tag.forEach(item=>{set.push(item)})

	if(pinfo)
		segment(pinfo.csinger).forEach(item=>{set.push(item)})

	if(addition) {
		addition = filterStopwords(addition)
		addition.forEach(item=>{set.push(item)})
	}

	return set.map(item=>`#${item}`).join(" ")+"\n"
}


function music_des(muinfo){
	var des = "",
		tmpsegs = muinfo.des.split(/[\n ]+/)

	for (var i = 0; i < tmpsegs.length; i++) 
		if( (des.length+tmpsegs[i].length) < des_len ) 
			des+= tmpsegs[i]+" "
		else{
			des += "..."
			break
		}

	return des+"\n"
}

/*
	filter google url pattern
	@urls: (Array) [{title,href},...]
	@regx: (RegExp) filter a url match regx
	@contain: (Boolean) contain or not
	block pattern: [https://www.google.com.tw/url?q=]
*/
function filterURL(){

	var utls = arguments[0],
		regx = arguments[1],
		contain = arguments[2],
		res = false

	for (var i = 0; i < utls.length; i++) {
		var url = utls[i].href.toLowerCase()
		if( !!url.match(regx) == contain ){
			res = url
			if(res.indexOf("https://www.google.com.tw/url?q=")>-1 ){
				res = res.replace("https://www.google.com.tw/url?q=","")
				res = res.slice(0,res.indexOf("&"))
			}
			res = decodeURIComponent(res)	
			break
		}
	}
	
	return res
}