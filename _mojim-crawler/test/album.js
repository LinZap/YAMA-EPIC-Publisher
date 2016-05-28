var crawler = require('../bin/album-crawler');

crawler('https://mojim.com/twzlistALLTime.htm').then(function(){
	console.log('success');
})
.catch(function(){
	console.log('fail');
})