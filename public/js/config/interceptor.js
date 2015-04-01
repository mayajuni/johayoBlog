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