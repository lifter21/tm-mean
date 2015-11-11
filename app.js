/**
 * Created by alex on 10.11.15.
 */
var express = require('express');
//var fs = require('fs')
var app = express();


app.use('/', express.static('.'));

var tasks = [{name: 1}];

app.get('/api/tasks', function (req, res) {

    res.json(tasks)
});





var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

});