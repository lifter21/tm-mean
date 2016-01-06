app
    .factory("User", function ($resource) {
        return $resource(
            '/api/users/:userId',
            {
                userId: "@_id"
            },
            {
                update: {
                    method: "PUT"
                }
            })
    })
    .factory("UserRegistration", function ($resource) {
        return $resource('/api/register')
    })
    .factory('UserService', function (User, UserRegistration) {
        var self = {

            getUsers: function () {
                return User.query(
                    function (users) {
                        console.log('Users successfully loaded...');
                    },
                    function (err) {
                        console.log('Error while loading users: ', err.data);
                    })
                    .$promise;
            },

            getUser: function (userId) {
                return User.get(
                    {
                        userId: userId
                    },
                    function (user) {
                        console.log('User successfully loaded...');
                    },
                    function (err) {
                        console.log('Error while getting user: ', err.data);
                    })
                    .$promise
            },

            newUser: function () {
                return new UserRegistration();
            },

            saveUser: function (user) {
                return user.$save(
                    function (user) {
                        console.log('User created:', user);
                    },
                    function (err) {
                        console.log('Errors while user saving: ', err.data);
                    });
            }
        };

        return self
    })
;