var pg = require('pg'),
	Client = pg.Client,
	consts = require('../const'),
	client;

const conn_params = consts.db;

function query(){
	var sql = arguments[0],
		params = arguments[1] || [],
		client = this
	return new Promise((resolve,reject)=>{
		client.query({
			text: sql,
			values: params
		},function(err, result){
			if(err) reject(err)
			else resolve(result.rows)
		})
	})	
}

function close(){
	var client = this
	client.on('drain', client.end.bind(client))
	client.connect()
}


module.exports = function(){
	client = new Client(arguments[0]||conn_params)
	return {
		client: client,
		query: query.bind(client),
		connect: client.connect.bind(client), // no queue
		close: close.bind(client), // queue and auto close
		mclose: client.end.bind(client) // no queue
	}
}