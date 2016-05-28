var low = require('lowdb')
const db = low('../test_db.json')
db.defaults({ posts: [], user: {} }).value()

var n = db.get('post').take(1).value()[0]


console.log(n);
// for (var i = 1; i < 5; i++) {
// 	var source = { id: i ,des: ""+i}
// 	var ins = db.get('posts').push(source).value()
// }

// var post = db.get('a').value()
// console.log('before',post);


// db.defaults({ posts: [], user: {} }).value()

// var post2 = !!db.get('')
// 			.filter({id:1})
// 			.take(1)
// 			.value()
// 			.length
// console.log(post2);

