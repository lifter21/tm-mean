/**
 * Created by alex on 27.11.15.
 */
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
                        console.log('succsess');

                        self.user = user
                        return user
                    }, function (err) {
                        console.log('err');
                        return err
                        //$scope.formErrors = err
                    })
            },
            logout: function () {
                return Logout.save().$promise
                    .then(function (resp) {
                        self.user = null;
                        return resp
                    })
            },
            hasUser: function () {
                return !!self.user
            },
            me: function () {

                return Me.get().$promise
                    .then(function (user) {
                        self.user = user
                    })
            }
        }
        return self
    });