var Task = require('../models/tasks');
var Comment = require('../models/comments');
var form = require('express-form');
var field = form.field;

module.exports = function (app) {

    var taksForm = form(
        field("text").required()
    );
    var commentForm = form(
        field('text').required(),
        field('user').required()
    );

    app.param('taskId', function (req, res, next, id) {
        Task.findById(id, function (err, task) {
            if (err) {
                return next(err);
            }
            if (task) {
                req.Task = task;
                next();
            } else {
                res.status(404).send();
            }
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


    app.post('/api/tasks', taksForm, function (req, res, next) {
        if (req.form.isValid) {
            var newTask = new Task({text: req.body.text})
            newTask.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(task);
            });
        } else {
            res.status(400).json(req.form.errors);
        }
    });

    app.get('/api/tasks/:taskId', function (req, res) {
        res.status(200).json(req.Task);
    });

    app.put('/api/tasks/:taskId', taksForm, function (req, res, next) {
        if (req.form.isValid) {
            req.Task.text = req.body.text;
            req.Task.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(task);
            })
        } else {
            res.status(400).json(req.form.errors);
        }

        //Task.update(, );
    });
    app.delete('/api/tasks/:taskId', function (req, res, next) {
        req.Task.remove(function (err, task) {
            //console.log(task);
            //console.log();
            if (err) {
                return next(err);
            }
            //Comment.remove({taskId: req.Task}, function (err) {
            //        if (err) {
            //            return next(err);
            //        }
            //        res.status(200).json(task);
            //    }
            //);
            res.status(200).json(task);
        });

        //Task.remove(, );
    });


    ////////////////// Comments  ////////////////////////

    app.param('commentId', function (req, res, next, id) {
        Comment.findById(id, function (err, comment) {
            if (err) {
                return next(err);
            }
            if (comment) {
                req.Comment = comment;
                next();
            } else {
                res.status(404).send();
            }
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
    app.post('/api/tasks/:taskId/comments', commentForm, function (req, res, next) {
        if (req.form.isValid) {
            var newComment = new Comment({taskId: req.Task._id, text: req.body.text, user: req.body.user});
            newComment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(comment);
            });
        } else {
            res.status(400).json(req.form.errors)
        }
        //Comment.create();
    });

    app.get('/api/tasks/:taskId/comments/:commentId', function (req, res) {
        res.status(200).json(req.Comment);
    });

    app.put('/api/tasks/:taskId/comments/:commentId', commentForm, function (req, res, next) {
        if (req.form.isValid) {
            req.Comment.text = req.body.text
            req.Comment.user = req.body.user
            req.Comment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(comment);
            })
        } else {
            res.status(400).json(req.form.errors)
        }
    });
    app.delete('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {
        req.Comment.remove(function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        })
        //Comment.remove(req.Comment, );
    });
};


