var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/task-manager');

app.use(session({
    secret: '$password-hash',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public/'));

require('./server/routes/routes')(app);

var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is now running on: http://%s:%s', host, port);
});