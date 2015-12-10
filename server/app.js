var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task-manager');

var session = require('express-session');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

app.use(session({
    secret: 'some difficult super secret key or SSH key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 4*7*24*60*60*1000 }
}));

require('./routes/routes')(app);

// server
var server = app.listen(5000, function () {
    var port = server.address().port;
    console.log('Now server is running on %s port', port);
});