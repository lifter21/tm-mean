var express = require('express');
var _ = require('lodash');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task-man');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(express.static('.'));

var Task = require('./server/models/Tasks');
var Comment = require('./server/models/Comments');

app.get('/api/tasks', function (req, res) {
    Task.find({}, function (err, tasks) {
        res.send(tasks);
    })
});

app.post('/api/tasks', function (req, res) {
    var task = new Task();

    task.text = req.body.text;

    task.save(function (err, task) {
        res.status(201).json(task);
    })
});

app.param('taskId', function (req, res, next, id) {
    Task.findById(id, function (err, task) {
        if (task) {
            req.Task = task;
        } else {
            return res.status(404).send()
        }

        next();
    });
});

app.get('/api/tasks/:taskId', function (req, res) {
    res.send(req.Task);
});

app.put('/api/tasks/:taskId', function (req, res) {
    req.Task.text = req.body.text;

    req.Task.save(function (err, task) {

        res.json(task);

    })
});

app.delete('/api/tasks/:taskId', function (req, res) {
    req.Task.remove(function (err, task) {
        res.status(200).json(task);
    })
});

app.get("/api/tasks/:taskId/comments", function (req, res, next) {
    Comment.find({taskId: req.Task._id}, function (err, comments) {
        if (err) {
            return next(err)
        }
        res.json(comments)
    })
});

app.post("/api/tasks/:taskId/comments", function (req, res, next) {
    var comment = new Comment();

    comment.taskId = req.Task
    comment.text = req.body.text;
    comment.user = req.body.user;
    comment.save(function (err, comment) {
        if (err) {
            return next(err)
        }
        res.json(comment)

    });
});

app.param('commentId', function (req, res, next, id) {
    Comment.findById(id, function (err, comment) {
        if (err) {
            return next(err)
        }
        if (comment) {
            req.Comment = comment
        } else {
            return res.status(404).send()
        }

        next();
    })
});

app.put("/api/tasks/:taskId/comments/:commentId", function (req, res, next) {

    req.Comment.text = req.body.text;
    req.Comment.user = req.body.user;
    req.Comment.save(function (err, comment) {
        if (err) {
            return next(err)
        }
        res.json(comment)
    })

});

app.get("/api/tasks/:taskId/comments/:commentId", function (req, res) {
    res.json(req.Comment)
});

app.delete("/api/tasks/:taskId/comments/:commentId", function (req, res) {
    req.Comment.remove(function (err, comment) {
        if (err) {
            return next(err)
        }
        res.status(200).json(comment)
    })
});

var server = app.listen(4000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});