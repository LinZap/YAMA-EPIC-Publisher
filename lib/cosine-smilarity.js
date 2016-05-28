/*
	find the most similar string from tuples.ename
	use cosine similarity algorithm
	@origin: origin set
		@origin: ['keyword','keyword','keyword','keyword'...]
	@tuples: tuples with cname
		@tuples: {
			esinger: string
			emusic: string
		}
	return {
		tuple: {}
	}
*/
function cosine_similarity(origin,rows){

	var originset = buildset(origin),
		sim = 0, hold = false

	rows.forEach(tuple=>{

		var tmpstr = `${tuple.esinger} ${tuple.emusic}`,
			tmpset = buildset(tmpstr.split(' '))
			csim = compare(originset,tmpset)
		//console.log(csim,tuple)
		if(csim>sim){
			sim = csim
			hold = tuple
		}
	})
	return {
		sim:sim,
		tuple: hold
	}
}

/*
	array to object set
*/
function buildset(){
	var res = {},
		arr = arguments[0]
	arr.forEach(item=>{
		res[item] = res[item]? res[item]++ : 1
	})
	return res
}

/*
	two object set
	return cosine-smiliarity val
*/
function compare(){
	var set1 = Object.assign({},arguments[0]),
		set2 = Object.assign({},arguments[1]),
		set3 = {},
		a=0,b=0,ab=0

	for(var k in set1){
		a+=set1[k]*set1[k]
		if(set2[k]) ab+=set2[k]*set1[k]
	}
	a = Math.sqrt(a)
	for(var k in set2){
		b+=set2[k]*set2[k]
	}
	b = Math.sqrt(b)
	return ab/(a*b)
}


module.exports = {
	cosine_similarity: cosine_similarity,
	buildset: buildset,
	compare: compare
}