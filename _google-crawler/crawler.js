var system = require('system'),
	args = system.args,
	page = require('webpage').create(),
	fs = require('fs'),
	consts = require('./const'),
	q = args[1],
	url = "https://www.google.com.tw/search?q="+q

page.open(url , function(status) {

  if(status === "success") {

	var r = page.evaluate(function() {
		var r = [],
			res = document.querySelectorAll('.r>a');
		for(var i=0;i<res.length;i++){
			r.push({
				title: res.item(i).innerText,
				href: res.item(i).href
			});
		}
		return r
	})

	if(consts.debug) page.render("./shot.png")
	console.log(JSON.stringify(r))
  }

  phantom.exit()
  
})