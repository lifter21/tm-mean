var User = require('../../models/users');

var form = require('express-form');
var field = form.field;

module.exports = function (app) {
    /* ----- users ----- */
    // Me
    app.get('/api/me', function (req, res) {
        res.json(req.user)
    });

    var UserForm = form(
        field('name').required().minLength(3)
            .custom(function (name, payload, callback) {
                User.findOne({name: name}, '-password', function (err, user) {

                    if (err) {
                        return callback(err);
                    }

                    if (user) {
                        return callback(new Error('user %s is already used!'));
                    }

                    callback();
                });
            }),
        field('email').required().isEmail(),
        field('password').required().minLength(3),
        field('confirmation').required().equals("field::password", "confirmation is not equals to pass")
    );


    app.get('/api/users', function (req, res, next) {
        User.find({}, '-password -email', function (err, users) {
            if (err) {
                return next(err);
            }
            res.json(users);
        })
    });

    app.post('/api/users', UserForm, function (req, res, next) {
        if (req.form.isValid) {
            var user = new User({
                name: req.form.name,
                email: req.form.email,
                password: req.form.password
            });
            user.save(function (err, user) {
                if (err) {
                    return next(err);
                }
                user.password = undefined;
                res.json(user);
            });
        } else {
            res.status(400).json(req.form.getErrors());
        }

    });
};