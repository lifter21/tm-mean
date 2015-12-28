var Task = require('../../models/task');

var form = require('express-form');
var field = form.field;


module.exports = function (app) {
    var TaskForm = form(
        field('text').trim().required().minLength(2),
        field('users').array()
    );

    var TaskCreatorPermissions = function (req, res, next) {
        if (req.Task.isCreator(req.User)) {
            next();
        } else {
            res.status(403).send('No permissions for task editing');
        }
    };

    app.param('taskId', function (req, res, next, taskId) {
        Task.findOne({
            _id: taskId,
            $or: [
                {creator: req.User},
                {users: req.User}
            ]
        })
            .populate('creator', '-local.passwordHash -local.passwordSalt')
            .populate('users', '-local.passwordHash -local.passwordSalt')
            .exec(function (err, task) {
                if (err) {
                    return next(err)
                }
                if (!task) {
                    return res.status(404).send();
                }
                req.Task = task;
                next();
            })
    });

    app.get('/api/tasks', function (req, res, next) {
        Task.find({
            $or: [
                {creator: req.User},
                {users: req.User}
            ]
        })
            .populate('creator', '-local.passwordHash -local.passwordSalt')
            .populate('users', '-local.passwordHash -local.passwordSalt')
            .sort({creator: -1, createdAt: -1})
            .exec(function (err, tasks) {
                if (err) {
                    return next(err)
                }
                res.json(tasks)
            })
    });

    app.get('/api/tasks/:taskId', function (req, res) {
        res.json(req.Task)
    });

    app.put('/api/tasks/:taskId', TaskForm, TaskCreatorPermissions, function (req, res, next) {
        if (req.form.isValid) {
            req.Task.text = req.form.text;
            req.Task.users = req.form.users;

            req.Task.save(function (err, task) {
                if (err) {
                    return next(err);
                }
                return res.json(task);
            })
        } else {
            res.status(400).json(req.form.getErrors())
        }
    });

    app.delete('/api/tasks/:taskId', TaskCreatorPermissions, function (req, res, next) {
        req.Task.remove(function (err, task) {
            if (err) {
                return next(err);
            }
            res.json(task);
        })
    });

    app.post('/api/tasks', TaskForm, function (req, res, next) {
        if (req.form.isValid) {
            var task = new Task({
                creator: req.User,
                text: req.form.text,
                users: req.form.users
            });

            task.save(function (err, task) {
                if (err) {
                    return next(err)
                }
                res.json(task)
            })
        } else {
            res.status(400).json(req.form.getErrors())
        }
    });
};