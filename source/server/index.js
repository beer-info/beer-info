'use strict';

var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');

https.createServer({
	key: fs.readFileSync('./beer-info.pem'),
	cert: fs.readFileSync('./beer-info.crt')
}, function(req, res) {

	var isApi = /^\/api\//;
	var apiUrl = url.parse(req.url);
	if(isApi.test(apiUrl.pathname)){
		console.log(apiUrl);
		var proxy = http.get(
			'http://api.brewerydb.com/v2' + apiUrl.pathname.split('/api')[1] +
			'?key=f14f49a8edc2d2fae16ffacb3024bc1b&' + apiUrl.query,
			function(response){
				if(!res.finished){
					res.setHeader('Access-Control-Allow-Credentials', 'true');
					res.setHeader('Access-Control-Allow-Origin', '*');
					response.pipe(res);
				})
			}
		);
	} else res.end(JSON.stringify({test:"ok"}));

}).listen(8080);
