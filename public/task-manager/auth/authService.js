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
                return Login.save({username: username, password: password}, function (user) {
                    self.user = user;
                    console.log(user.local.name, ' successfully logged in.');
                }, function (err) {
                    console.log('User login error', err.data);
                }).$promise

            },
            logout: function () {
                return Logout.save(function () {
                    self.user = null;
                    console.log('Logged out successfully');
                }, function (err) {
                    console.log('Logout err');
                }).$promise
            },
            isUser: function () {
                return !!self.user;
            },
            Me: function () {
                Me.get(function (user) {
                    if (user.hasOwnProperty('local')) {
                        self.user = user;
                    }
                }, function (err) {
                    console.log("Can't get me", err.data);
                }).$promise;
            }
        };

        return self;
    })
    //
;