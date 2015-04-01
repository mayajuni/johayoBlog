/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.directive')
    .directive('johayoMenu', function($window){
        return {
            restrict: 'A',
            templateUrl : '/html/menu/sideMenu.html',
            scope : {
                hideMenu : '@'
            },
            controller : 'sideMenuController'
        }
    });