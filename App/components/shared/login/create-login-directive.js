(function () {
    'use strict';

    // angular directive for login modal dialog component. 
    // This directive gets the template view from backend and will then be filled in by angular controller.
    var createLoginDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // template view to use.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/login/create-login.html';
                }
                return 'partials/create-login.html';
            },

            // controller definition
            controller: 'rbCreateLogin.controller',

            // alias controller
            controllerAs: 'createLogin'
        };
    }

    // register login directive
    var app = angular.module('main');
    createLoginDirective.$inject = ["OPTIMISATION"];
    app.directive('rbCreateLogin', createLoginDirective);

}());
