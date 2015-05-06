/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.controller')
    .controller('adminMenuController', ['$rootScope', '$scope', 'menuService', 'menuList',
        function($rootScope, $scope, menuService, menuList){
            /* 현재 메뉴 리스트 */
            $scope.menuList = menuList;
            /* 메뉴 등록 */
            $scope.menu = {
                url : '/#/'
            };

            /* 메뉴 추가 */
            $scope.addMenu = function(){
                $scope.menu.url = '/#/';
                if(!!$scope.menu.isBoard){
                    $scope.menu.url = $scope.menu.url + 'board/';
                }

                /* 새로운 1step 메뉴 추가 */
                if(!$scope.menu.select){
                    $scope.menu.url = $scope.menu.url + $scope.menu.name;
                    menuService.addOneStepMenu($scope.menu).then(function(){
                        $scope.getMenuList();
                    });
                }
                /* 2step 메뉴 추가 */
                else{
                    $scope.menu.url = $scope.menu.url + $scope.menu.name;
                    $scope.menu.oneStep_id = $scope.menu.select._id;
                    menuService.addTwoStepMenu($scope.menu).then(function(){
                        $scope.getMenuList();
                    });
                }
            };

            $scope.getMenuList = function(){
                menuService.menuList = null;
                menuService.getMenuList().then(function(data){
                    $scope.menuList = data;
                });
                $rootScope.$broadcast('getMenuList');
            };
        }])

    .controller('sideMenuController', ['$rootScope', '$scope', 'menuService', '$location',
        function($rootScope, $scope, menuService, $location){
            /* 라우터가 바뀔때마다 체크 */
            $rootScope.$on("$routeChangeSuccess", function(){
                if(!!$scope.menuList){
                    $scope.getActiveMenu();
                }else{
                    $scope.getMenuList();
                }
            });

            $scope.getActiveMenu = function(){
                $scope.activeMenu = '';
                $scope.activeSubMenu = '';
                for(var i=0;i<$scope.menuList.length;i++){
                    if($location.path().indexOf($scope.menuList[i].url.replace('/#/', '')) > -1){
                        $scope.activeMenu = $scope.menuList[i].name;
                    }
                    if($scope.menuList[i].subMenuList.length > 0){
                        for(var j=0;j<$scope.menuList[i].subMenuList.length;j++){
                            if($location.path().indexOf($scope.menuList[i].subMenuList[j].url.replace('/#/', '')) > -1){
                                $scope.activeSubMenu = $scope.menuList[i].subMenuList[j].name;
                            }
                        }
                    }
                }
            };

            /* 메뉴를 클릭스 active를 옮겨준다. */
            $scope.moveActive = function(name) {
                $scope.activeMenu = name;
            };

            /* active 해야되는 메뉴를 바꺼준다.. */
            $scope.isActive = function(name){
                return {
                    'active': $scope.checkActive(name)
                }
            };

            /* 선택된 메뉴와 현재 메뉴를 비교해서 알려준다. */
            $scope.checkActive = function(name){
                return $scope.activeMenu == name;
            };

            /* step2의 메뉴를 체크하여 보여준다. */
            $scope.isSubActive = function(name){
                return {
                    'active' : $scope.activeSubMenu == name
                }
            };

            /* class를 가지고 온다. */
            $scope.getClass = function(length){
                return { 'sub-menu' : length > 0};
            };

            $scope.getMenuList = function(){
                menuService.getMenuList().then(function(data){
                    $scope.menuList = data;
                    $scope.getActiveMenu();
                });
            };

            /* 메뉴를 다시 가지고 온다.*/
            $rootScope.$on('getMenuList', function(){
                $scope.getMenuList();
            });
        }]);