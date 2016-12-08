(function () {
    'use strict';

    // angular directive for login modal dialog component. 
    // This directive gets the template view from backend and will then be filled in by angular controller.
    var loginDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only.
            restrict: 'E',

            // template view to use.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/login/login.html';
                }
                return 'partials/login.html';
            },

            // register js.
            link: function (scope, element, attributes) {
                element.find('.btn-create-login').on('click', showCreateLogin);
                element.find('#clearfogotpassword').on('click', clearForgotPassword);
                scope.login.model.modalReference = element.find("#login-dialog");
               
            },

            // this directive's controller.
            controller: 'rbLogin.controller',

            // alias controller.
            controllerAs: 'login'
        };
    }

    // register login directive
    var app = angular.module('main');
    loginDirective.$inject = ["OPTIMISATION"];
    app.directive('rbLogin', loginDirective);
}());
