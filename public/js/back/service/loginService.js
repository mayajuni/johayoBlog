/**
 * Created by 동준 on 2014-10-23.
 */
angular.module("johayo.service")
    .factory("loginService", ['$http', '$q', '$rootScope', 'loginRetryQueue', 'ngDialog', function($http, $q, $rootScope, queue, ngDialog){
        // Login form dialog stuff
        var loginDialog = null;
        function openLoginDialog() {
            if ( loginDialog ) {
                throw new Error('Trying to open a dialog that is already open!');
            }

            loginDialog = ngDialog.open({
                template: '/html/login/login.html',
                controller: 'loginController',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            });

            return loginDialog;
        }

        function onLoginDialogClose(success) {
            loginDialog = null;
            if ( success() ) {
                queue.retryAll();
            } else {
                queue.cancelAll();
            }
        }

        // Register a handler for when an item is added to the retry queue
        queue.onItemAddedCallbacks.push(function() {
            if ( queue.hasMore() ) {
                service.openLogin();
            }
        });

        var service = {
            // Get the first reason for needing a login
            getLoginReason: function() {
                return queue.retryReason();
            },
            // Show the modal login dialog
            openLogin: function() {
                ngDialog.close();
                var asy = $q.defer();
                openLoginDialog().closePromise.then(function(){
                    onLoginDialogClose(service.isLogin);
                    service.finalLogin();
                    asy.resolve();
                });
                return asy.promise;
            },
            doLogin : function(login){
                var asy = $q.defer();
                $http.post('/api/login', login).success(function (data){
                    service.loginInfo = data;
                    service.finalLogin();
                    asy.resolve(data);
                }).error(function(data, st){asy.reject(data);});
                return asy.promise;
            },
            logout : function(){
                var asy = $q.defer();
                $http.post('/api/login/logout').then(function(){
                    service.loginInfo = null;
                    service.finalLogin();
                    asy.resolve();
                });
                return asy.promise;
            },
            // Ask the backend to see if a user is already authenticated - this may be from a previous session.
            getLoginInfo: function() {
                var asy = $q.defer();
                if ( service.isLogin() ) {
                    asy.resolve(service.loginInfo);
                } else {
                    $http.post('/api/login/getLogin').then(function(response) {
                        service.loginInfo = response.data;
                        asy.resolve(service.loginInfo);
                    });
                }
                return asy.promise;
            },
            isLogin: function(){
                return !!service.loginInfo;
            },
            getCheckLogin : function(){
                var asy = $q.defer();
                $http.post('/api/login/check').then(function(){
                    asy.resolve();
                });
                return asy.promise;
            },
            finalLogin : function(){
                $rootScope.$broadcast('getLoginInfo');
            },
            loginInfo: null
        };

        return service;
    }]);
