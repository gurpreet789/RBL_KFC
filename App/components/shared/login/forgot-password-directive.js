(function () {
    'use strict';

    // angular directive for login modal dialog component. 
    // This directive gets the template view from backend and will then be filled in by angular controller.
    var forgotPasswordDirective = function (OPTIMISATION) {
        /// <summary>
        /// s this instance.
        /// </summary>
        /// <returns></returns>
        return {

            // restrict to element use only 
            restrict: 'E',

            // template view to use.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/login/forgot-password.html';
                }
                return 'partials/forgot-password.html';
            },

            // register js
            link: function (scope, element, attributes) {
                //element.find('#emailconfirmationtext').hide();
                //element.find('#continue').hide();
                //element.find('.emailValidation').hide();                
                //element.find('.open-login-window').on('click', ShowLoginModal);
            },

            // this directive's controller
            controller: 'rbForgotPassword.controller',

            // alias controller:
            controllerAs: 'forgotPassword'
        };
    }

    // register login directive
    var app = angular.module('main');
    forgotPasswordDirective.$inject = ["OPTIMISATION"];
    app.directive('rbForgotPassword', forgotPasswordDirective);
}());
