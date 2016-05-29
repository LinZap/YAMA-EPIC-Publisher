/*
	i use the mini-database system save youtube information
	the package of lowdb just like nosql system
	our data will save under root dir and name "db_youtube.json"
*/

var low = require('lowdb')

const db = low(`${__dirname}/../db_youtube.json`)


db.defaults({ 
	peding:[], playlist:{}, music:{},
}).value()

/*
	get a task 
	return music id
*/
function getTask(){
	return db.get('peding').take(1).value()[0]
}
/*
	delete a task
	@music id 
*/
function deleteTask(task){
	return db.get('peding').remove(task).value()
}
/*
	add a task
	@music id
*/
function addTask(task){
	return db.get('peding').push(task).value()
}

/*
	insert or get playlists
	@list: {
		id:
		des:
		title:
	}
*/
function playlist(){
	var action = arguments[0]
	if(action)
		return db.get('playlist').set(action.id, action).value()
	else{
		var res = db.get('playlist').value()
		for(var k in res) return res
		return null
	}
}



/*
	insert music
	@list: {
		id:
		des:
		title:
	}
*/
function addMusic(){
	var action = arguments[0],
		music = db.get('music').get(action.id).value()
	if(!music){
		addTask({id:action.id})
		var s = db.get('music').set(action.id,action).value()
	}else{
		if(music.tag.indexOf(action.tag[0])<0){
			music.tag.push(action.tag[0])
			db.get('music').get(action.id).assign({tag: music.tag})
		}
	}
		
}

/*
	get music info
	@music id
*/
function getMusic(){
	var id = arguments[0]
	return db.get('music').get(id).value()
}

module.exports = {
	getTask:getTask,
	deleteTask:deleteTask,
	addTask:addTask,
	playlist:playlist,
	addMusic:addMusic,
	getMusic:getMusic
}