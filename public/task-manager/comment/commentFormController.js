app
    .controller('CommentFormController', function ($scope, $state, $stateParams, Comment) {

        if ($stateParams.commentId) {
            Comment.get({taskId: $stateParams.taskId, commentId: $stateParams.commentId}).$promise
                .then(
                function (comment) {
                    $scope.comment = comment;
                })
        } else {
            $scope.comment = new Comment ({
                task: $stateParams.taskId
            });
        }

        $scope.save = function ($event, isValid) {
            if (($event.ctrlKey && $event.keyCode == 10) || ($event.type === 'submit')) {
                if (isValid) {
                    if ($stateParams.commentId) {
                        $scope.comment.$update({taskId: $scope.comment.task._id}).then(function (comment) {
                            $state.go('app.task', {taskId: comment.task._id});
                        }, function (err) {
                            $scope.formErrors = err.data;
                        })
                    } else {
                        $scope.comment.$save().then(function (comment) {
                            $state.go('app.task', {taskId: comment.task._id});
                        }, function (err) {
                            $scope.formErrors = err.data;
                        });
                    }
                }
            }
        }
    })
;