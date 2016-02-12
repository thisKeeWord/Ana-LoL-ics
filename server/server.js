var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './..')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});


app.listen(3000);
