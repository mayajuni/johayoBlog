/**
 * Created by 동준 on 2014-12-08.
 */
angular.module('johayo.controller')
    .controller('bookmarkController', ['$scope', 'bookmarkService', 'boardService', 'fileService',
        function($scope, bookmarkService, boardService, fileService){
            $scope.cleanBookmark = function(){
                $scope.bookmark = {
                    division : 'bookmark',
                    fileList : new Array()
                };
            };
            $scope.urlImgFile = {};
            $scope.search = {};

            var oldUrl = '';
            $scope.addBookmark = function(bookmark){
                boardService.save(bookmark).then(function(){
                    $scope.cleanBookmark();
                    $scope.getList();
                });
            };

            $scope.deleteBookmark = function(seq){
                boardService.delete(seq).then(function(){
                    $scope.getList();
                });
            };

            $scope.getList = function(){
                boardService.list($scope.bookmark.division).then(function(data){
                    $scope.bookmarkList = data;
                });
            };

            $scope.getUrlImg = function(url){
                if(!url || oldUrl == url){
                    return;
                }

                oldUrl = url;

                if(!!$scope.bookmark.fileList[0] && !!$scope.bookmark.fileList[0].path){
                    fileService.deleteFile($scope.bookmark.fileList[0].path);
                    $scope.bookmark.fileList[0] = {};
                }

                console.log(validateURL(url));
                if(!validateURL(url) || url == 'test'){
                    return;
                }
                $scope.showSpinner = true;

                bookmarkService.getImg(url)
                    .then(function(data){
                        $scope.bookmark.fileList[0] = data;
                        $scope.showSpinner = false;
                    });
            };

            $scope.cleanBookmark();
            $scope.getList();

            function validateURL(textval) {
                var urlregex = new RegExp(
                    "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
                return urlregex.test(textval);
            }
        }]);