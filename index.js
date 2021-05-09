let express = require('express');
let app = express();
let bodyParser = require('body-parser');

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

app.get('/wall', function(req,res){
	res.sendFile(__dirname+"/public/the_wall/"+"index.html");
});

app.post('/wall', function(req,res){
	console.log("posted");
	console.log(req.body.newpost);
});


app.listen(80);
