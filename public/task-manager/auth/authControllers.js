app
    .controller('LoginController', function ($scope, $state, AuthService) {
        $scope.login = function () {
            AuthService.login($scope.user.name, $scope.user.password)
                .then(function (user) {
                    $state.go('app.tasks')
                })
        }
    })
    .controller('LogoutController', function ($scope, $state, AuthService) {
        AuthService.logout().then(function () {
            $state.go('app.login')
        })
    })
;