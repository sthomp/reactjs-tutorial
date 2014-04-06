var express = require('express');
var app = express();
var path = require('path');

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '.')));

var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"},
  {author: "Scott Thompson", text: "Hello World!"}
];

app.get('/mydata', function(req,res){
  setTimeout(function(){
    res.json(data);
  }, 1000)
});

app.post('/mydata', function(req,res){
  setTimeout(function(){
    data.unshift(req.body);
    res.json(req.body);
  }, 1000);
});

app.get('*', function(req, res){
        res.sendfile('index.html');
        //res.send("Hello");
});

app.listen(9001);