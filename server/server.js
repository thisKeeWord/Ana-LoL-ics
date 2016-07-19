var dotenv = require('dotenv').config({ path: 'config.env' });
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fallback = require('express-history-api-fallback');
var nodemailer = require('nodemailer');
var controller = require('./../Controller/controler.js');
var transporter = nodemailer.createTransport('smtps://l' + process.env.stuff5 + process.env.stuff6 + 'i.edu:' + process.env.stuff7 + '@smtp.gmail.com');
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

app.post('/sendEmail', function(req, res) {
	console.log(req.body);
	var afterSent = 0;
	var mailOptions = {
    from: req.body.userEmail + '"👥" <user@ana-lol-ics.xyz>', // sender address 
    to: 'leonardwkee@gmail.com,' + req.body.userEmail, // list of receivers 
    subject: req.body.emailTopic + '✔', // Subject line 
    text: 'Hello world 🐴', // plaintext body 
    html: '<b>' + req.body.emailBody + '</b>' // html body 
	};
 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
	  if(error) return console.log(error);
		res.status(200).send(['bro']);
	})
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
