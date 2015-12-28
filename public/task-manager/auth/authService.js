app
    .factory('Login', function ($resource) {
        return $resource('/api/login')
    })
    .factory('Logout', function ($resource) {
        return $resource('/api/logout')
    })
    .factory('Me', function ($resource) {
        return $resource('/api/users/me')
    })
    .factory('AuthService', function (Login, Logout, Me) {
        var self= {
            user: null,
            login: function (username, password) {
                return Login.save({username: username, password: password}).$promise
                    .then(function (user) {
                        self.user = user;
                        console.log(user.local.name, ' successfully logged in.');
                    }, function (err) {
                        console.log('User login error', err.data);
                    })
            },
            logout: function () {
                return Logout.save().$promise
                    .then(function () {
                        self.user = null;
                        console.log('Logged out successfully');
                    }, function (err) {
                        console.log('Logout err');
                    })
            },
            isUser: function () {
                return !!self.user;
            },
            Me: function () {
                Me.get().$promise.then(function (user) {
                    if (user.hasOwnProperty('local')) {
                        self.user = user;
                    }
                }, function (err) {
                    console.log("Can't get me", err.data);
                })
            }
        };

        return self;
    })
    //
;