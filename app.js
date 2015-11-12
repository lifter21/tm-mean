/**
 * Created by alex on 10.11.15.
 */
var express = require('express');
var _ = require('lodash');
//var fs = require('fs')
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use('/', express.static('.'));

var tasks = [
        {
            id: 1,
            text: 'task 1 text'
        },
        {
            id: 2,

            text: 'task 2 text'
        }
];
var comments = [
    {
        id: 1,
        task_id: 1,
        user: 'user 1',
        text: 'com 1 text'
    },
    {
        id: 2,
        task_id: 1,
        user: 'user 1',
        text: 'com 2 text'
    },
    {
        id: 3,
        task_id: 2,
        user: 'user 1',
        text: 'comm 3 text'
    },
    {
        id: 4,
        task_id: 2,
        user: 'user 1',
        text: 'com 4 text'
    }
];

app.get('/api/tasks', function (req, res) {
    _.each(tasks, function(task) {
        var commentsCount = _.filter(comments, function (comment) {
            return comment.task_id == task.id
        })

        task.commentsCount = commentsCount.length;

    });

    res.json(tasks);

});

app.get('/api/tasks/:taskId', function (req, res) {
    var task = _.find(tasks, function (task) {
        return task.id == req.params.taskId
    })
    res.json(task);
});

app.get('/api/tasks/:taskId/comments/:commentId', function (req, res) {
    var comment = _.find(comments, function (comment) {
        return comment.id == req.params.commentId
    })
    res.json(comment);
});

app.get('/api/tasks/:taskId/comments', function (req, res) {
    var taskComments = _.filter(comments, function (comment) {
        return comment.task_id == req.params.taskId
    })
    res.json(taskComments);
});

app.post('/api/tasks', function (req, res) {
    var task = {id: Math.random()};
    task.text = req.body.text;
    tasks.push(task)
    res.json(task);
});

app.post('/api/tasks/:taskId/comments', function (req, res) {
    var comment = {id: Math.random()};
    comment.task_id = req.params.taskId;
    comment.text = req.body.text;
    comment.user = req.body.user;
    comments.push(comment)
    res.json(comment);
});

app.put('/api/tasks/:taskId', function (req, res) {
   var task = _.find(tasks, function (task) {
        return task.id == req.params.taskId
    })
    task.text = req.body.text;
    console.log(task);
    res.json(task)
});

app.put('/api/tasks/:taskId/comments/:commentId', function (req, res) {
   var comment = _.find(comments, function (comment) {
        return comment.id == req.params.commentId
    })
    comment.text = req.body.text;
    comment.user = req.body.user;
    console.log(comment);
    res.json(comment)
});

app.delete('/api/tasks/:taskId', function (req, res) {
    _.remove(tasks, function(task){
        return task.id == req.params.taskId
    })
    res.status(200).send();
});

app.delete('/api/tasks/:taskId/comments/:commentId', function (req, res) {
    _.remove(comments, function(comment){
        return comment.id == req.params.commentId
    })
    res.status(200).send();
});





var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)

});