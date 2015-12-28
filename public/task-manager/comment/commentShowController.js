app
    .controller('CommentShowController', function ($scope, $state, $stateParams, Comment, CommentService) {


        $scope.init = function () {
            Comment.get({taskId: $stateParams.taskId, commentId: $stateParams.commentId}).$promise
                .then(function (comment) {
                    $scope.comment = comment;
                    $scope.CommentService = CommentService;
                    //$scope.isEditable = function () {
                    //    return $scope.CommentService.isCreatorOf($scope.comment);
                    //};
                })
        };


        $scope.init();

        $scope.remove = function (comment) {
            var confirmDeletion = confirm("Now you're going to remove comment " + comment._id + "\n Are you sure? ");
            if (confirmDeletion) {
                Comment.remove({taskId: comment.task._id, commentId: comment._id}).$promise.then(function (status) {
                    $state.go('app.task', {taskId: comment.task._id})
                });
            }
        };

    })
;