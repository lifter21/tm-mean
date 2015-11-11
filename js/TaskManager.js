angular.module('TaskManager', ['ui.router, ngResource'])
    .factory('CommentsService', function () {
        //var CommentsService = {
            //comments: [
            //    { id: randId(), task_id: 1, text: 'task 1 comment 1', user: 'user 1' },
            //    { id: randId(), task_id: 1, text: 'task 1 comment 2', user: 'user 2' },
            //    { id: randId(), task_id: 2, text: 'task 2 comment 1', user: 'user 11' },
            //    { id: randId(), task_id: 2, text: 'task 2 comment 2', user: 'user 4' },
            //    { id: randId(), task_id: 3, text: 'task 3 comment 1', user: 'user 5' },
            //    { id: randId(), task_id: 3, text: 'task 3 comment 2', user: 'user 6' },
            //    { id: randId(), task_id: 3, text: 'task 3 comment 3', user: 'user 3' },
            //    { id: randId(), task_id: 1, text: 'task 1 comment 3', user: 'user 2' },
            //    { id: randId(), task_id: 1, text: 'task 1 comment 4', user: 'user 1' }
            //],
            //getCommentsByTaskId: function (taskId) {
            //    var comments = _.filter(this.comments, {'task_id': taskId});
            //    return comments
            //},
            //getCommentById: function (commentId) {
            //    var comment = _.find(this.comments, {'id': commentId});
            //    return comment
            //},
            //remove: function (comment) {
            //    _.remove(this.comments, comment)
            //},
            //save: function (comment) {
            //    if (comment.id === '') {
            //        if (comment.text !== '' && comment.user !== '') {
            //            //console.log(task, this.randId());
            //            comment.id = randId();
            //            this.comments.push(comment)
            //        }
            //    }
            //}

        //};
        //return CommentsService
    })
    .factory('TaskService', function () {
        //var TaskService = {
            //tasks: [
            //    {
            //        id: 1,
            //        text: 'task 3 text'
            //    },
            //    {
            //        id: 2,
            //        text: 'task 4 text'
            //    }
            //],
            //getTasks: function () {
            //    return this.tasks
            //},
            //getTaskById: function (taskId) {
            //    var task = _.find(this.tasks, function (taskObj) {
            //        return taskObj.id === taskId
            //    });
            //    return task
            //},
            //remove: function (task) {
            //    _.remove(this.tasks, task)
            //},
            //save: function (task) {
            //    //console.log(randId());
            //    if (task.id === '') {
            //        if (task.text !== '') {
            //            //console.log(task, this.randId());
            //            task.id = randId();
            //            this.tasks.push(task)
            //        }
            //    }
            //}
        //};
        //return TaskService
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
                url: "/task/:taskId/comments/:commentId/edit",
                controller: "CommentFormController",
                templateUrl: "partials/comments/form.html"
            })

    })
    .controller('TaskListController', function ($scope, TaskService, CommentsService) {
        $scope.tasks = TaskService.getTasks();

        $scope.getCommentsCount = function (taskId) {
            return CommentsService.getCommentsByTaskId(taskId).length
        };

        $scope.remove = function (task) {
            TaskService.remove(task)
        }
    })
    .controller('TaskFormController', function ($scope, $state, TaskService) {
        if ($state.params.taskId) {
            $scope.task = TaskService.getTaskById(Number($state.params.taskId))
        } else {
            $scope.task = {id: '', text: ''}
        }

        $scope.save = function () {
            if ($scope.task.text !== '') {
                TaskService.save($scope.task);
                $state.go('tasks')
            }
        }
    })
    .controller('CommentListController', function ($scope, $state, CommentsService) {
        $scope.taskID = Number($state.params.taskId);
        $scope.comments = loadComments();

        $scope.remove = function (comment) {
            CommentsService.remove(comment);
            $scope.comments = loadComments();
            //$state.go('tasks')
        };

        function loadComments() {
            return CommentsService.getCommentsByTaskId($scope.taskID);
        }
    })
    .controller('CommentFormController', function ($scope, $state, CommentsService) {
        $scope.taskID = $state.params.taskId;
        $scope.commentID = $state.params.commentId;
        if ($scope.taskID && $scope.commentID) {
            $scope.comment = CommentsService.getCommentById(Number($scope.commentID))
        } else {
            $scope.comment = {id: '', task_id: Number($scope.taskID), text: '', user: ''}
        }

        //console.log($scope.comment);
        $scope.save = function () {
            if ($scope.comment.text !== '' && $scope.comment.user !== '') {
                //console.log();
                CommentsService.save($scope.comment);
                $state.go('task-comments', {taskId: $scope.taskID})
            }
        }
    });

//function randId() {
//    return Math.floor(Math.random() * Math.pow(10, 6));
//}
