/**
 * Created by 동준 on 2014-11-28.
 */
angular.module('johayo.directive')
    .directive('commentBox', function(){
        return {
            restrict: 'AE',
            replace: true,
            templateUrl : '/html/comment/comment.html',
            scope : {
                commentList : "="
            },
            controller: 'commentController'
        }
    });