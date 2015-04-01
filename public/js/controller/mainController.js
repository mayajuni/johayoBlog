/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.controller')
    .controller('mainController', ['$scope', "boardList",
        function($scope, boardList){
            $scope.boardList = boardList;

            /* 모듈상 click이 없으면 표시가 안됨 */
            $scope.helper = [
                {text: '<i class="glyphicon glyphicon-thumbs-up"></i> 박동재', click: 'helperClick()'},
                {text: '<i class="glyphicon glyphicon-thumbs-up"></i> 유자성', click: 'helperClick()'},
                {text: '<i class="glyphicon glyphicon-thumbs-up"></i> angular 스터디그룹', click: 'helperClick()'},
                {"divider": true},
                {text: '등등 여러 모든 분들..<i class="glyphicon glyphicon-thumbs-up"></i><i class="glyphicon glyphicon-thumbs-up"></i>', click: 'helperClick()'}
            ];
        }]);