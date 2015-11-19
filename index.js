var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task-manager');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public/'));


require('./server/routes/routes')(app);

var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is now running on: http://%s:%s', host, port);
});