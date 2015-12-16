angular.module('TaskManager')
    .factory('User', function ($resource) {

        return $resource('/api/users/:userId', {'userId': '@_id'}, {update: {method: 'PUT'}})

    })
    .controller('UsersController', function ($scope, $state, User) {

        $scope.user = new User();

        function validateRegistrationForm() {
            // Client validation messages
            if (!$scope.user.name) {
                $scope.nameErrors = ['Name field is required']
            } else {
                $scope.nameErrors = [];
            }

            if (!$scope.user.password) {
                $scope.passErrors = ['Password field is required']
            } else {
                $scope.passErrors = [];
            }

            if ($scope.user.password !== $scope.user.confirmation) {
                $scope.passConfErrors = ['password confirmation is not equal to password']
            } else {
                $scope.passConfErrors = []
            }

            if (!$scope.user.email) {
                $scope.emailErrors = ['Email field is required']
            } else {
                $scope.emailErrors = [];
            }

        }

        //@@TODO ng form
        $scope.register = function (form) {

            //form.isValid()
            validateRegistrationForm();

            if ($scope.user.name && $scope.user.password && $scope.user.email && $scope.user.confirmation === $scope.user.password) {
                $scope.user.$save({
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmation: $scope.user.confirmation
                })
                    .then(function (user) {
                        $state.go('login')
                    }, function (err) {
                        //$scope.formErrors = err.data;
                        //$scope.error = err.data;
                        //
                        $scope.nameErrors = err.data.name;
                        $scope.passConfErrors = err.data.confirmation;
                        $scope.emailErrors = err.data.email;
                        $scope.passErrors = err.data.password;
                    });
            }
        }
    });