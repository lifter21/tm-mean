app
    .controller('UserRegistrationController', function ($scope, $state, UserService) {

        $scope.user = UserService.newUser();

        $scope.register = function () {
           UserService.saveUser( $scope.user).then(function (user) {
                $state.go('app.login');
            }, function (err) {
                $scope.formErrors = err.data;
            })
        }
    });