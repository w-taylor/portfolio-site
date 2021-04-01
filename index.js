let express = require('express');
let app = express();

app.use(express.static('public'));

app.use(function(req, res, next){
	console.log("New request at "+Date.now());
	next();
});

app.get('/', function(req,res){
	res.sendFile(__dirname+"/public/"+"index.html");
});

app.get('/conway', function(req,res){
	res.sendFile(__dirname+"/public/conway_game/"+"index.html");
});

app.get('/sequence', function(req,res){
	res.sendFile(__dirname+"/public/sequence_finder/"+"index.html");
});


app.listen(80);
