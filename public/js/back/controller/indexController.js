/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.controller')
    .controller('indexController', ['$rootScope', '$scope', 'loginService', 'errorService', 'msgService',
        function($rootScope, $scope, loginService, errorService, msgService){
            /* 윈도우 창의 크기를 체크 */
            $scope.windowSize = {};

            $scope.openLogin = function(){
                loginService.openLogin();
            };

            $scope.openMsg = function(){
                msgService.openMsg();
            };

            $scope.logout = function(){
                loginService.logout();
            };

            /**
             * 로그인 한후 정보를 다시 가지고 온다.
             */
            $rootScope.$on('getLoginInfo', function(){
                $scope.getLoginInfo();
            });

            $rootScope.$on("$routeChangeStart", function(){
                $scope.loading = true;
                /* 윈도우 창에 따른 메뉴 보이기 안보이기 체크 */
                $scope.windowSizeHideMenu();
            });

            $rootScope.$on("$routeChangeSuccess", function(){
                $scope.loading = false;
                var colorClass = ['primary', 'success', 'info', 'warning', 'danger'];
                $scope.boxClass = 'panel-' + colorClass[Math.floor(Math.random() * 5)];
                $scope.twoBoxClass= 'panel-' + colorClass[Math.floor(Math.random() * 5)];
            });

            $scope.getLoginInfo = function(){
                loginService.getLoginInfo().then(function(loginInfo){
                    $scope.loginInfo = loginInfo;
                    $scope.isLogin = loginService.isLogin();
                });
            };

            $scope.adminMenu = [
                    {text: '<i class="glyphicon glyphicon-ok"></i> Menu', href: '/#/admin/menu'},
                    /*{text: '<i class="glyphicon glyphicon-cog"></i> Setting', click: 'showEditor()'},*/
                    {text: '<i class="glyphicon glyphicon-pencil"></i> Write board', href:'/#/admin/board'},
                    {"divider": true},
                    {text: '<i class="glyphicon glyphicon-log-out"></i> Logout', click: 'logout()'}
                ];

            /**
             * 사이드 메뉴를 보일지 말지 체크한다.
             * 사이즈가 작았을때는 메뉴가 아닌 본문을 클릭스 보이지 않게 한다.
             */
            $scope.windowSizeHideMenu = function(){
                /* 윈도우 창에 따른 메뉴 보이기 안보이기 체크 */
                if($scope.windowSize.w < 1000){
                    $scope.hideMenu = false;
                }
            };

            $scope.getLoginInfo();
        }]);