var express = require('express');
//var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
//app.use(express.static('../public'));
//mongoose.connect('mongodb://localhost/task-manager');
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {  }
}));

require('./routes.js')(app);

var server = app.listen(5000, function () {
    //var host = server.address().address;
    var port = server.address().port;
    console.log('Now server is running on %s', port);
});
