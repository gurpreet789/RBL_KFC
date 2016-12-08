(function () {
    'use strict';

    // this must be put in main module or else it won't work. 
    // this interceptor is registered in routeConfig in app.js
    var appRoot = angular.module('main');

    // create factory id
    var interceptorId = 'CustomHttpInterceptor';

    // register interceptor
    appRoot.factory(interceptorId, interceptor);

    // injecting dependencies
    interceptor.$inject = ['$q'];

    // This is a custom interceptor for Http request and response. Currently it's using for custom error page. 
    // If a specific Http Status Code is received, it will do whatever the function want to do. 
    // In this case it's just show the rejection response. 
    function interceptor($q) {
        return {
            // response Error 
            'responseError': function (rejection) {
                switch (rejection.status) {
                    case 500:
                    case 404:
                        // shows the page using the rejection response even if there's error on the page or not found
                        return rejection;

                    default:
                        // reject it by default
                        return $q.reject(rejection)
                }
            }
        };
    }
}());
