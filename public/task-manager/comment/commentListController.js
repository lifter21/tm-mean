app
    .controller('CommentListController', function ($scope, $state, $stateParams, Comment, CommentService) {
        $scope.CommentService = CommentService;

        $scope.taskId = $stateParams.taskId;
        
        $scope.init = function () {
            Comment.query({taskId: $stateParams.taskId}).$promise
                .then(function (comments) {
                    $scope.taskComments = comments;
                });
        };

        $scope.init();

        $scope.remove = function (comment) {
           var confirmDeletion = confirm("Now you're going to remove comment " + comment._id + "\n Are you sure? ");
            if (confirmDeletion) {
                Comment.remove({taskId: comment.task._id, commentId: comment._id}).$promise.then(function (status) {
                    $scope.init();
                });
            }
        };

        $scope.commentListState  = function () {
            return $state.current.name === 'app.task.comments'
        };

    })
;

