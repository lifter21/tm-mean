var Task = require('../models/tasks');
var Comment = require('../models/comments');

module.exports = function (app) {

    app.param('taskId', function (req, res, next, id) {
        Task.findById(id, function (err, task) {
            if (err) {
                return next(err);
            }
            if (task) {
                req.Task = task;
            } else {
                res.status(404).send();
            }
            next();
        })
    });

    app.get('/api/tasks', function (req, res, next) {

        Task.find({}, function (err, tasks) {
            if (err) {
                return next(err);
            }

            res.status(200).json(tasks);
        });
    });
    app.post('/api/tasks', function (req, res, next) {

        Task.create({text: req.body.text}, function (err, task) {
            if (err) {
                return next(err);
            }
            res.status(200).json(task);
        });
    });
    app.get('/api/tasks/:taskId', function (req, res, next) {

        Task.findById(req.Task, function (err, task) {
            if (err) {
                return next(err);
            }
            res.status(200).json(task);
        });
    });
    app.put('/api/tasks/:taskId', function (req, res, next) {

        Task.update(req.Task, {text: req.body.text}, function (err, task) {
            if (err) {
                return next(err);
            }
            res.status(200).json(task);
        });
    });
    app.delete('/api/tasks/:taskId', function (req, res, next) {

        Task.remove(req.Task, function (err) {
            if (err) {
                return next(err);
            }
            Comment.remove({taskId: req.Task}, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send();
                }
            );
        });
    });


    ////////////////// Comments  ////////////////////////

    app.param('commentId', function (req, res, next, id) {
        Comment.findById(id, function (err, comment) {
            if (err) {
                return next(err);
            }
            if (comment) {
                req.Comment = comment;
            } else {
                res.status(404).send();
            }
            next();
        })
    });

    app.get('/api/tasks/:taskId/comments', function (req, res, next) {

        Comment.find({taskId: req.Task}, function (err, comments) {
            if (err) {
                return next(err);
            }

            res.status(200).json(comments);
        });
    });
    app.post('/api/tasks/:taskId/comments', function (req, res, next) {

        Comment.create({taskId: req.Task._id, text: req.body.text, user: req.body.user}, function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        });
    });
    app.get('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {

        Comment.findById(req.Comment, function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        });
    });
    app.put('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {

        Comment.update(req.Comment, {text: req.body.text, user: req.body.user}, function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        });
    });
    app.delete('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {

        Comment.remove(req.Comment, function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        });
    });
};


