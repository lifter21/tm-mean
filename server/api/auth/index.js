var User = require('../../models/user');

module.exports = function (app, passport) {

    //app.use(function (req, res, next) {
    //    if (req.session.userId) {
    //        User.findById(req.session.userId, '-local.passwordHash -local.passwordSalt',function (err, user) {
    //            if (err) {
    //                return next(err);
    //            }
    //            if (!user) {
    //                req.session.destroy();
    //                return res.status(401).send();
    //            }
    //            req.User = user;
    //            next();
    //        })
    //    } else {
    //        return next();
    //    }
    //} );

    function isAuth(req, res, next) {
        if (req.user) {
            return next();
        } else {
            return res.status(401).send();
        }
    }

    app.use('/api/tasks', isAuth);
    app.use('/api/users', isAuth);

    app.post('/api/login', passport.authenticate('local', {
        successRedirect: '/api/users/me',
        failureRedirect: '/api/unauthorized'
    }));

    //    , function(err, user, info) {
    //    if (err) { return next(err); }
    //
    //    if (!user) { return res.status(403).send(); }
    //
    //    req.logIn(user, function(err) {
    //        if (err) { return next(err); }
    //        return res.redirect('/api/users/me');
    //    });
    //})(req, res, next);

    //User.findOne({'local.name': req.body.username}, function (err, user) {
    //    if (err) {
    //        return next(err);
    //    }
    //    if (!user || !user.validPassword(req.body.password) ) {
    //        return res.status(401).json({'loginError': 'invalid login data'});
    //    }
    //    req.session.userId = user._id;
    //
    //    user.local.passwordHash = undefined;
    //    user.local.passwordSalt = undefined;
    //
    //    res.json(user);
    //
    //})
    //});

    app.post('/api/logout', function (req, res, next) {
        req.logout();
        //req.session.destroy();
        res.sendStatus(200);
    });

    app.get('/api/users/me', function (req, res, next) {
        res.json(req.user);
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: 'email'})
    );
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/api/unauthorized'
        }));

    app.get('/api/unauthorized', function (req, res, next) {
        res.status(401).json({'loginError': 'invalid login data'});
    });
};