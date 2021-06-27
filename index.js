/*const fs = require('fs');
const http = require('http');
const https = require('https');
const privKey = fs.readFileSync('/etc/letsencrypt/live/wtaylor.xyz/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/wtaylor.xyz/fullchain.pem');
const cred = {key: privKey, cert: certificate};*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { addRow } = require('./add-row.js'); 
const { getPosts } = require('./get-posts.js');
const Filter = require('bad-words');
const filter = new Filter();

app.use(express.static('public'));

app.use(function(req, res, next){
	console.log("New request at "+Date.now());
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req,res){
	res.sendFile(__dirname+"/public/"+"index.html");
});

app.get('/conway', function(req,res){
	res.sendFile(__dirname+"/public/conway_game/"+"index.html");
});

app.get('/sequence', function(req,res){
	res.sendFile(__dirname+"/public/sequence_finder/"+"index.html");
});

app.get('/wall/new_post', function(req,res){
	res.sendFile(__dirname+"/public/the_wall/"+"new_post.html");
});

app.post('/wall/new_post', function(req,res){
	console.log("posted");
	let d = new Date();
	let n = d.getTime();
	let newPost = filter.clean(req.body.newpost);
	console.log(newPost);
	addRow(n,newPost);
});

app.get('/wall/main', function(req,res){
	res.sendFile(__dirname+"/public/the_wall/"+"main_page.html");
});

app.get('/wall/get_posts', function(req,res){
	console.log('req received');
	const { Pool } = require('pg');
	const pool = new Pool();
	const query = {
		name: 'get-posts',
		text: 'SELECT pbody FROM testtwo'
	};
	
	pool.query(query, (err, resp) => {
		if (err) {
			console.log(err.stack)
		} else {
			res.send(resp.rows)
		}
	});
});


app.listen(80);
/*const httpServer = http.createServer(app);
const httpsServer = https.createServer(cred, app);

httpServer.listen(80);
httpsServer.listen(443);*/
