var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/task-manager');

// Load working models
var User = require('./models/user')(mongoose)
//var Comment = require('./models/comment')(mongoose);
//var Task = require('./models/task')(mongoose);

// Form data validations
var form = require("express-form");
var field = form.field;


module.exports = function (app) {
    /* -----------    Session      ----------- */

    app.use(function (req, res, next) {
        if (req.session.userId) {
            User.findById(req.session.userId, '-password', function (err, user) {
                if (err) {
                    return next(err)
                }

                if (!user) {
                    req.session.destroy();
                    return next()
                }
                req.user = user;
                return next()
            })
        } else {
            next();
        }
    });

    function isAuth(req, res, next) {
        console.log('IsAuth');
        if (!req.user) {
            return res.status(401).send()
        }
        return next()
    }

    app.use('/api/tasks', isAuth);
    app.use('/api/me', isAuth);
    //app.use('/api', isAuth);

    app.get('/api/me', function (req, res, next) {
        res.json(req.user)
    });
    app.post('/api/login', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        console.log('user', User);
        User.findOne({name: username}, function (err, user) {
            if (err) {
                return next(err);
            }
            console.log('User', user);
            if (!user) {
                return res.status(404).send();
            }
            console.log(typeof user.password);
            if (user && user.password !== password) {

                return res.status(401).send();
            }
            req.session.userId = user._id;
            user.password = undefined;
            res.json(user);
        })
    });
    app.post('/api/logout', function (req, res, next) {
        req.session.destroy();
        req.user = undefined;
        res.status(200).send();
    })

    /* -----------    Users      ----------- */


    /* -----------    Tasks      ----------- */


    /* -----------    Comments      ----------- */


}