const pattern = [
[
	"0-9A-Za-z"			//group 英數
], 
[
	"\\u4e00-\\u9fa5",	//中文
	"\\u3041-\\u309F",	//平假名
	"\\u30A1-\\u30FF",	//片假名
	"\\u31F0-\\u31FF",	//擴展片假名
],
[
	"\\x3130-\\x318F",	//韓文
],
[
	"\\uFF41-\\uFF5A",	//全形英文小寫
	"\\uFF21-\\uFF3A"	//全形英文大寫
]
	//"\\xAC00-\\xD7A3", 	//韓文(棄用)
	//"\\uFF10-\\uFF19",	//全形數字(棄用)
]

module.exports = function(str){

	var condition = pattern.map(arr=>'(['+arr.join('')+']+)').join("|"),
		reg = new RegExp(condition,'g'),
		tmp = str.match(reg),
		res = []

	for (var i = 0; i < tmp.length; i++) 
		if(tmp[i].length) res.push(tmp[i])
	
	return res
}