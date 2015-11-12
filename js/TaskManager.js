angular.module('TaskManager', ['ui.router', 'ngResource'])
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:taskId', {taskId: '@id'}, {
            'update': {method: 'PUT'}
        })
    })
    .factory('Comment', function ($resource) {
        return $resource('/api/tasks/:taskId/comments/:commentId', {taskId: '@task_id', commentId: '@id'},
            {'update': {method: 'PUT'}})
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "partials/home.html"
            })
            .state('tasks', {
                url: "/tasks",
                controller: "TaskListController",
                templateUrl: "partials/tasks/tasks.html"
            })
            .state('task-new', {
                url: "/tasks/new",
                controller: "TaskFormController",
                templateUrl: "partials/tasks/form.html"
            })
            .state('task-edit', {
                url: "/task/:taskId/edit",
                controller: "TaskFormController",
                templateUrl: "partials/tasks/form.html"
            })
            .state('task-comments', {
                url: "/tasks/:taskId/comments",
                controller: "CommentListController",
                templateUrl: "partials/comments/comments.html"
            })
            .state('task-comments-new', {
                url: "/tasks/:taskId/comments/new",
                controller: "CommentFormController",
                templateUrl: "partials/comments/form.html"
            })
            .state('task-comments-edit', {
                url: "/tasks/:taskId/comments/:commentId/edit",
                controller: "CommentFormController",
                templateUrl: "partials/comments/form.html"
            })

    })
    .controller('TaskListController', function ($scope, Task, Comment) {
        $scope.tasks = Task.query()

        $scope.remove = function (task) {
            task.$remove().then(function () {
                $scope.tasks = Task.query();
            });
        }
    })
    .controller('TaskFormController', function ($scope, $state, Task) {
        if ($state.params.taskId) {
            $scope.task = Task.get({taskId: $state.params.taskId})
        } else {
            $scope.task = new Task();
        }

        $scope.save = function () {
            if ($scope.task.text !== '') {
                if ($scope.task.id) {
                    $scope.task.$update().then(function () {
                        $state.go('tasks')
                    })
                } else {
                    $scope.task.$save().then(function () {
                        $state.go('tasks')
                    })
                }
            }
        }
    })
    .controller('CommentListController', function ($scope, $state, Comment) {
        $scope.taskID = $state.params.taskId;
        $scope.comments = Comment.query({taskId: $state.params.taskId});

        $scope.remove = function (comment) {
            comment.$remove().then(function () {
                $scope.comments = Comment.query({taskId: $state.params.taskId});
            })
        };

    })
    .controller('CommentFormController', function ($scope, $state, Comment) {
        $scope.taskID = $state.params.taskId;
        $scope.commentID = $state.params.commentId;

        if ($scope.taskID && $scope.commentID) {
            $scope.comment = Comment.get({taskId: $scope.taskID, commentId: $scope.commentID})
        } else {
            $scope.comment = new Comment();
        }

        //console.log($scope.comment);
        $scope.save = function () {
            if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                if ($scope.comment.id) {
                    $scope.comment.$update({taskId: $scope.taskID, commentId: $scope.commentID}).then(function () {
                        $state.go('task-comments', {taskId: $scope.taskID})
                    })
                } else {
                    $scope.comment.$save({taskId: $scope.taskID}).then(function () {
                        $state.go('task-comments', {taskId: $scope.taskID})
                    })
                }
            }
        }
    });
