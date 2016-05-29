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
var segment = require('./title-regexp'),
	consts = require('../const').publish,
	des_len = consts.des_length

module.exports = function(set){
	
	var muinfo=set.muinfo,
		pinfo=set.pinfo,
		addition=set.addition,
		infosite=set.infosite,
		twsite=set.twsite,

		str_hashtag = hashTag(muinfo,pinfo,addition),
		url = `https://www.youtube.com/watch?v=${muinfo.id}`,
		str_des = music_des(muinfo),
		site_des = pinfo? "official site:":"FYI:",
		str_site = infosite? `${site_des} ${filterURL(infosite[0].href)} \n` : "",
		str_twitter = twsite? `twitter: ${filterURL(twsite[0].href)} \n` : ""


	return `${str_hashtag}${str_des}${str_site}${str_twitter}`
}


function hashTag(muinfo,pinfo,addition){
	var set = []

	muinfo.tag.forEach(item=>{set.push(item)})

	if(pinfo)
		segment(pinfo.csinger).forEach(item=>{set.push(item)})

	if(addition) 
		addition.forEach(item=>{set.push(item)})

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
	@url
	block pattern: [https://www.google.com.tw/url?q=]
*/
function filterURL(url){
	var tmp = url.replace("https://www.google.com.tw/url?q=",""),
		andidx = tmp.indexOf("&")
	tmp = tmp.slice(0,andidx)
	tmp = decodeURIComponent(tmp)
	return tmp
}