(function () {
    'use strict';

    // Authentication Service
    var authService = function ($http, $cookieStore, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('api/account/authenticate/', { username: username, password: password })
                .success(function (response) {
                    callback(response);
                });
        };

        service.SetCredentials = function (username, password) {
            //we can set credentials here to maintain cookie or session 

            //dummy
            var authdata = "testdummy";

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'RbApp' + authdata;
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
            //called when logout

            //dummy
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'RbApp';
        };

        service.GetCredentials = function (username, password, callback) {
            $http.get('/api/authentication/getcredentials/')
                .success(function (response) {
                    callback(response);
                });
        };

        return service;
    }

    // register the service
    var app = angular.module('main');
    app.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', authService]);
}());
