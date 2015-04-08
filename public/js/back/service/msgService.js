/**
 * Created by 동준 on 2014-12-11.
 */
angular.module("johayo.service")
    .factory("msgService", ['$http', '$q', 'ngDialog', function($http, $q, ngDialog){
        // Login form dialog stuff
        var service = {
            // Show the modal login dialog
            openMsg: function() {
                ngDialog.open({
                    template: '/html/msg/msg.html',
                    controller: 'msgController',
                    className: 'ngdialog-theme-flat'
                });
            },
            sendMsg: function(param) {
                var asy = $q.defer();
                $http.post('/api/msg/', param).success(function(response){
                    asy.resolve(response.data);
                }).error(function(data){asy.reject(data);});
                return asy.promise;
            }
        };

        return service;
    }]);
