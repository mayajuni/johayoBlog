/**
 * Created by 동준 on 2014-12-05.
 */
angular.module("johayo.service")
    .factory("fileService", ['$resource','$sce', '$q', '$upload', function($resource, $sce, $q, $upload){
        var service = {
            fileUpload : function(file, division){
                var asy = $q.defer();
                $upload.upload({
                    url : '/api/file',
                    method: "post",
                    headers: {'my-header': 'my-header-value'},
                    file: file,
                    fileFormDataName: 'myFile'
                }).then(function(response) {
                    asy.resolve(response.data);
                }, function(response) {
                    asy.reject(response.data);
                }, function(evt) {
                    asy.notify(evt)
                });
                return asy.promise;
            },
            deleteFile : function(filePath){
                var asy = $q.defer();
                $resource('/api/file/',{filePath:'@filePath'}).delete({filePath:filePath},function(){
                    asy.resolve('');
                });
                /*$http.delete('/api/file/'+filePath).success(function(data){
                    asy.resolve(data);
                });*/
                return asy.promise;
            }
        };

        return service;
    }]);