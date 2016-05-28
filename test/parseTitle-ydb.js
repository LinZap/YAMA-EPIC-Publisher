var title_match = require('../lib/parse-title'),
	ydb = require('../lib/youtube-db'),

	main_gen = (function*(){

		var task = ydb.getTask()
		var title = ydb.getMusic(task.id).title
		console.log('origin',title)
		ydb.deleteTask(task)
		task = ydb.getTask()

		var result = yield new title_match(main_gen,title)
		console.log('result',result)

	})()

main_gen.next()