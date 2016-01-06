var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var Config = require('../config/config');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, '-local.passwordHash -local.passwordSalt', function (err, user) {
            done(err, user);
        });
    });

    // ----------------------------- Local strategy ------------------------- //
    passport.use(new LocalStrategy(
        function (username, password, done) {
            var query = {
                $or: [
                    {email: username},
                    {'local.name': username}
                ]
            };

            User.findOne(query, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user || !user.validPassword(password)) {
                    return done(null, false, {message: 'Invalid login credentials...'});
                }
                //if (!user.validPassword(password)) {
                //    return done(null, false, {message: 'Incorrect password.'});
                //}

                return done(null, user);
            });
        }
    ));

    //    ------------------------- Facebook strategy ----------------------- //

    passport.use(new FacebookStrategy({
            clientID: Config.facebookAuth.clientID,
            clientSecret: Config.facebookAuth.clientSecret,
            callbackURL:  Config.host.url + Config.facebookAuth.callbackURL,
            profileFields: ['id', 'displayName', 'emails'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            if (!req.user) {

                var query = {
                    $or: [
                        {'facebook.id': profile.id},
                        {'facebook.email': profile.emails[0].value},
                        { email: profile.emails[0].value}
                    ]
                };

                User.findOne(query, function (err, user) {
                    if (err) return done(err);

                    if (!user) {
                        var newUser = new User({
                            'facebook.id': profile.id,
                            'facebook.token': accessToken,
                            'facebook.email': profile.emails[0].value,
                            first: profile.displayName.split(' ')[0],
                            last: profile.displayName.split(' ')[1],
                            email: profile.emails[0].value
                        });
                        
                        newUser.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, newUser)
                        });
                    } 
                    
                    if (!user.facebook.id) {
                        user.facebook.id = profile.id;
                        user.facebook.email = profile.emails[0].value;
                        user.facebook.token = accessToken;
                        user.save(function (err) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, user)
                        })
                    } else {
                        return done(null, user)
                    }
                })

            } else {
                req.user.facebook.id= profile.id;
                req.user.facebook.token = accessToken;
                req.user.facebook.email = profile.emails[0].value;
                req.user.first = req.user.first || profile.displayName.split(' ')[0];
                req.user.last = req.user.last || profile.displayName.split(' ')[1];
                req.user.email = req.user.emai || profile.emails[0].value;
                
                req.user.save(function (err) {
                    if (err) {
                        return done(err);
                    }

                    return done(null, req.user);
                })
            }
        }
    ));
};