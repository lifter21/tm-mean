angular.module('TaskManager', ['ui.router', 'ngResource'])
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:taskId', { taskId: '@_id' },
            { 'update': { method:'PUT' } });
    })
    .factory('Comment', function ($resource) {
        return $resource('/api/tasks/:taskId/comments/:commentId', { commentId: '@_id', taskId: '@taskId' },
            { 'update': { method:'PUT' } });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/tasks");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "partials/home.html"
            })
            .state('tasks', {
                url: "/tasks",
                controller: 'TaskListController',
                templateUrl: "partials/tasks/list.html"
            })
            .state('task-new', {
                url: "/tasks/new",
                controller: 'TaskFormController',
                templateUrl: "partials/tasks/form.html"
            })
            .state('task-edit', {
                url: "/tasks/:taskId/edit",
                controller: 'TaskFormController',
                templateUrl: "partials/tasks/form.html"
            })
            .state('task-comments', {
                url: "/tasks/:taskId/comments",
                controller: 'CommentListController',
                templateUrl: "partials/comments/list.html"
            })
            .state('task-comments-new', {
                url: "/tasks/:taskId/comments/new",
                controller: 'CommentFormController',
                templateUrl: "partials/comments/form.html"
            })
            .state('task-comments-edit', {
                url: "/tasks/:taskId/comments/:commentId/edit",
                controller: 'CommentFormController',
                templateUrl: "partials/comments/form.html"
            });
            
    })
    .controller('TaskListController', function ($scope, $state, Task) {
        $scope.tasks = Task.query();
        
        $scope.remove = function (task) {
            task.$delete().then(function () {
                $scope.tasks = Task.query();
            })
        }
    })
    .controller('TaskFormController', function ($scope, $state, Task) {
        $scope.id = $state.params.taskId;

        if ($scope.id)  {
            $scope.task = Task.get({taskId:  $scope.id})
        } else {
            $scope.task = new Task()

        }

        $scope.save = function () {
            if (!$scope.task._id) {
                if($scope.task.text !== '') {
                    $scope.task.$save().then(function () {
                        $state.go('tasks');
                    })
                }
            } else {
                $scope.task.$update().then(function () {
                    $state.go('tasks');
                })
            }
        }
    })
    .controller('CommentListController', function ($scope, $state, Comment) {
        $scope.taskId = $state.params.taskId;
        $scope.id = $state.params.commentId;
        $scope.comments = Comment.query({taskId: $scope.taskId});

        $scope.remove = function (comment) {
            comment.$delete().then(function () {
                $scope.comments = Comment.query({taskId: $scope.taskId});
            })
        }
    })
    .controller('CommentFormController', function ($scope, $state, Comment) {
        $scope.taskId = $state.params.taskId;
        $scope.id = $state.params.commentId;

        if ($scope.taskId && $scope.id) {
            $scope.comment = Comment.get({commentId: $scope.id, taskId:  $scope.taskId});
        } else {
            $scope.comment = new Comment();
        }
        $scope.save = function () {
            if(!$scope.comment._id) {
                if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                    $scope.comment.$save({taskId: $scope.taskId}).then(function () {
                        $state.go('task-comments', {taskId: $scope.taskId});
                    })
                }
            } else {
                if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                    $scope.comment.$update().then(function () {
                        $state.go('task-comments', {taskId: $scope.taskId})
                    })
                }
            }
        }

    });