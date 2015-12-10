var Task = require('../../models/tasks');
var Comment = require('../../models/comments');

var form = require('express-form');
var field = form.field;

module.exports = function (app) {
    /* ----- Tasks ----- */

    var taskForm = form(
        field('text').required().minLength(3)
    );

    // for all routes with task make req.Task
    app.param('taskId', function (req, res, next, id) {
        Task.findOne({_id: id, user: req.user}, function (err, task) {
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
        Task.find({user: req.user}, function (err, tasks) {
            if (err) {
                return next(err)
            }
            res.json(tasks)
        })
    });

    app.post('/api/tasks', taskForm, function (req, res, next) {

        if (req.form.isValid) {

            var task = new Task({
                text: req.body.text, // sharedFor: req.body.sharedFor,
                user: req.user._id
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
    app.delete('/api/tasks/:taskId', function (req, res, next) {
        req.task.remove(function (err, task) {
            if (err) {
                return next(err);
            }
            res.json(task);
        })
    });

    app.get('/api/tasks/:taskId', function (req, res) {
        req.task.set("commentsCount", 4)
        res.json(req.task)
    });

    app.put('/api/tasks/:taskId', taskForm, function (req, res) {
        if (req.form.isValid) {
            req.task.text = req.body.text;
            req.task.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                res.json(task);
            })

        } else {
            res.status(400).json(req.form.getErrors());
        }
    });
};