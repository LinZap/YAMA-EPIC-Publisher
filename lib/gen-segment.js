var segment = require('./title-regexp'),
	filterStopwords = require('./filter-stopwords')

function* seg(dataset){

	var size = dataset.length

	while(size>0){

		var gen_slid = sliding(size,dataset),
			slid_res = gen_slid.next()

		while (!slid_res.done) {

			yield slid_res.value
			slid_res = gen_slid.next()

		}

		size--
	}
}


function* sliding(size,dataset){

	var idx = 0
	while ((idx+size)<=dataset.length) {
		yield {
			origin: dataset.slice(),
			data: dataset.slice().splice(idx,size)
		}
		idx++
	}
}

/*
	get a sliding window segmentation generator object
	generator will return from the longest array-length
	@str: target string or array
*/
module.exports = function(){
	var originset = Array.isArray(arguments[0])? 
		arguments[0]:filterStopwords(segment(arguments[0])),
		gen = seg(originset)
	return gen
}