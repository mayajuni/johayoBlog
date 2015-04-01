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