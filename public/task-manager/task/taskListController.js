app
    .controller("TaskListController", function ($scope, AuthService, $state, Task) {

        $scope.init = function () {
            Task.query().$promise
                .then(function (tasks) {
                    $scope.userTasks = tasks.filter(function (task) {
                        return task.creator._id === AuthService.user._id;
                    });
                    $scope.otherTasks = tasks.filter(function (task) {
                        return task.creator._id !== AuthService.user._id;
                    });
                }, function (err) {
                    console.log(err.data);
                });
        };

        $scope.init();

        $scope.remove = function (task) {
            var confirmedDeletion = confirm("Now you're going to remove task " + task._id + "\n Are you sure? ");

            if (confirmedDeletion) {
                task.$remove().then(function (task) {
                    $scope.init();
                }, function (err) {
                    console.log(err.data);
                })
            }
        };

    });