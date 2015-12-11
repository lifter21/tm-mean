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
            .state('sign-in', {
                url: '/registration',
                controller: 'UsersController',
                templateUrl: 'task-manager/users/registrationForm.html'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
            .state('tasks', {
                url: '/tasks',
                controller: 'TasksController',
                templateUrl: 'task-manager/tasks/list.html'
            })
            .state('tasks.new', {
                url: '/new',
                views: {
                    '@': {
                        controller: 'TasksController',
                        templateUrl: 'task-manager/tasks/form.html'
                    }
                }
            })
            .state('task', {

                url: '/tasks/:taskId',
                views: {
                    '@': {
                        //controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.html'
                    },
                    "comments@task" : {
                        controller: 'CommentsController',
                        templateUrl: 'task-manager/comments/list.html'
                    },
                    "details@task" : {
                        controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.details.html'
                    }
                }
            })
            .state('task.edit', {
                url: '/edit',
                views: {
                    '@': {
                        controller: 'TasksController',
                        templateUrl: 'task-manager/tasks/form.html'
                    }
                }
            })
            .state('comments', {
                url: '/tasks/:taskId/comments',
                views: {
                    '@': {
                        controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.html'
                    },
                    'comments@comments': {
                        controller: 'CommentsController',
                        templateUrl: 'task-manager/comments/list.html'
                    },
                    "details@comments" : {
                        controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.text.html'
                    }
                }
            })
            .state('comments.new', {
                url: '/new',
                views: {
                    '@': {
                        controller: 'CommentsController',
                        templateUrl: 'task-manager/comments/form.html'
                    },
                    "@comments.new" : {
                        controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.text.html'
                    }
                }
            })
            .state('comment', {
                url: '/tasks/:taskId/comments/:commentId',
                views: {
                    '@': {
                        controller: 'CommentsController',
                        templateUrl: 'task-manager/comments/comment.html'
                    }
                }
            })
            .state('comment.edit', {
                url: '/edit',
                views: {
                    '@': {
                        controller: 'CommentsController',
                        templateUrl: 'task-manager/comments/form.html'
                    },
                    "@comment.edit" : {
                        controller: 'TaskController',
                        templateUrl: 'task-manager/tasks/task.text.html'
                    }
                }
            });
    })
    .run(function ($rootScope, AuthService) {
        $rootScope.AuthService = AuthService;
        $rootScope.AuthService.me();
    });