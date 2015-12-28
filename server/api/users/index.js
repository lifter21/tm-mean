var User = require('../../models/user');

var form = require('express-form');
var field = form.field;

module.exports = function (app) {

    var UserForm = form(
        field('name').required().custom(function (name, source, next) {
            User.findOne({'local.name': name}, function (err, user) {
                if (err) {
                    return next(err)
                }
                if (user) {
                    return next(new Error("%s " + user.local.name + " is already used.") )
                }
                return next(null);
            })
        }),
        field('email').trim().required().isEmail(),
        field('password').trim().required().minLength(3),
        field('passConfirmation').trim().required().equals('field::password')
    );

    app.post('/api/users', UserForm, function (req, res, next) {

        if (req.form.isValid) {

            var user = new User({
                email: req.form.email,
                local:{
                    name: req.form.name,
                    password: req.form.password
                }
            });

            user.save(function (err, user) {
                if (err) {
                    return next(err)
                }
                user.local.passwordHash = undefined;
                user.local.passwordSalt = undefined;
                res.json(user)
            })
        } else {
            res.status(400).json(req.form.getErrors())
        }

    });

    app.get('/api/users', function (req, res, next) {
        User
            .find({}, '-local.passwordHash -local.passwordSalt', function (err, users) {
                if (err) {
                    return next(err);
                }
                res.json(users);
            })
    });

    app.get('/api/users/me', function (req, res, next) {
       res.json(req.User);
    });
};