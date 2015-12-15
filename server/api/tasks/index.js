var Task = require('../../models/tasks');
var Comment = require('../../models/comments');

var form = require('express-form');
var field = form.field;

module.exports = function (app) {
    /* ----- Tasks ----- */

    var taskForm = form(
        field('text').required().minLength(3),
        field('users').array()
    );

    // for all routes with task make req.Task
    app.param('taskId', function (req, res, next, id) {
        Task
            .findOne({
                _id: id,
                $or: [
                    {creator: req.user._id},
                    {users: {$in: [req.user._id]}}
                ]
            })
            .populate('creator', '-password')
            .populate('users', '-password')
            .exec(function (err, task) {
                if (err) {
                    return next(err);
                }
                if (!task) {
                    return res.status(404).send();
                }

                req.task = task;
                next();
            });
    });

    app.get('/api/tasks', function (req, res, next) {
        Task
            .find({
                $or: [
                    {creator: req.user._id},
                    {users: {$in: [req.user._id]}}
                ]
            })
            .populate('creator', '-password')
            .exec(function (err, tasks) {
                if (err) {
                    return next(err)
                }
                res.json(tasks)
            })
    });

    app.post('/api/tasks', taskForm, function (req, res, next) {

        if (req.form.isValid) {
            var task = new Task({
                text: req.form.text,
                creator: req.user._id,
                users: req.form.users

            });
            task.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                res.json(task);
            })
        } else {
            res.status(400).json(req.form.getErrors())
        }
    });

    app.get('/api/tasks/:taskId', function (req, res) {
        res.json(req.task)
    });

    app.put('/api/tasks/:taskId', taskForm, function (req, res) {
        if (req.task.creator === req.user._id) {
            res.status(401).send();
        } else {
            if (req.form.isValid) {
                req.task.text = req.form.text;
                req.task.users = req.form.users;
                req.task.save(function (err, task) {
                    if (err) {
                        return next(err);
                    }
                    res.json(task);
                })

            } else {
                res.status(400).json(req.form.getErrors());
            }
        }

    });

    app.delete('/api/tasks/:taskId', function (req, res, next) {
        if (req.task.creator === req.user._id) {
            res.status(401).send();
        } else {
            req.task.remove(function (err, task) {
                if (err) {
                    return next(err);
                }
                res.json(task);
            })
        }
    });
};

