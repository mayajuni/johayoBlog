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