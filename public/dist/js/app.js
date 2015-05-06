/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo', [
    "ngRoute",
    'ngResource',
    'ngAnimate',
    "errorHandler",
    "interceptor",
    "johayo.controller",
    "johayo.service",
    "johayo.directive",
    "johayo.filter",
    "johayo.clock",
    "ngDialog",
    'textAngular',
    "mgcrea.ngStrap",
    'angularFileUpload',
    "templates"
])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.responseInterceptors.push('securityInterceptor');
    }]).config(['$routeProvider', '$locationProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main/main.html',
                controller: 'mainController',
                resolve: {
                    boardList : function(boardService){
                        return boardService.list('').then(function(data){
                            return data;
                        });
                    }
                }
            })
            .when('/bookmark', {
                templateUrl: 'bookmark/bookmark.html',
                controller : 'bookmarkController'
            })
            .when('/admin/menu', {
                templateUrl: 'menu/adminMenu.html',
                controller: 'adminMenuController',
                resolve : {
                    menuList : function(menuService, loginService){
                        return  loginService.getCheckLogin().then(function(){
                            return menuService.getMenuList()
                                .then(function(menu){
                                    return menu;
                                });
                        });
                    }
                }
            })
            .when('/admin/board', {
                templateUrl: 'board/boardAdd.html',
                controller: 'boardAddController',
                resolve : {
                    menuList : function(menuService, loginService){
                        return  loginService.getCheckLogin().then(function(){
                            return menuService.getMenuList()
                                .then(function(menu){
                                    return menu;
                                });
                        });
                    }
                }
            })
            .when('/board/:division', {
                templateUrl: 'board/board.html',
                controller: 'boardController',
                resolve : {
                    boardList : function(boardService, $route){
                        return boardService.list($route.current.params.division).then(function(data){
                            return data;
                        });
                    }
                }
            })
            .when('/board/:division/:seq', {
                templateUrl: 'board/boardDetail.html',
                controller: 'boardDetailController',
                resolve : {
                    boardDetail : function(boardService, $route){
                        return boardService.detail($route.current.params.seq).then(function(data){
                            return data;
                        });
                    }
                }
            })
        ;
    }]);

angular.module('johayo.controller', []);

angular.module('johayo.service', []);

angular.module('johayo.directive', []);

angular.module("templates", []);
/**
 * Created by Administrator on 2014-08-11.
 */
angular.module('errorHandler', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
    .factory('errorQueue', ['$q', '$log', function($q, $log) {
        var errQueue = [];
        var service = {
            // The security service puts its own handler in here!
            errorCallbacks: [],

            hasMore: function() {
                return errQueue.length > 0;
            },
            push: function(retryItem) {
                errQueue.push(retryItem);
                // Call all the onItemAdded callbacks
                angular.forEach(service.errorCallbacks, function(cb) {
                    try {
                        cb(retryItem);
                    } catch(e) {
                        /*$log.error('errQueue.push(retryItem): callback threw an error' + e);*/
                    }
                });
            },
            pushErrorFn: function(status, msg) {
                // The deferred object that will be resolved or rejected by calling retry or cancel
                var retryItem = {
                    status : status,
                    msg : msg
                };
                service.push(retryItem);
            }
        };
        return service;
    }]);
/**
 * Created by Administrator on 2014-08-08.
 */
angular.module('interceptor', ['loginRetryQueue', 'errorHandler'])

// This http interceptor listens for authentication failures
    .factory('securityInterceptor', ['$injector', 'loginRetryQueue', 'errorQueue', function($injector, queue, err) {
        return function(promise) {
            // Intercept failed requests
            return promise.then(null, function(originalResponse) {
                if(originalResponse.status === 401) {
                    // The request bounced because it was not authorized - add a new request to the retry queue
                    promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
                        // We must use $injector to get the $http service to prevent circular dependency
                        return $injector.get('$http')(originalResponse.config);
                    });
                }
                else if(originalResponse.status === 500 || originalResponse.status === 409){
                    err.pushErrorFn(originalResponse.status, originalResponse.data);
                }

                return promise;
            });
        };
    }]);
/**
 * Created by Administrator on 2014-08-08.
 */
