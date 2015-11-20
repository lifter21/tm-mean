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
            task.$delete(function () {
                $scope.tasks = Task.query()
            })
        };

        if (!$state.params.taskId) {
            $scope.task = new Task()
        } else {
            $scope.task = Task.get({taskId: $state.params.taskId})
        }
        $scope.save = function () {
            if (!$scope.task.text) {
                return $scope.formErrors = ['text is required']
            }
            if (!$scope.task._id) {
                //console.log(!$scope.task._id);
                $scope.task.$save(function () {
                    $state.go('tasks')
                }, function (err) {
                    $scope.formErrors = err.data;
                })

            } else {

                $scope.task.$update({taskId: $scope.task._id}, function () {
                    $state.go('tasks')
                }, function (err) {
                    $scope.formErrors = err.data;
                })

            }
        }
    });