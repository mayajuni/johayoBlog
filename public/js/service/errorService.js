angular.module("johayo.service").factory("errorService",['ngDialog','errorQueue',function(ngDialog,queue){var errorDialog=null;function openErrDialog(msg){if(!!errorDialog){errorDialog.close();}errorDialog=ngDialog.open({template:'/html/error/error.html',className:'ngdialog-theme-error ngdialog-theme-custom-error',controller:['$scope',function($scope){$('#close').focus();$scope.errorMsg=msg;$scope.doClose=function(){errorDialog.close();};}]});errorDialog.focus();return errorDialog}queue.errorCallbacks.push(function(params){if(queue.hasMore()){service.openErrorModal(params);}});var service={openErrorModal:function(res){openErrDialog(res.msg);}};return service;}]);