/**
 * Created by 동준 on 2014-11-17.
 */
angular.module('johayo.controller')
    .controller('loginController', ['$scope', 'loginService', 'ngDialog', '$alert',
        function($scope, loginService, ngDialog, $alert){
            loginService.logout();
            $scope.login = {};
            var alert = null;

            $scope.doLogin = function(){
                loginService.doLogin($scope.login).then(function(){
                    ngDialog.close();
                }, function(err){
                    if(err){
                        if(!!alert){
                            alert.hide();
                            alert = null;
                        }
                        alert =  $alert({title: err, type: 'danger', show: true, container:'#alerts-container'});
                    }
                });
            };

        }]);