/**
 * Created by 동준 on 2014-12-11.
 */
angular.module('johayo.controller')
    .controller('msgController', ['$scope', 'msgService', '$alert',
        function($scope, msgService,  $alert){
            $scope.msg = {};
            var alert = null;
            $scope.sendMsg = function(){
                if(!!alert){
                    alert.hide();
                    alert = null;
                }
                msgService.sendMsg($scope.msg).then(function(){
                    alert = $alert({title: 'DongJun Kwon에게 메세지(이메일,텔레그램) 보내기 성공했습니다.', type: 'success', show: true, container:'#alerts-container'});
                }, function(data){
                    alert =  $alert({title: data, type: 'danger', show: true, container:'#alerts-container'});
                });
            };
        }]);