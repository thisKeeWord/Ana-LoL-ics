var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// var sendingForm = require('./../client/champ.jsx');
// var history = require('./../Controller/controler.js');
// var mongoURI = 'mongodb://localhost/league';
// mongoose.connect(mongoURI);

// app.set('view engine', 'jsx');
app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './..')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.get('/', history.hello);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
});


// app.post('/', history.results);


app.listen(3000);
