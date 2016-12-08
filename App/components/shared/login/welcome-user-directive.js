(function () {
    'use strict';

    // angular directive for welcomUser modal dialog component. 
    // This directive gets the template view from backend and will then be filled in by angular controller.
    var welcomUserDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only.
            restrict: 'E',

            // template view to use.
            templateUrl: function (element, attr) {
                
                if (!OPTIMISATION) {
                    return 'App/components/shared/login/welcome-user.html';
                }
                return 'partials/welcome-user.html';
            },
           

            // this directive's controller.
            controller: 'rbWelcomeUser.controller',

            // alias controller.
            controllerAs: 'welcomeuser'
        };
    }

    // register login directive
    var app = angular.module('main');
    welcomUserDirective.$inject = ["OPTIMISATION"];
    app.directive('rbWelcomeUser', welcomUserDirective);
}());
