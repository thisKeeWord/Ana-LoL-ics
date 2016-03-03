var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var controller = require('./../Controller/controler.js');


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './..')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/', controller.userInformation, controller.matchList);

app.post('/found', controller.matchList);

app.post('/getGameData', controller.getData);

app.listen(3000);
