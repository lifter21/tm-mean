var User = require('../../models/users');

module.exports = function (app) {
    /* ----- Session ----- */

    // req.session.userId --> req.user
    app.use(function (req, res, next) {
        if (req.session.userId) {
            User.findById(req.session.userId, '-password', function (err, user) {
                if (err) {
                    return next(err)
                }

                if (!user) {
                    req.session.destroy();
                    return res.status(401).send()
                }

                req.user = user;
                return next();
            })
        } else {
            return next()
        }
    });

    // isAuth()
    function isAuth(req, res, next) {
        if (!req.user) {
            res.status(401).send()
        } else {
            return next()
        }
    }

    // use isAuth on routes
    app.use('/api/tasks', isAuth);
    app.use('/api/me', isAuth);

    // Login
    app.post('/api/login', function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        User.findOne({name: username}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).send();
            }
            if (user && user.password !== password) {
                return res.status(400).send();
            }
            req.session.userId = user._id;
            user.password = undefined;
            res.json(user);
        });
    });

    // Logout
    app.post('/api/logout', function (req, res) {
        req.session.destroy();
        //req.user = null
        res.status(200).send();
    });
};