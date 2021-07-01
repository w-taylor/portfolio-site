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
const sendMail = require('./send-mail.js');

app.use(express.static('public'));

app.use(function(req, res, next){
	console.log("New request at "+Date.now());
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function(req,res){
	//res.sendFile(__dirname+"/public/"+"index.html");
	res.render(__dirname+"/public/"+"index.ejs");
});

app.post('/send_mail', function (req,res) {
	sendMail(req.body.fromName, req.body.fromAddress, req.body.mesSubject, req.body.message);
	res.end("mail sent");
});

app.get('/conway', function(req,res){
	res.render(__dirname+"/public/conway_game/"+"index.ejs");
});

app.get('/sequence', function(req,res){
	res.render(__dirname+"/public/sequence_finder/"+"index.ejs");
});

app.get('/wall/new_post', function(req,res){
	res.render(__dirname+"/public/the_wall/"+"new_post.ejs");
});

app.post('/wall/new_post', function(req,res){
	console.log("posted");
	let d = new Date();
	let n = d.getTime();
	let newPost = filter.clean(req.body.newpost);
	console.log(newPost);
	addRow(n,newPost);
	res.end("done");
});

app.get('/wall/main', function(req,res){
	res.render(__dirname+"/public/the_wall/"+"main_page.ejs");
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
