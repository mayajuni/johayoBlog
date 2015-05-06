/**
 * Created by 동준 on 2014-11-17.
 */
angular.module('johayo.directive')
    .directive('searchBox', function(){
        return {
            restrict: 'AE',
            scope : {
                searchText : "="
            },
            template: '<div class="search-box"><i class="fa fa-search"></i><input type="text" class="search-text" placeholder="Search" ng-style="getSearchTextStyle()" ng-model="searchText"></div>',
            link: function (scope, element, attrs) {
                scope.getSearchTextStyle = function(){
                    var style= '';
                    if(!!scope.searchText){
                        style = {width : '160px'}
                    }

                    return style
                };
            }
        }
    })
    .directive('headerMenuScrolly', function($window){
        return {
            restrict: 'A',
            scope : {
                scrollSize : "="
            },
            link: function (scope, element, attrs) {
                angular.element($window).bind("scroll", function() {
                    scope.scrollSize = this.pageXOffset;
                    scope.$apply();
                });
            }
        }
    })
    .directive('windowWidthCheck', function($window){
        return {
            restrict: 'AE',
            scope : {
                windowSize : "="
            },
            link: function (scope, element, attrs) {
                var w = angular.element($window);
                scope.getWindowDimensions = function () {
                    return {
                        'h': w.height(),
                        'w': w.width()
                    };
                };

                scope.$watch(scope.getWindowDimensions, function(data){
                    scope.windowSize = data;
                }, true);

                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        }
    })
    .directive('spinner', function($window){
        return {
            restrict: "AE",
            template: "<div class='spinner' ng-style='{{spinnerStyle}}' ng-if='!urlImgFile.url'>" +
            "<div class='spinner-container container1'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div>" +
            "<div class='spinner-container container2'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div>" +
            "<div class='spinner-container container3'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div></div>",
            scope : {
                spinnerStyle : "@"
            }
        }
    })
;