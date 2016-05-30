var stopwords = require('../const').stopwords

module.exports = function(arr){
	var res = []
	for (var i=0; i<arr.length; i++) 
		if(stopwords.indexOf(arr[i])<0) 
			res.push(arr[i])
	return res
}