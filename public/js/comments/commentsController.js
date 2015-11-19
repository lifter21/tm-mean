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
            comment.$delete({taskId: comment.taskId, commentId: comment._id}).then(function () {
                $scope.comments = Comment.query({taskId: $state.params.taskId})
            })
        }

        if ($scope.taskId && $state.params.commentId) {
            $scope.comment = Comment.get({taskId: $scope.taskId, commentId: $state.params.commentId})
        } else {
            $scope.comment = new Comment()
        }

        $scope.save = function () {
            if ($scope.comment._id) {
                if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                    $scope.comment.$update({taskId: $scope.taskId, commentId: $scope.comment._id}).then(function () {
                        $state.go('task-comments', {taskId: $scope.taskId})
                    })
                }
            } else {
                if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                    $scope.comment.$save({taskId: $scope.taskId}).then(function () {
                        $state.go('task-comments', {taskId: $scope.taskId})
                    })
                }
            }
        }
    });
