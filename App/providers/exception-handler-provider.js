(function () {
    'use strict';

    var module = angular.module('rbExceptionHandler.provider', []);

    // initialise provider id. This provider is replacing default angular $exceptionHandlerProvider
    var providerId = '$exceptionHandler';

    // register provider
    module.provider(providerId, exceptionHandlerProvider);

    // This is a custom provider for angular $exceptionHandler function. 
    // Every javascript error/exception thrown will go to the function. Original function only logs the exception to javascript console log. 
    // This custom provider will replace that said function. It will log it to JSN Log that will then be catched with Elmah (server side logging).
    function exceptionHandlerProvider () {
        this.$get = ['$log', function ($log) {
            function exceptionHandler(exception, cause) {
                // log error to JSN Log that hooked up with Elmah
                JL(providerId).fatalException(cause, exception);
            }

            return (exceptionHandler);
        }]
    }
}());
