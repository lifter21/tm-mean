angular.module('TaskManager', ['ui.router', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                //controller: 'TasksController',
                templateUrl: '../templates/home.html'
            })
            .state('tasks', {
                url: '/tasks',
                controller: 'TasksController',
                templateUrl: '../templates/tasks/list.html'
            })
            .state('task-new', {
                url: '/tasks/new',
                controller: 'TasksController',
                templateUrl: '../templates/tasks/form.html'
            })
            .state('task-edit', {
                url: '/tasks/:taskId/edit',
                controller: 'TasksController',
                templateUrl: '../templates/tasks/form.html'
            })
            .state('task-comments', {
                url: '/tasks/:taskId/comments',
                controller: 'CommentsController',
                templateUrl: '../templates/comments/list.html'
            })
            .state('task-comment-new', {
                url: '/tasks/:taskId/comments/new',
                controller: 'CommentsController',
                templateUrl: '../templates/comments/form.html'
            })
            .state('task-comment-edit', {
                url: '/tasks/:taskId/comments/:commentId/edit',
                controller: 'CommentsController',
                templateUrl: '../templates/comments/form.html'
            })
            .state('user-registration', {
                url: '/sign-up',
                controller: 'UsersController',
                templateUrl: '../templates/users/form.html'
            })
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: '../templates/auth/loginForm.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            });

    })
    .run(function ($rootScope, AuthService) {
        $rootScope.AuthService = AuthService;
        $rootScope.AuthService.load();
    })
;
