var User = require('../../models/user');

module.exports = function (app) {

    app.use(function (req, res, next) {
        if (req.session.userId) {
            User.findById(req.session.userId, '-local.passwordHash -local.passwordSalt',function (err, user) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.session.destroy();
                    return res.status(401).send();
                }
                req.User = user;
                next();
            })
        } else {
            return next();
        }
    } );

    function isAuth(req, res, next) {
        if (req.User) {
            return next();
        } else {
            return res.status(401).send();
        }
    }

    app.use('/api/tasks', isAuth);
    app.use('/api/users', isAuth);

    app.post('/api/login', function (req, res, next) {
        User.findOne({'local.name': req.body.username}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user || !user.validPassword(req.body.password) ) {
                return res.status(401).json({'loginError': 'invalid login data'});
            }
            req.session.userId = user._id;

            user.local.passwordHash = undefined;
            user.local.passwordSalt = undefined;

            res.json(user);

        })
    });

    app.post('/api/logout', function (req, res, next) {
        req.session.destroy();
        res.status(200).send();
    });
}