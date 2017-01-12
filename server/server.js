var dotenv = require('dotenv').config({ path: 'config.env' });
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fallback = require('express-history-api-fallback');
var controller = require('./../Controller/controler.js');
var mongoURI = 'mongodb://lkee:' + process.env.stuff4 + '@ds011439.mlab.com:11439/heroku_wk47xfd5';
mongoose.connect(mongoURI);

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './../client/')));
app.use('/bower_components',  express.static( path.join(__dirname + './../bower_components')));
app.use(fallback('index.html', { root: __dirname + './../client/' }))


app.get('/', function(req, res) {
  res.sendFile('index.html')
});

app.post('/', controller.userInformation, controller.matchList);

app.post('/getGameData', controller.getData);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
