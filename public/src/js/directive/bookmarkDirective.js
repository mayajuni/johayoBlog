/**
 * Created by 동준 on 2015-03-24.
 */
angular.module('johayo.directive')
    .directive('bookmark', function(){
        return {
            restrict: 'AE',
            templateUrl: 'bookmark/bookmark.html',
            controller : 'bookmarkController'
        }
    });