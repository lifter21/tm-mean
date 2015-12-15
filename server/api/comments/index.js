var Comment = require('../../models/comments');

var form = require('express-form');
var field = form.field;

module.exports = function (app) {
    /* ----- Comments ----- */
    var commentForm = form(
        field('text').required().minLength(2)
    );

    app.param("commentId", function (req, res, next, id) {
        Comment
            .findById(id)
            .populate('creator', '-password')
            .populate('task')
            .exec(function (err, comment) {
            if (err) {
                return next(err);
            }
            if (!comment) {
                return res.status(404).send('no such comment');
            }
            req.comment = comment;
            next();
        });

    });

    app.get('/api/tasks/:taskId/comments', function (req, res, next) {
        Comment
            .find({task: req.task})
            .populate('creator', '-password')
            .exec(function (err, comments) {
                if (err) {
                    return next(err);
                }
                res.json(comments);
            })
    });

    app.post('/api/tasks/:taskId/comments', commentForm, function (req, res, next) {
        if (req.form.isValid) {
            var comment = new Comment({
                task: req.task,
                creator: req.user,
                text: req.body.text
            });
            comment.save(function (err, comment) {
                if (err) {
                    return next(err);
                }
                res.json(comment);
            })
        } else {
            res.status(400).json(req.form.getErrors());
        }

    });

    app.get('/api/tasks/:taskId/comments/:commentId', commentForm, function (req, res) {
        res.json(req.comment)
    });

    app.put('/api/tasks/:taskId/comments/:commentId', commentForm, function (req, res, next) {
        //req.comment
        if (req.form.isValid) {

            req.comment.text = req.body.text;

            req.comment.save(function (err, comment) {
                if (err) {
                    return next(err)
                }
                res.json(comment);
            })
        } else {
            res.status(400).json(req.form.getErrors());
        }
    });

    app.delete('/api/tasks/:taskId/comments/:commentId', function (req, res, next) {
        req.comment.remove(function (err, comment) {
            if (err) {
                return next(err)
            }
            res.json(comment);
        })
    });
};