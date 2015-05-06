/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo', [
    "ngRoute",
    'ngResource',
    'ngAnimate',
    "errorHandler",
    "interceptor",
    "johayo.controller",
    "johayo.service",
    "johayo.directive",
    "johayo.filter",
    "johayo.clock",
    "ngDialog",
    'textAngular',
    "mgcrea.ngStrap",
    'angularFileUpload',
    "templates"
])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.responseInterceptors.push('securityInterceptor');
    }]).config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main/main.html',
                controller: 'mainController',
                resolve: {
                    boardList : function(boardService){
                        return boardService.list('').then(function(data){
                            return data;
                        });
                    }
                }
            })
            .when('/bookmark', {
                templateUrl: 'bookmark/bookmark.html',
                controller : 'bookmarkController'
            })
            .when('/admin/menu', {
                templateUrl: 'menu/adminMenu.html',
                controller: 'adminMenuController',
                resolve : {
                    menuList : function(menuService, loginService){
                        return  loginService.getCheckLogin().then(function(){
                            return menuService.getMenuList()
                                .then(function(menu){
                                    return menu;
                                });
                        });
                    }
                }
            })
            .when('/admin/board', {
                templateUrl: 'board/boardAdd.html',
                controller: 'boardAddController',
                resolve : {
                    menuList : function(menuService, loginService){
                        return  loginService.getCheckLogin().then(function(){
                            return menuService.getMenuList()
                                .then(function(menu){
                                    return menu;
                                });
                        });
                    }
                }
            })
            .when('/board/:division', {
                templateUrl: 'board/board.html',
                controller: 'boardController',
                resolve : {
                    boardList : function(boardService, $route){
                        return boardService.list($route.current.params.division).then(function(data){
                            return data;
                        });
                    }
                }
            })
            .when('/board/:division/:seq', {
                templateUrl: 'board/boardDetail.html',
                controller: 'boardDetailController',
                resolve : {
                    boardDetail : function(boardService, $route){
                        return boardService.detail($route.current.params.seq).then(function(data){
                            return data;
                        });
                    }
                }
            })
        ;
    }]);

angular.module('johayo.controller', []);

angular.module('johayo.service', []);

angular.module('johayo.directive', []);

angular.module("templates", []);