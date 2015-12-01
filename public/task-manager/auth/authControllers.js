angular.module('TaskManager')
    .controller('LoginController', function ($scope, $state, AuthService) {
        $scope.form = {};

        $scope.login = function () {
            AuthService.login($scope.form.username, $scope.form.password).then(function () {
                $state.go('home');
            })
        }
    })
    .controller('LogoutController', function ($scope, $state, AuthService) {
        AuthService.logout().then(function () {
            $state.go('home');
        })

    });
