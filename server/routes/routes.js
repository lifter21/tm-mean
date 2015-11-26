var Task = require('../models/tasks');
var Comment = require('../models/comments');
var User = require('../models/users');

var form = require('express-form');
var field = form.field;


module.exports = function (app) {

    app.use(function (req, res, next) {
        if (req.session.userId) {
            User.findById(req.session.userId, '-password', function (err, user) {
                if (err) {
                    return next(err)
                }

                if (!user) {
                    delete req.session.userId;
                    return next();
                }

                req.user = user;
                next();
            })
        } else {
            next();
        }
    });

    var isAuth = function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(401).send();
        }
    };

    app.use('/api/tasks', isAuth);
    app.use('/api/me', isAuth);

    var taksForm = form(
        field("text").required()
    );
    var commentForm = form(
        field('text').required(),
        field('user').required()
    );

    app.param('taskId', function (req, res, next, id) {
        Task.findOne({_id: id, user: req.user}, function (err, task) {
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
        Task.find({user: req.user}, function (err, tasks) {
            if (err) {
                return next(err);
            }

            res.status(200).json(tasks);
        });
    });

    app.post('/api/tasks', taksForm, function (req, res, next) {
        if (req.form.isValid) {
            var newTask = new Task({text: req.body.text, user: req.user})
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
        Comment.findOne({_id: id, task: req.Task}, function (err, comment) {
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
            res.status(400).json(req.form.getErrors())
        }
        //Comment.create();
    });

    app.get('/api/tasks/:taskId/comments/:commentId', function (req, res) {
        res.status(200).json(req.Comment);
    });

    app.put('/api/tasks/:taskId/comments/:commentId', commentForm, function (req, res, next) {
        if (req.form.isValid) {
            req.Comment.text = req.body.text;
            req.Comment.user = req.body.user;
            req.Comment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(comment);
            })
        } else {
            res.status(400).json(req.form.getErrors())
        }
    });

    app.delete('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {
        req.Comment.remove(function (err, comment) {
            if (err) {
                return next(err);
            }
            res.status(200).json(comment);
        })
    });

    app.post('/api/login', function (req, res, next) {
        var userName = req.body.username;
        var userPassword = req.body.password;
        User.findOne({name: userName}, function (err, user) {

            if (err) {
                return next(err)
            }

            if (user && user.password === userPassword) {
                req.session.userId = user._id;
                user.password = undefined;
                res.json(user);
            } else {
                res.status(400).send()
            }

        })
    });

    app.post('/api/logout', function (req, res, next) {

        req.session.destroy(function (err) {
            if (err) {
                return next(err)
            }
            res.status(200).send()
        });
    });

    app.get('/api/me', function (req, res, next) {
        res.json(req.user)
    });
};