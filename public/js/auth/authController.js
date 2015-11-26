/**
 * Created by alex on 25.11.15.
 */
angular.module('TaskManager')
    .controller('LoginController', function ($scope, $state, AuthService) {
        $scope.form = {};

        $scope.login = function () {
            AuthService.login($scope.form.username, $scope.form.password)
                .then(function () {
                    $state.go('home');
                }, function (resp) {
                    $scope.error = 'Incorrect pair'
                });
        };

    })
    .controller('LogoutController', function ($scope, $state, AuthService) {

        AuthService.logout().then(function () {
            $state.go('login')
        });

    });
