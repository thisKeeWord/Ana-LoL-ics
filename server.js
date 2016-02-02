var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
// var sendingForm = require('./../client/champ.jsx');
var history = require('./controler.js');
// var mongoURI = 'mongodb://localhost/league';
// mongoose.connect(mongoURI);

// app.set('view engine', 'jsx');
app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, './..')));

app.get('/', history.hello);

// app.post('/', history.results);


app.listen(3000);
