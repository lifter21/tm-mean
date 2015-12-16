angular.module('TaskManager')
    .factory("Task", function ($resource) {
        return $resource('/api/tasks/:taskId', {"taskId": '@_id'}, {update: {method: 'PUT'}})
    })
    .controller('TasksController', function ($scope, $state, Task, User) {
        getTasks();
        $scope.users = [];

        var getUsers = function () {
            User.query().$promise
                .then(function (users) {
                    $scope.users = users;
                }, function (err) {
                    console.log("Users error", err);
                });
        };

        if ($state.params.taskId) {
            $scope.task = Task.get({taskId: $state.params.taskId});
            getUsers();

        } else {
            $scope.task = new Task();
            getUsers();
        }

        $scope.remove = function (task) {

            task.$remove().then(function () {
                getTasks();
            }, function (err) {
                console.log(err);
            })
        };

        $scope.save = function () {

            //validateTaskForm();

            if ($scope.task.text) {

                if ($scope.task._id) {
                    $scope.task.$update().then(function () {
                        $state.go('^');
                    }, function (err) {
                        $scope.taskTextErrors = err.data.text
                    })
                } else {
                    $scope.task.$save().then(function () {
                        $state.go('^')
                    }, function (err) {
                        $scope.taskTextErrors = err.data.text
                    })
                }
            }
        };

        function getTasks() {
            Task.query().$promise.
                then(function (tasks) {
                    $scope.tasks = tasks;
                    if ($scope.tasks.length === 0) {
                        $scope.noTasksMessage = "There are no tasks added yet..."
                    } else {
                        $scope.noTasksMessage = null
                    }
                }, function (err) {
                    console.log(err);
                });
        }

        function validateTaskForm() {

            if (!$scope.task.text) {
                return $scope.taskTextErrors = ["Text field is required"]
            } else {
                return $scope.taskTextErrors = []
            }
        }
    });