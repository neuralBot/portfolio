var express = require('express')
var app = express();
var mongojs = require('mongojs');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
db = mongojs('portfolio',['works','messages']); //db and collections
var counter = 0;

io.on('connection', function(socket){
	counter++;
	console.log('user connect '+counter);
	socket.on('chat message', function(msg){
		var obj = {
			name:'guest',
			msg:msg,
			time:new Date()
		}
		var currentdate = new Date(); 

	    db.messages.insert(obj, function(err,doc){
		    console.log(obj)
		});
	    io.emit('chat message', msg);
	});
	socket.on('count total', function(total){
		io.emit('count total', counter);
      });
	socket.on('disconnect', function(){
		counter--;
		io.emit('count total', counter);
	    console.log('user disconnected '+counter);
	});
});

app.disable('etag');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/portfolio', function(req, res) {
    res.sendfile(path.resolve('public/views/index.html'))
});

app.get('/work/:id', function(req, res) {
    console.log("Get work id "+req.params.start);
  	var id = req.params.id;
  	//console.log(id);
  	db.works.findOne({_id: mongojs.ObjectId(id)},function(err,docs){
    	//console.log(docs);
    	res.json(docs);
  	});
});

app.get('/work_list/:start', function(req,res){
  	console.log("Get all work from user");
  	var start = req.params.start;
  	//console.log(start);
  	db.works.find({}).limit(4).skip(parseInt(start),function(err,docs){
    	//console.log(docs);
    	res.json(docs);
  	});
});

http.listen(8080, function(){
    console.log("server run at port 8080");
});