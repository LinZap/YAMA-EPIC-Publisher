var pg = require('pg');
var client = new pg.Client("postgres://postgres:postgres@localhost/Music");
client.connect();

var gen = (function*(){

	var prevRes;

	for (var j = 1; j <4; j++) {
		
	
		prevRes = yield q('select gid from groups where gid>$1',['0'],function(res){
			gen.next(res);
		});


		for (var i = 0; i < prevRes.length; i++) {

			var gid = prevRes[i].gid;
			yield UpdateStatus(j,gid,function(res){
				//console.log(`update gid= ${gid} to value= ${j}`);
				gen.next();
			})
		}
	
	}

	yield client.end();

})()

gen.next();



function q(sql,paprams,cb){
	client.query(sql,paprams,function(err, result) {
		if(err){
			console.error('error running query', err);
			process.exit();
		}
		else cb(result.rows);
	});
}


function UpdateStatus(i,status,cb){
	q('update groups set status=$1 where gid=$2',[status,i],cb);
}