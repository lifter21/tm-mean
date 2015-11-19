/**
 * Created by alex on 17.11.15.
 */
angular.module('TaskManager')
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:taskId', {taskId: '@_id'},
            {update: {method: 'PUT'}})
    })
    .controller('TasksController', function ($scope, $state, Task) {
        $scope.tasks = Task.query();

        $scope.remove = function (task) {
            task.$delete().then(function () {
                $scope.tasks = Task.query()
            })
        };

        if (!$state.params.taskId) {
            $scope.task = new Task()
        } else {
            $scope.task = Task.get({taskId: $state.params.taskId})
        }
        $scope.save = function () {
            if (!$scope.task._id) {
                if ($scope.task.text !== '') {
                    $scope.task.$save().then(function () {
                        $state.go('tasks')
                    })
                }
            } else {
                if ($scope.task.text !== '') {
                    $scope.task.$update({taskId: $scope.task._id}).then(function () {
                        $state.go('tasks')
                    })
                }
            }
        }
    });