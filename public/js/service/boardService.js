/**
 * Created by 동준 on 2014-11-25.
 */
angular.module("johayo.service")
    .factory("boardService", ['$resource', '$q', '$http',
        function($resource, $q, $http){
            var boardApi = {
                list : $resource('/api/board/list/:division',{division:'@division'},{'query': {method: 'GET', isArray:true}}),
                url : $resource('/api/board/:seq',{seq:'@seq'},{'get': {method: 'GET'}}),
                admin : $resource('/api/adminBoard/:seq',{seq:'@seq'}, {'update': {method:'PUT'}})
            };

            var service = {
                list : function(division){
                    var asy = $q.defer();
                    $http.get('/api/board/list/'+division).then(function(response){
                        asy.resolve(response.data);
                    });
                    return asy.promise;
                },
                detail : function(seq){
                    var asy = $q.defer();
                    $http.get('/api/board/'+seq).then(function(response){
                        asy.resolve(response.data);
                    });
                    return asy.promise;
                },
                save : function(params){
                    var asy = $q.defer();
                    boardApi.admin.save(params, function(){
                        asy.resolve('');
                    });
                    return asy.promise;
                },
                update : function(seq, title, content){
                    var asy = $q.defer();
                    boardApi.admin.update({title: title, content: content, seq: seq}, function(){
                        asy.resolve(data);
                    });
                    return asy.promise;
                },
                delete : function(seq){
                    var asy = $q.defer();
                    boardApi.admin.delete({seq: seq}, function(){
                        asy.resolve();
                    });
                    return asy.promise;
                }
            };

            return service;
        }]);