/**
 * Created by 동준 on 2014-12-09.
 */
angular.module("johayo.service")
    .factory("bookmarkService", ['$http', '$q', function($http, $q){
        var service = {
            getImg : function(url){
                var asy = $q.defer();
                $http.post('/api/bookmark/url', {url:url}).then(function(response){
                    asy.resolve(response.data);
                }, function(err){
                    asy.reject(err);
                });

                return asy.promise;
            },
            deleteFile : function(filePath){
                var asy = $q.defer();
                $resource('/api/file/',{filePath:'@filePath'}).delete({filePath:filePath},function(){
                    asy.resolve('');
                });
                return asy.promise;
            }
        };

        return service;
    }]);