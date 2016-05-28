var pg = require('pg'),
	fs = require('fs'),
	consts = require('../const'),
	qen_q = require('../lib/gen-q'),
	conn_params = consts.db,q,client,

	bu_gen = (function*(){
		var create = fs.readFileSync(`${__dirname}/createdb.sql`,'utf8')
		console.log("create database mojim...")
		yield q(create)
		yield closeAndNext(pa_gen)

	})(),

	pa_gen = (function*(){

		conn_params.database = "mojim"
		client = new pg.Client(conn_params)
		q = new qen_q(client,pa_gen)
		client.connect()

		var basic = fs.readFileSync(`${__dirname}/mini-i3s.sql`,'utf8'),
			patch = fs.readFileSync(`${__dirname}/patch.sql`,'utf8')

		console.log("build basic table...")
		yield q(basic)

		console.log("patch commands...")
		yield q(patch)

		console.log("done...")
		yield client.end()

	})()

	
conn_params.database = "postgres"
client = new pg.Client(conn_params)
q = new qen_q(client,bu_gen)
client.connect()
bu_gen.next()


function closeAndNext(gen){
	client.end()
	gen.next()
}