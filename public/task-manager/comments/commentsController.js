angular.module("TaskManager")
    .factory("Comment", function ($resource) {
        return $resource('/api/tasks/:taskId/comments/:commentId',
            {"taskId": "@task", 'commentId': "@_id"},
            {update: {method: 'PUT'}}
        )
    })
    .controller("CommentsController", function ($scope, $state, Comment) {

        if ($state.current.name === "comments" || $state.current.name === "task.comments" || $state.current.name === "task") {
            getComments();
        }

        if ($state.params.commentId && $state.params.taskId) {
            Comment.get({commentId: $state.params.commentId, taskId: $state.params.taskId}).$promise
                .then(function (comment) {
                    //console.log(comment);
                    $scope.comment = comment;

                }, function (err) {
                    console.log(err);
                    $scope.commentErrors = ["err"]
                });
        } else {
            $scope.comment = new Comment({
                task: $state.params.taskId
            });
        }

        $scope.save = function () {

            validateComment();

            if ($scope.comment.text) {
                if ($scope.comment._id) {
                    $scope.comment.$update().then(function (comment) {
                        //$state.go('task', {taskId: $scope.task._id});
                        $state.go('^');
                    }, function (err) {
                        console.log("Comment update error", err);
                        $scope.commentErrors = err.data.text;
                    })
                } else {
                    $scope.comment.$save().then(function (task) {
                        //$state.go('task', {taskId: $scope.task._id});
                        $state.go('^');
                    }, function (err) {
                        console.log("New comment save error",err);
                        $scope.commentErrors = err.data.text;
                    })
                }
            }
        };

        $scope.remove = function (comment) {
            comment.$remove().then(function (comment) {
                getComments();
            })
        };

        function getComments() {
            Comment.query({taskId: $state.params.taskId}).$promise
                .then(function (comments) {
                    $scope.comments = comments;
                    if ($scope.comments.length < 1) {
                        $scope.noCommentsMessage = "There are no comments yet..."
                    } else {
                        $scope.noCommentsMessage = null
                    }
                }, function (err) {
                    console.log('comments err', err);
                });

        }

        function validateComment() {
            if ($scope.comment.text) {
                $scope.commentErrors = []
            } else {
                $scope.commentErrors = ['Comment text is required!..']
            }
        }

        //$scope.showForm = false;
        //
        //$scope.toggleForm = function () {
        //    $scope.showForm = !$scope.showForm;
        //    $scope.commentErrors = null;
        //};

        //$scope.update = function (comment) {
        //    //$scope.toggleForm();
        //    if ($scope.showForm === false) {
        //        $scope.toggleForm()
        //    }
        //    $scope.comment = comment;
        //};


        //$scope.newCommentForm = function () {
        //    if (($scope.showForm === true && $scope.comment.text) || ($scope.showForm === true && !$scope.comment.text)) {
        //        $scope.comment = undefined
        //    } else {
        //        $scope.toggleForm();
        //    }
        //
        //    $scope.comment = new Comment({
        //        task: $stateParams.taskId
        //    });
        //};

    })
;