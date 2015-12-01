angular.module('TaskManager', ['ui.router', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'task-manager/static-pages/home.html'
            })
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'task-manager/auth/loginForm.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
        //.state('registration', {
        //    url: '/sign-up',
        //    controller: 'UserRegistrationController',
        //    templateUrl: 'task-manager/users/registrationForm.html'
        //})
        //.state('user', {
        //    url: '/users/:userId',
        //    controller: 'UsersController'
        //})
        //.state('tasks', {
        //    url: '/tasks',
        //    controller: 'TasksController',
        //    templateUrl: 'task-manager/tasks/list.html'
        //})
        //.state('tasks.new', {
        //    url: '/new',
        //    controller: 'TasksController',
        //    templateUrl: 'task-manager/tasks/form.html'
        //})
        //.state('tasks.task', {
        //    url: '/:taskId',
        //    controller: 'TasksController',
        //    templateUrl: 'task-manager/tasks/list.html'
        //})
        //.state('tasks.task.edit', {
        //    url: '/edit',
        //    controller: 'TasksController',
        //    templateUrl: 'task-manager/tasks/form.html'
        //})
        //.state('tasks.task.comments', {
        //    url: '/comments',
        //    controller: 'CommentsController',
        //    templateUrl: 'task-manager/comments/list.html'
        //})
        //.state('tasks.task.comments.new', {
        //    url: '/new',
        //    controller: 'CommentsController',
        //    templateUrl: 'task-manager/comments/form.html'
        //})
        //.state('tasks.task.comments.comment.edit', {
        //    url: '/:commentId/edit',
        //    controller: 'CommentsController',
        //    templateUrl: 'task-manager/comments/form.html'
        //});
    })
    .run(function ($rootScope, $state, AuthService) {
        $rootScope.AuthService = AuthService;
        $rootScope.AuthService.me();
    });