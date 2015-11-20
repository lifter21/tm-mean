/**
 * Created by alex on 17.11.15.
 */
angular.module('TaskManager')
    .factory('Comment', function ($resource) {
        return $resource('/api/tasks/:taskId/comments/:commentId', {taskId: '@taskId', commentId: '@_id'},
            {update: {method: 'PUT'}})
    })
    .controller('CommentsController', function ($scope, $state, Comment) {
        $scope.taskId = $state.params.taskId
        $scope.comments = Comment.query({taskId: $state.params.taskId})

        $scope.remove = function (comment) {
            comment.$delete({taskId: comment.taskId, commentId: comment._id}, function () {
                $scope.comments = Comment.query({taskId: $state.params.taskId})
            })
        }

        if ($scope.taskId && $state.params.commentId) {
            $scope.comment = Comment.get({taskId: $scope.taskId, commentId: $state.params.commentId})
        } else {
            $scope.comment = new Comment()
        }

        $scope.save = function () {
            if (!$scope.comment.text && !$scope.comment.user) {
                return $scope.formErrors = ['text is required', 'user is required']
            }

            if ($scope.comment._id) {

                $scope.comment.$update({taskId: $scope.taskId, commentId: $scope.comment._id}, function () {
                    $state.go('task-comments', {taskId: $scope.taskId})
                }, function (err) {
                    $scope.formErrors = err.data
                })

            } else {

                $scope.comment.$save({taskId: $scope.taskId}, function () {
                    $state.go('task-comments', {taskId: $scope.taskId})
                }, function (err) {
                    $scope.formErrors = err.data;
                })

            }
        }
    });
