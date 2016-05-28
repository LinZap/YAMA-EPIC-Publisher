var pg = require('../lib/pg');

var conn = pg();

conn.query('select * from entity where eid>$1',[0])
.then(function(res){
	console.log(res);
})
.catch(function(err){
	console.error(err);
})


conn.query('select * from class where cid>$1',[0])
.then(function(res){
	console.log(res);
})
.catch(function(err){
	console.error(err);
})


conn.close();