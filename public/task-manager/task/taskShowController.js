app
    .controller('TaskShowController', function ($scope, $state, $stateParams, Task, AuthService) {

        $scope.init = function () {
            Task.get({taskId: $stateParams.taskId}).$promise
                .then(function (task) {
                $scope.task = task;
                $scope.AuthService = AuthService;
            }, function (err) {
                    console.log(err.data);
                })
        };

        $scope.init();

        $scope.remove = function (task) {
            var confirmedDeletion = confirm("Now you're going to remove task " + task._id + "\n Are you sure? ");
            if (confirmedDeletion) {
                task.$remove().then(function (task) {
                    $state.go('app.tasks')
                }, function (err) {
                    console.log(err.data);
                })
            }
        };

        $scope.finish = function (task) {
            task.$update({finished: true}).then(function (task) {
                console.log('Task finished: ', task);
                $state.go('app.task',({taskId: task._id}));
            }, function (err) {
                console.log(err.data);
            });
        };

        $scope.restore = function (task) {
            task.$update({finished: false}).then(function (task) {
                console.log('Task restored: ', task);
                $state.go('app.task',({taskId: task._id}));
            }, function (err) {
                console.log(err.data);
            });
        }
    });