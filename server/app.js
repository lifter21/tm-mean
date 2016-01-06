var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var Config = require('./config/config');

var app = express();

mongoose.connect(Config.mongo.uri);

// app configuration ----------->

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// session
app.use(session({
    secret: Config.session.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1*7*24*60*60*1000 }, // 1 week(s)
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// passport strategies
require('./config/passport')(passport);

app.use(express.static('public'));

// <----------------------

// app routes
require('./routes')(app, passport);

// app server
var server = app.listen(Config.app.port, function () {
    var port = server.address().port;
    console.log('Now server is running on %s port...', port);
});