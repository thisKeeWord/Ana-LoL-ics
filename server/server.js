var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var controller = require('./../Controller/controler.js');
var stuff = require('./../stuff.js');
var port = process.env.PORT || 5000;
var mongoURI = 'mongodb://lkee:' + process.env.stuff3 + '@ds011439.mlab.com:11439/heroku_wk47xfd5';
mongoose.connect(mongoURI);


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './..')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/', controller.userInformation, controller.matchList);

app.post('/found', controller.matchList);

app.post('/getGameData', controller.getData);

app.listen(port);
