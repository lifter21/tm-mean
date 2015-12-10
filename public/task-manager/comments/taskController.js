angular.module("TaskManager")
    .controller("TaskController", function ($scope, $state, Task) {
        Task.get({taskId: $state.params.taskId}).$promise
            .then(function (task) {
                $scope.task = task;

            }, function (err) {
                $scope.taskError = err;
                console.log("Tasks error");
            });
    });