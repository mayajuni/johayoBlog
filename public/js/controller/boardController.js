/**
 * Created by 동준 on 2014-11-25.
 */
angular.module('johayo.controller')
    .controller('boardController', ['$scope', 'boardService', 'boardList', '$location',
        function($scope, boardService, boardList, $location){
            /* 상세 갈때 쓴다. */
            $scope.path = $location.path();
            $scope.boardList = boardList;
            $scope.activePanel = 0;

            $scope.getColor = function(index){
                return {
                    'list-group-item-success' : index % 4 == 0,
                    'list-group-item-warning' : index % 4 == 1,
                    'list-group-item-info' : index % 4 == 2,
                    'list-group-item-danger' : index % 4 == 3
                }
            };
        }])
    .controller('boardDetailController', ['$scope', 'boardService', 'boardDetail', '$location', '$routeParams',
        function($scope, boardService, boardDetail, $location, $routeParams){
            $scope.boardDetail = boardDetail;
            $scope.boardConfig = [
                {text: '<i class="glyphicon glyphicon-pencil"></i> Edit', click: 'showEditor()'},
                {text: '<i class="glyphicon glyphicon-remove"></i> Delete', click: 'deleteBoard()'},
            ];

            $scope.deleteBoard = function(){
                boardService.delete(boardDetail._id).then(function(){
                    $location.path('/board/'+$routeParams.division);
                });
            }

        }])
    .controller('boardAddController', ['$scope', 'boardService', 'menuList', 'fileService',
        function($scope, boardService, menuList, fileService){
            $scope.menuList = menuList;

            $scope.cleanScope = function(){
                $scope.uploadFileList = new Array();
                $scope.selectedFiles = new Array();
                $scope.board = {};
            };

            $scope.addBoard = function(){
                $scope.board.fileList = $scope.uploadFileList;
                boardService.save($scope.board).then(function(){
                    $scope.cleanScope();
                    alert('ok');
                });
            };

            $scope.onFileSelect = function($files) {
                for ( var i = 0; i < $files.length; i++) {
                    $scope.selectedFiles.push($files[i]);
                    var count = $scope.selectedFiles.length*1-1 ;
                    $scope.selectedFiles[count].isImg = $scope.selectedFiles[count].type.indexOf('image') > -1;
                    $scope.uploadFile(count);
                }
            };

            $scope.uploadFile = function(index){
                $scope.selectedFiles[index].progress = 0;
                fileService.fileUpload($scope.selectedFiles[index], 'board')
                    .then(function(data){
                        $scope.uploadFileList.push(data);
                    },function(err){
                        $scope.selectedFiles[index].progress = 0;
                        $scope.selectedFiles[index].error = err;
                    },function(evt){
                        $scope.selectedFiles[index].progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
            };

            $scope.deleteFile = function(index, filePath){
                fileService.deleteFile(filePath).then(function(){
                    $scope.uploadFileList.splice(index,1);
                    $scope.selectedFiles.splice(index,1);
                });
            };

            $scope.cleanScope();
        }]);