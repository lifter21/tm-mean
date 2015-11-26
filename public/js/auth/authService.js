/**
 * Created by alex on 25.11.15.
 */
angular.module('TaskManager')
    .factory('AuthService', function (Login, Logout, Me) {
        var self = {

            user: null,

            login: function (username, password) {
                return Login.save({username: username, password: password}).$promise
                    .then(function (user) {
                        self.user = user;
                        return user;
                    })
            },
            logout: function () {
                return Logout.save().$promise
                    .then(function (response) {
                        self.user = null;
                        return response
                    });
            },
            hasUser: function () {
                return !!this.user;
            },
            load: function () {
                return Me.get().$promise
                    .then(function (user) {
                        self.user = user
                        return user
                    })
            }
        };

        return self
    })
    .factory('Login', function ($resource) {
        return $resource('/api/login')
    })
    .factory('Logout', function ($resource) {
        return $resource('/api/logout')
    })
    .factory('Me', function ($resource) {
        return $resource('/api/me')
    });