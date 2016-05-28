var ydb = require('../lib/youtube-db')


var task = ydb.getTask()

console.log('task',task)

var info = ydb.getMusic(task.id)

//console.log('music',info)

var des = info.des.split(/[\n ]+/);

des.forEach(seg=>{
	console.log(seg);
	console.log("");
})



// ydb.deleteTask(task)

// console.log('task done',task)

// task = ydb.getTask()

// console.log('task',task)

// info = ydb.getMusic(task.id)

// console.log('music',info)