angular.module('loginRetryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
    .factory('loginRetryQueue', ['$q', '$log', '$location', function($q, $log, $location) {
        var retryQueue = [];
        var service = {
            // The security service puts its own handler in here!
            onItemAddedCallbacks: [],

            hasMore: function() {
                return retryQueue.length > 0;
            },
            push: function(retryItem) {
                retryQueue.push(retryItem);
                // Call all the onItemAdded callbacks
                angular.forEach(service.onItemAddedCallbacks, function(cb) {
                    try {
                        cb(retryItem);
                    } catch(e) {
                        $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
                    }
                });
            },
            pushRetryFn: function(reason, retryFn) {
                // The reason parameter is optional
                if ( arguments.length === 1) {
                    retryFn = reason;
                    reason = undefined;
                }

                // The deferred object that will be resolved or rejected by calling retry or cancel
                var deferred = $q.defer();
                var retryItem = {
                    reason: reason,
                    retry: function() {
                        // Wrap the result of the retryFn into a promise if it is not already
                        $q.when(retryFn()).then(function(value) {
                            // If it was successful then resolve our deferred
                            deferred.resolve(value);
                        }, function(value) {
                            // Othewise reject it
                            deferred.reject(value);
                        });
                    },
                    cancel: function() {
                        // Give up on retrying and reject our deferred
                        deferred.reject();
                    }
                };
                service.push(retryItem);
                return deferred.promise;
            },
            retryReason: function() {
                return service.hasMore() && retryQueue[0].reason;
            },
            cancelAll: function() {
                while(service.hasMore()) {
                    retryQueue.shift().cancel();
                }

                if($location.absUrl().indexOf('/sns/') > 0){
                    location.href='/';
                }
            },
            retryAll: function() {
                while(service.hasMore()) {
                    retryQueue.shift().retry();
                }
            }
        };

        return service;
    }]);
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

            $scope.boardFils = new Array();

            if(boardDetail.fileList.length > 0){
                for(var i=0;i<boardDetail.fileList.length;i++){
                    var classNm = boardDetail.fileList[i].isImg ? '<i class="fa fa-file-image-o"></i> ' : '<i class="fa fa-file-text-o"></i> ';
                    $scope.boardFils.push({
                        text: classNm + boardDetail.fileList[i].name,
                        href: '/download?path='+boardDetail.fileList[i].path +'&name='+boardDetail.fileList[i].name,
                        target: "_self"
                    });
                }
            }

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
/**
 * Created by 동준 on 2014-11-27.
 */
angular.module('johayo.controller')
    .controller('commentController', ['$scope', 'commentService',
        function($scope, commentService){
            /* 댓글 달때 씀 */
            $scope.comment = {};
            /* 댓글 수정시 글을 안보이고 editor를 보이게 할지 설정 */
            $scope.isShowEditor = {};

            /* 댓글 등록 */
            $scope.addComment = function(){
                commentService.addComment($scope.boardDetail._id, $scope.comment.content, $scope.comment.name, $scope.comment.pw)
                    .then(function(data){
                        $scope.boardDetail = data;
                        $scope.comment = {};
                    });
            };

            /* 댓글 수정 */
            $scope.editComment = function(commentDetail){
                commentService.editComment($scope.boardDetail._id, commentDetail.seq, commentDetail.content, commentDetail.pw)
                    .then(function(data){
                        console.log(data);
                        $scope.closeEditor();
                        $scope.boardDetail = data;
                        $scope.showWriteBox = false;
                    });
            };

            /* 댓글 삭제 */
            $scope.deleteComment = function(commentSeq, pw){
                commentService.deleteComment($scope.boardDetail._id, commentSeq, pw)
                    .then(function(data){
                        console.log(data);
                        $scope.boardDetail = data;
                    });
            };

            /* 유효성 체크 */
            $scope.checkVal = function(val){
                var checkContent = true;
                if(!!val.content){
                    checkContent = val.content.replace(/(<([^>]+)>)/ig,"") == ''
                }
                return checkContent || (!$scope.isLogin && (!val.name || !val.pw));
            };

            /* 댓글 수정시 다른 곳의 댓글들의 editor 연것을 안보이게 하고 해당 부분을 보이게 한다. */
            $scope.showEditor = function(seq, subSeq){
                $scope.showWriteBox = true;
                if(!!subSeq){
                    if(!$scope.isShowSubEditor[seq+'-'+subSeq]){
                        $scope.closeEditor();
                        $scope.isShowSubEditor[seq+'-'+subSeq] = true;
                    }else{
                        $scope.closeEditor();
                    }
                }else{
                    if(!$scope.isShowEditor[seq]){
                        $scope.closeEditor();
                        $scope.isShowEditor[seq] = true;
                    }else{
                        $scope.closeEditor();
                    }
                }
            };

            /* 댓글 다 닫기 */
            $scope.closeEditor = function(){
                if(!!$scope.boardDetail.commentList){
                    for(var i=0;i<$scope.boardDetail.commentList.length;i++){
                        $scope.isShowEditor[$scope.boardDetail.commentList[i].seq] = false;
                    }
                }
            };
        }]);
/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.controller')
    .controller('indexController', ['$rootScope', '$scope', 'loginService', 'errorService', 'msgService',
        function($rootScope, $scope, loginService, errorService, msgService){
            /* 윈도우 창의 크기를 체크 */
            $scope.windowSize = {};

            $scope.openLogin = function(){
                loginService.openLogin();
            };

            $scope.openMsg = function(){
                msgService.openMsg();
            };

            $scope.logout = function(){
                loginService.logout();
            };

            /**
             * 로그인 한후 정보를 다시 가지고 온다.
             */
            $rootScope.$on('getLoginInfo', function(){
                $scope.getLoginInfo();
            });

            $rootScope.$on("$routeChangeStart", function(){
                $scope.loading = true;
                /* 윈도우 창에 따른 메뉴 보이기 안보이기 체크 */
                $scope.windowSizeHideMenu();
            });

            $rootScope.$on("$routeChangeSuccess", function(){
                $scope.loading = false;
                var colorClass = ['primary', 'success', 'info', 'warning', 'danger'];
                $scope.boxClass = 'panel-' + colorClass[Math.floor(Math.random() * 5)];
                $scope.twoBoxClass= 'panel-' + colorClass[Math.floor(Math.random() * 5)];
            });

            $scope.getLoginInfo = function(){
                loginService.getLoginInfo().then(function(loginInfo){
                    $scope.loginInfo = loginInfo;
                    $scope.isLogin = loginService.isLogin();
                });
            };

            $scope.adminMenu = [
                    {text: '<i class="glyphicon glyphicon-ok"></i> Menu', href: '/#/admin/menu'},
                    /*{text: '<i class="glyphicon glyphicon-cog"></i> Setting', click: 'showEditor()'},*/
                    {text: '<i class="glyphicon glyphicon-pencil"></i> Write board', href:'/#/admin/board'},
                    {"divider": true},
                    {text: '<i class="glyphicon glyphicon-log-out"></i> Logout', click: 'logout()'}
                ];

            /**
             * 사이드 메뉴를 보일지 말지 체크한다.
             * 사이즈가 작았을때는 메뉴가 아닌 본문을 클릭스 보이지 않게 한다.
             */
            $scope.windowSizeHideMenu = function(){
                /* 윈도우 창에 따른 메뉴 보이기 안보이기 체크 */
                if($scope.windowSize.w < 1000){
                    $scope.hideMenu = false;
                }
            };

            $scope.getLoginInfo();
        }]);
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
/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.controller')
    .controller('adminMenuController', ['$rootScope', '$scope', 'menuService', 'menuList',
        function($rootScope, $scope, menuService, menuList){
            /* 현재 메뉴 리스트 */
            $scope.menuList = menuList;
            /* 메뉴 등록 */
            $scope.menu = {
                url : '/#/'
            };

            /* 메뉴 추가 */
            $scope.addMenu = function(){
                $scope.menu.url = '/#/';
                if(!!$scope.menu.isBoard){
                    $scope.menu.url = $scope.menu.url + 'board/';
                }

                /* 새로운 1step 메뉴 추가 */
                if(!$scope.menu.select){
                    $scope.menu.url = $scope.menu.url + $scope.menu.name;
                    menuService.addOneStepMenu($scope.menu).then(function(){
                        $scope.getMenuList();
                    });
                }
                /* 2step 메뉴 추가 */
                else{
                    $scope.menu.url = $scope.menu.url + $scope.menu.name;
                    $scope.menu.oneStep_id = $scope.menu.select._id;
                    menuService.addTwoStepMenu($scope.menu).then(function(){
                        $scope.getMenuList();
                    });
                }
            };

            $scope.getMenuList = function(){
                menuService.menuList = null;
                menuService.getMenuList().then(function(data){
                    $scope.menuList = data;
                });
                $rootScope.$broadcast('getMenuList');
            };
        }])

    .controller('sideMenuController', ['$rootScope', '$scope', 'menuService', '$location',
        function($rootScope, $scope, menuService, $location){
            /* 라우터가 바뀔때마다 체크 */
            $rootScope.$on("$routeChangeSuccess", function(){
                if(!!$scope.menuList){
                    $scope.getActiveMenu();
                }else{
                    $scope.getMenuList();
                }
            });

            $scope.getActiveMenu = function(){
                $scope.activeMenu = '';
                $scope.activeSubMenu = '';
                for(var i=0;i<$scope.menuList.length;i++){
                    if($location.path().indexOf($scope.menuList[i].url.replace('/#/', '')) > -1){
                        $scope.activeMenu = $scope.menuList[i].name;
                    }
                    if($scope.menuList[i].subMenuList.length > 0){
                        for(var j=0;j<$scope.menuList[i].subMenuList.length;j++){
                            if($location.path().indexOf($scope.menuList[i].subMenuList[j].url.replace('/#/', '')) > -1){
                                $scope.activeSubMenu = $scope.menuList[i].subMenuList[j].name;
                            }
                        }
                    }
                }
            };

            /* 메뉴를 클릭스 active를 옮겨준다. */
            $scope.moveActive = function(name) {
                $scope.activeMenu = name;
            };

            /* active 해야되는 메뉴를 바꺼준다.. */
            $scope.isActive = function(name){
                return {
                    'active': $scope.checkActive(name)
                }
            };

            /* 선택된 메뉴와 현재 메뉴를 비교해서 알려준다. */
            $scope.checkActive = function(name){
                return $scope.activeMenu == name;
            };

            /* step2의 메뉴를 체크하여 보여준다. */
            $scope.isSubActive = function(name){
                return {
                    'active' : $scope.activeSubMenu == name
                }
            };

            /* class를 가지고 온다. */
            $scope.getClass = function(length){
                return { 'sub-menu' : length > 0};
            };

            $scope.getMenuList = function(){
                menuService.getMenuList().then(function(data){
                    $scope.menuList = data;
                    $scope.getActiveMenu();
                });
            };

            /* 메뉴를 다시 가지고 온다.*/
            $rootScope.$on('getMenuList', function(){
                $scope.getMenuList();
            });
        }]);
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
/**
 * Created by Administrator on 2014-08-11.
 */
angular.module("johayo.filter", [])
    /* 글자수를 자르고 해당 글을 가지고 온다. */
    .filter('limitAndJjum', function(limitToFilter){
        return function(input, limit){
            if(input){
                if(input.length > limit){
                    return limitToFilter(input, limit-3) + '...'
                }
                return input;
            }

            return input;
        }
    })
    /* html태그를 제외 하고 글자수를 자르고 해당 글을 가지고 온다. */
    .filter('cutHtmlTagAndLimit', function(limitToFilter) {
        return function(input, limit){
            if(input){
                var changeInput = input.replace(/(<([^>]+)>)/ig,"");

                if(changeInput.length > limit){
                    return limitToFilter(changeInput, limit-3) + '...'
                }
                return changeInput;
            }

            return input;
        };
    })
    /* 주소를 변경해서 넘겨준다. */
    .filter('getAttrSrc',['$sce', function($sce) {
        return function(input, type){
            if(input){
                var tag = '<div>'+input+'<div>';
                if(type=='img'){
                    return $sce.trustAsResourceUrl($(tag).find('img:first').attr('src'));
                }else{
                    return $sce.trustAsResourceUrl($(tag).find('iframe:first').attr('src'));
                }
            }
            return input;
        };
    }])
    .filter('changeTrustAdHtml',['$sce', function($sce) {
        return function(input){
            if(input){
                return $sce.trustAsHtml(input);
            }
            return input;
        };
    }])
    .filter('firstCharUpper', function() {
        return function(input){
            if(input){
                return input.substring(0,1).toUpperCase()+input.substring(1,input.length);;
            }
            return input;
        };
    })
;
/**
 * Created by 동준 on 2015-03-24.
 */
angular.module('johayo.directive')
    .directive('bookmark', function(){
        return {
            restrict: 'AE',
            templateUrl: 'bookmark/bookmark.html',
            controller : 'bookmarkController'
        }
    });
/**
 * Created by 동준 on 2014-11-28.
 */
angular.module('johayo.directive')
    .directive('commentBox', function(){
        return {
            restrict: 'AE',
            replace: true,
            templateUrl : 'comment/comment.html',
            scope : {
                commentList : "="
            },
            controller: 'commentController'
        }
    });
/**
 * Created by 동준 on 2014-11-17.
 */
angular.module('johayo.directive')
    .directive('searchBox', function(){
        return {
            restrict: 'AE',
            scope : {
                searchText : "="
            },
            template: '<div class="search-box"><i class="fa fa-search"></i><input type="text" class="search-text" placeholder="Search" ng-style="getSearchTextStyle()" ng-model="searchText"></div>',
            link: function (scope, element, attrs) {
                scope.getSearchTextStyle = function(){
                    var style= '';
                    if(!!scope.searchText){
                        style = {width : '160px'}
                    }

                    return style
                };
            }
        }
    })
    .directive('headerMenuScrolly', function($window){
        return {
            restrict: 'A',
            scope : {
                scrollSize : "="
            },
            link: function (scope, element, attrs) {
                angular.element($window).bind("scroll", function() {
                    scope.scrollSize = this.pageXOffset;
                    scope.$apply();
                });
            }
        }
    })
    .directive('windowWidthCheck', function($window){
        return {
            restrict: 'AE',
            scope : {
                windowSize : "="
            },
            link: function (scope, element, attrs) {
                var w = angular.element($window);
                scope.getWindowDimensions = function () {
                    return {
                        'h': w.height(),
                        'w': w.width()
                    };
                };

                scope.$watch(scope.getWindowDimensions, function(data){
                    scope.windowSize = data;
                }, true);

                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        }
    })
    .directive('spinner', function($window){
        return {
            restrict: "AE",
            template: "<div class='spinner' ng-style='{{spinnerStyle}}' ng-if='!urlImgFile.url'>" +
            "<div class='spinner-container container1'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div>" +
            "<div class='spinner-container container2'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div>" +
            "<div class='spinner-container container3'><div class='circle1'></div><div class='circle2'></div><div class='circle3'></div><div class='circle4'></div></div></div>",
            scope : {
                spinnerStyle : "@"
            }
        }
    })
;
/**
 * Created by 동준 on 2014-11-14.
 */
angular.module('johayo.directive')
    .directive('johayoMenu', function($window){
        return {
            restrict: 'A',
            templateUrl : 'menu/sideMenu.html',
            scope : {
                hideMenu : '@'
            },
            controller : 'sideMenuController'
        }
    });
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
                getFiles : function(seq){
                    var asy = $q.defer();
                    boardApi.admin.delete({seq: seq}, function(){
                        asy.resolve();
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
/**
 * Created by Administrator on 2014-08-04.
 */
angular.module("johayo.service")
    .factory("errorService", ['ngDialog', 'errorQueue', function(ngDialog, queue){

        var errorDialog = null;

        function openErrDialog(msg) {
            if(!!errorDialog){
                errorDialog.close();
            }

            errorDialog = ngDialog.open({
                template: 'error/error.html',
                className: 'ngdialog-theme-error ngdialog-theme-custom-error',
                controller : ['$scope', function($scope){
                    $('#close').focus();
                    $scope.errorMsg = msg;
                    $scope.doClose = function(){
                        errorDialog.close();
                    };
                }]
            });
            errorDialog.focus();

            return errorDialog
        }

        // Register a handler for when an item is added to the retry queue
        queue.errorCallbacks.push(function(params) {
            if ( queue.hasMore() ) {
                service.openErrorModal(params);
            }
        });

         var service = {
            openErrorModal : function(res){
                openErrDialog(res.msg);
            }
        };
        return service;
    }]);

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
/**
 * Created by 동준 on 2014-10-23.
 */
angular.module("johayo.service")
    .factory("loginService", ['$http', '$q', '$rootScope', 'loginRetryQueue', 'ngDialog', function($http, $q, $rootScope, queue, ngDialog){
        // Login form dialog stuff
        var loginDialog = null;
        function openLoginDialog() {
            if ( loginDialog ) {
                throw new Error('Trying to open a dialog that is already open!');
            }

            loginDialog = ngDialog.open({
                template: 'login/login.html',
                controller: 'loginController',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            });

            return loginDialog;
        }

        function onLoginDialogClose(success) {
            loginDialog = null;
            if ( success() ) {
                queue.retryAll();
            } else {
                queue.cancelAll();
            }
        }

        // Register a handler for when an item is added to the retry queue
        queue.onItemAddedCallbacks.push(function() {
            if ( queue.hasMore() ) {
                service.openLogin();
            }
        });

        var service = {
            // Get the first reason for needing a login
            getLoginReason: function() {
                return queue.retryReason();
            },
            // Show the modal login dialog
            openLogin: function() {
                ngDialog.close();
                var asy = $q.defer();
                openLoginDialog().closePromise.then(function(){
                    onLoginDialogClose(service.isLogin);
                    service.finalLogin();
                    asy.resolve();
                });
                return asy.promise;
            },
            doLogin : function(login){
                var asy = $q.defer();
                $http.post('/api/login', login).success(function (data){
                    service.loginInfo = data;
                    service.finalLogin();
                    asy.resolve(data);
                }).error(function(data, st){asy.reject(data);});
                return asy.promise;
            },
            logout : function(){
                var asy = $q.defer();
                $http.post('/api/login/logout').then(function(){
                    service.loginInfo = null;
                    service.finalLogin();
                    asy.resolve();
                });
                return asy.promise;
            },
            // Ask the backend to see if a user is already authenticated - this may be from a previous session.
            getLoginInfo: function() {
                var asy = $q.defer();
                if ( service.isLogin() ) {
                    asy.resolve(service.loginInfo);
                } else {
                    $http.post('/api/login/getLogin').then(function(response) {
                        service.loginInfo = response.data;
                        asy.resolve(service.loginInfo);
                    });
                }
                return asy.promise;
            },
            isLogin: function(){
                return !!service.loginInfo;
            },
            getCheckLogin : function(){
                var asy = $q.defer();
                $http.post('/api/login/check').then(function(){
                    asy.resolve();
                });
                return asy.promise;
            },
            finalLogin : function(){
                $rootScope.$broadcast('getLoginInfo');
            },
            loginInfo: null
        };

        return service;
    }]);

/**
 * Created by 동준 on 2014-11-17.
 */
angular.module("johayo.service")
    .factory("menuService", ['$http', '$q',
        function($http, $q){
            var service = {
                menuList : null,
                getMenuList : function(){
                    var asy = $q.defer();
                    if ( !!service.menuList ) {
                        asy.resolve(service.menuList);
                    } else {
                        $http.get('/api/menu').then(function(response) {
                            service.menuList = response.data;
                            asy.resolve(service.menuList);
                        });
                    }
                    return asy.promise;
                },
                addOneStepMenu : function(param){
                    var asy = $q.defer();
                    $http.post('/api/adminMenu', param).then(function(data) {
                        service.menuList = data;
                        asy.resolve(service.menuList);
                    });
                    return asy.promise;
                },
                addTwoStepMenu : function(param){
                    var asy = $q.defer();
                    $http.post('/api/adminMenu/sub', param).then(function(data) {
                        service.menuList = data;
                        asy.resolve(service.menuList);
                    });
                    return asy.promise;
                }
            };

            return service;
        }]);
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
                    template: 'msg/msg.html',
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
