app
    .controller("TaskFormController", function ($scope, $state, $stateParams, AuthService, UserService, Task) {
        //$scope.user = {};
        UserService.getUsers()
            .then(
            function (users) {
                $scope.users = users.filter(function (user) {
                    return user._id !== AuthService.user._id;
                });
            });

        if ($stateParams.taskId) {
            Task.get({taskId: $stateParams.taskId}).$promise
                .then(
                function (task) {
                    $scope.task = task;
                }, function (err) {
                    console.log(err.data);
                })
        } else {
            $scope.task = new Task();
        }

        $scope.save = function ($event, isValid) {
            if (($event.ctrlKey && $event.keyCode == 10) || ($event.type === 'submit')) {
                if (isValid) {
                    if ($stateParams.taskId) {
                        $scope.task.$update().then(
                            function (task) {
                                $state.go('app.task', {taskId: task._id});
                            },
                            function (err) {
                                $scope.formErrors = err.data;
                            })
                    } else {
                        $scope.task.$save().then(
                            function (task) {
                                $state.go('app.task', {taskId: task._id});
                                //$state.go('^');
                            },
                            function (err) {
                                $scope.formErrors = err.data;
                            })
                    }
                }

            }
        }
    });