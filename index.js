const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { addRow } = require('./add-row.js'); 
const { getPosts } = require('./get-posts.js');

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
	addRow(n,req.body.newpost);
	console.log(req.body.newpost);
});

app.get('/wall/main', function(req,res){
	res.sendFile(__dirname+"/public/the_wall/"+"main_page.html");
});


app.listen(1024);
