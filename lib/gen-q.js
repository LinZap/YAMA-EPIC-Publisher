/*
	exec sql
	@client: pg client
	@gen: a generator
*/
module.exports = function(client,gen){

	/*	exec sql and auto to next
		@sql: exec sql
		@paprams: Prepared Statements Data (option)
		@cb: callback function(result.rows)
	*/
	return function(){
		var sql = arguments[0],
			paprams = Array.isArray(arguments[1])? arguments[1]: [],
			cb = typeof(arguments[1])=='function'?arguments[1]:
				 typeof(arguments[2])=='function'?arguments[2]:function(){}

		client.query(sql,paprams,function(err, result) {
			//console.log('exec',sql,paprams);
			if(err){
				console.error('error running query', err)
				process.exit()
			} else gen.next(result)
		})
	}
}