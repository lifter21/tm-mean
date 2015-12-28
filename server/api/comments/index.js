var Comment = require('../../models/comment');
var form = require('express-form');
var field = form.field;

module.exports = function (app) {

    var CommentForm = form(
        field('text').trim().required()
    );

    var CommentCreatorPermissions = function (req, res, next) {
        if (req.Comment.isCreator(req.User)) {
            next();
        } else {
            res.status(403).send('No permissions for comment editing.');
        }
    };

    app.param('commentId', function (req, res, next, commentId) {
        Comment.findOne({
            _id: commentId,
            task: req.Task
        })
            .populate('task')
            .populate('creator', 'email local.name')
            .exec(function (err, comment) {
                if (err) {
                    return next(err);
                }

                req.Comment = comment;
                next();
            })
    });

    app.post('/api/tasks/:taskId/comments', CommentForm, function (req, res, next) {

        if (req.form.isValid) {
            var newComment = new Comment({
                creator: req.User,
                task: req.Task,
                text: req.form.text
            });
            newComment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.json(comment);
            })
        } else {
            res.status(400).json(req.form.getErrors());
        }

    });

    app.get('/api/tasks/:taskId/comments', function (req, res, next) {
        Comment
            .find({task: req.Task})
            .populate('task')
            .populate('creator', 'email local.name')
            //.sort({createdAt: -1})
            .exec(function (err, comments) {
                if (err) {
                    return next(err);
                }
                res.json(comments)
            })
    });

    app.get('/api/tasks/:taskId/comments/:commentId', function(req, res, next) {
        res.json(req.Comment);
    });

    app.put('/api/tasks/:taskId/comments/:commentId', CommentForm, CommentCreatorPermissions, function(req, res, next) {
        if (req.form.isValid) {
            req.Comment.text = req.form.text;
            req.Comment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.json(comment);
            })
        } else {
            res.status(400).json(req.form.getErrors());
        }
    });

    app.delete('/api/tasks/:taskId/comments/:commentId', CommentCreatorPermissions, function(req, res, next) {
        req.Comment.remove(function (err, comment) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        })
    });
};