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
		console.log(apiUrl.pathname , 'from', req.socket.remoteAddress);
		// var key = '01379011bfd893a3f6a7b3e5b6873ae2'; // beer-info
		var key = '2b8202e027e2b7a7b93a8f767cb233fa'; // infobeer

		var proxy = http.get(
			'http://api.brewerydb.com/v2' + apiUrl.pathname.split('/api')[1] +
			'?key='+ key + '&' + apiUrl.query,
			function(response){
				if(!res.finished){
					res.setHeader('Access-Control-Allow-Credentials', 'true');
					res.setHeader('Access-Control-Allow-Origin', '*');
					response.pipe(res);
				}
			}
		);
	} else res.end(JSON.stringify({test:"ok"}));

}).listen(8888);
