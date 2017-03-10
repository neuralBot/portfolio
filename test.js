var http = require('http');
var express = require('express');
var mongojs = require('mongojs');
var path = require('path');
var bodyParser = require('body-parser');
app = express();
db = mongojs('contactlist',['contactlist']); //db and collections


app.disable('etag');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/work', function(req, res) {
    res.sendfile(path.resolve('public/views/work.html'))
});

app.get('/work_list', function(req,res){
  console.log("Get all work from user");

  db.contactlist.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });
});


app.listen(8080 ,function(){
  console.log("server run at port 8080");
});