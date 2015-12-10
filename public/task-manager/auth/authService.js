angular.module('TaskManager')
    .factory('Login', function ($resource) {
        return $resource('/api/login')
    })
    .factory('Logout', function ($resource) {
        return $resource('/api/logout')
    })
    .factory('Me', function ($resource) {
        return $resource('/api/me')
    })
    .factory('AuthService', function (Login, Logout, Me) {
        var self = {
            user: null,
            login: function (username, password) {
                return Login.save({username: username, password: password}).$promise
                    .then(function (user) {
                        self.user = user;
                        return user;
                    }, function (err) {
                        return err
                    });
            },
            logout: function () {
                return Logout.save().$promise
                    .then(function (res) {
                        self.user = null;
                        return res
                    })
            },
            hasUser: function () {
                return !!self.user;
            },
            me: function () {
                return Me.get().$promise
                    .then(function (user) {
                        self.user = user;
                    })
            }
        };
        return self
    });