var pg = require('pg'),
	segment = require('./gen-segment'),
	consts = require('../const'),
	sim = require('./cosine-smilarity'),
	qgen = require('./gen-q'),
	conn_params = consts.db,
	q,
	client,
	main_gen,
	targetString,
	gen_seg,
	gen_seg_res,
	result
	

function p_gen(){

	return (function*(){

		gen_seg_res = gen_seg.next()

		while (!gen_seg_res.done) {
			var cell = gen_seg_res.value,
				data = cell.data,
				origin = cell.origin,
				match = data.map(t=>`(${t})+`).join('|'),

				q_res = yield q(`select \
						s.oid sid,s.ename esinger,s.cname csinger,\
						m.oid mid,m.ename emusic,m.cname cmusic \
						from object s,object m \
						where s.ename ~ '${match}' \
						and m.ename ~ '${match}' \
						and s.type=2 and m.type=3 \
						and m.ownermid=s.oid`)

			if(q_res.rows.length) {
				result = sim.cosine_similarity(origin,q_res.rows).tuple
				gen_seg_res.done = true
			}
			else{ 
				gen_seg_res = gen_seg.next()
			}
		}

		main_gen.next(result)

		yield client.end()
	})()
}


/*
	youtube title match
	@main_gen: it is a generator-style process, give your main generator object
	@title: the string of youtube title 
*/
module.exports = function(){
	main_gen = arguments[0],
	targetString = arguments[1].toLowerCase()
	gen_seg = segment(targetString)
	client = new pg.Client(conn_params)
	q_gen = new p_gen()
	q = qgen(client,q_gen)
	client.connect()
	q_gen.next()
}

