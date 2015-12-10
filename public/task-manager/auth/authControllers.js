angular.module('TaskManager')
    .controller('LoginController', function ($scope, $state, AuthService) {
        $scope.form = {};
        $scope.login = function () {
            AuthService.login($scope.form.username, $scope.form.password)
                .then(function (user) {
                    if (!!user._id) {
                        $state.go('home');
                    } else {
                        $scope.form = {};
                        $scope.formError = 'Invalid login data..'
                    }

                });
        }
    })
    .controller('LogoutController', function ($scope, $state, AuthService) {
        AuthService.logout().then(function (resp) {
            $state.go('login')
        })
    });