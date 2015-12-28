var app = angular.module('TaskManager', ['ui.router', 'ngResource', 'ngSanitize', 'ui.select'])
        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('app', {
                    url: '',
                    abstract: true,
                    views: {
                        'authPanel': {
                            controller: function ($scope, AuthService) {
                                $scope.AuthService = AuthService;
                                $scope.AuthService.Me();
                            },
                            templateUrl: '../task-manager/auth/authPanel.html'
                        }
                    }
                })
                .state('app.home', {
                    url: '/',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/home/home.html'
                        }
                    }
                })
                .state('app.login', {
                    url: '/login',
                    views: {
                        '@': {
                    controller: 'LoginController',
                    templateUrl: '../task-manager/auth/loginForm.html'
                        }
                    }
                })
                .state('app.logout', {
                    url: '/logout',
                    views: {
                        '@': {
                            controller: 'LogoutController'
                        }
                    }
                })
                .state('app.registration', {
                    url: '/registration',
                    views: {
                        '@': {
                            controller: 'UserRegistrationController',
                            templateUrl: '../task-manager/user/registrationForm.html'
                        }
                    }
                })
                .state('app.tasks', {
                    url: '/tasks',
                    views: {
                        '@': {
                            controller: 'TaskListController',
                            templateUrl: '../task-manager/task/task.list.html'
                        }
                    }
                })
                .state('app.tasks.new', {
                    url: '/new',
                    views: {
                        '@': {
                            controller: 'TaskFormController',
                            templateUrl: '../task-manager/task/task.form.html'
                        }
                    }

                })
                .state('app.task', {
                    url: '/tasks/:taskId',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/task/task.html'
                        },
                        'task@app.task': {
                            controller: 'TaskShowController',
                            templateUrl: '../task-manager/task/task.show.html'
                        },
                        'comments@app.task': {
                            controller: 'CommentListController',
                            templateUrl: '../task-manager/comment/comment.list.html'
                        }
                    }
                })
                .state('app.task.edit', {
                    url: '/edit',
                    views: {
                        '@': {
                            controller: 'TaskFormController',
                            templateUrl: '../task-manager/task/task.form.html'
                        }
                    }
                })
                .state('app.task.comments', {
                    url: '/comments',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/task/task.html'
                        },
                        'comments@app.task.comments': {
                            controller: 'CommentListController',
                            templateUrl: '../task-manager/comment/comment.list.html'
                        }
                    }
                })
                .state('app.task.comments.new', {
                    url: '/new',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/task/task.html'
                        },
                        'comments@app.task.comments.new': {
                            controller: 'CommentFormController',
                            templateUrl: '../task-manager/comment/comment.form.html'
                        }
                    }
                })
                .state('app.comment', {
                    url: '/tasks/:taskId/comments/:commentId',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/comment/comment.html'
                        },
                        '@app.comment': {
                            controller: 'CommentShowController',
                            templateUrl: '../task-manager/comment/comment.show.html'
                        }
                    }
                })
                .state('app.comment.edit', {
                    url: '/edit',
                    views: {
                        '@': {
                            templateUrl: '../task-manager/comment/comment.html'
                        },
                        '@app.comment.edit': {
                            controller: 'CommentFormController',
                            templateUrl: '../task-manager/comment/comment.form.html'
                        }
                    }
                });

        })
        .factory('HttpInterceptor', function ($q, $injector) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status == 401) {
                        $injector.get('$state').go('app.login')
                    }
                    return $q.reject(rejection);
                }
            }
        })
        //.run(function ($rootScope, AuthService) {
        //    $rootScope.AuthService = AuthService;
        //    $rootScope.AuthService.Me()
        //})
    ;