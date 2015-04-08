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