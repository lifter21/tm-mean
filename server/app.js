var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task-manager');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: 'sdkbvkjdbvdjvbf',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 4*7*24*60*60*1000 }
}));

app.use(express.static('public'));

require('./routes')(app);

var server = app.listen(4000, function () {
    var port = server.address().port;
    console.log('Now server is running on %s port...', port);
});