/**
 * Created by 동준 on 2014-11-27.
 */
angular.module("johayo.service")
    .factory("commentService", ['$http', '$q', '$resource', '$location',
        function($http, $q, $resource, $location){
            /* 서브는 꼭 division에 sub 라고 넣어줘야됨 */
            var commentApi = $resource('/api/comment/:division/',
                {division:'@division'},
                {
                    'delete': {method: 'post'},
                    'update' : {method:'put'}
                }
            );

            var service = {
                addComment : function(boardSeq, content, name, pw){
                    var asy = $q.defer();
                    commentApi.save({boardSeq: boardSeq, name: name, content: content, pw: pw, url: $location.path()}, function(data){
                        asy.resolve(data);
                    });
                    return asy.promise;
                },
                editComment : function(boardSeq, commentSeq, content, pw){
                    var asy = $q.defer();
                    commentApi.update({boardSeq: boardSeq, commentSeq: commentSeq, content: content, pw: pw, url: $location.path()}, function(data){
                        console.log(data);
                        asy.resolve(data);
                    });
                    return asy.promise;
                },
                deleteComment : function(boardSeq, commentSeq, pw){
                    var asy = $q.defer();
                    commentApi.delete({division:'delete', boardSeq: boardSeq, commentSeq: commentSeq, pw: pw, url: $location.path()}, function(data){
                        asy.resolve(data);
                    });
                    return asy.promise;
                }/*
                addSubComment : function(param){
                    var asy = $q.defer();
                    commentApi.save(param, function(data){
                        asy.resolve(data);
                    });
                    return asy.promise;
                },
                editSubComment: function(param){
                    var asy = $q.defer();
                    commentApi.put(param, function(){
                        asy.resolve();
                    });
                    return asy.promise;
                },
                deleteSubComment: function(param){
                    var asy = $q.defer();
                    commentApi.delete(param, function(data){
                        asy.resolve(data);
                    });
                    return asy.promise;
                }*/
            };

            return service;
        }]);