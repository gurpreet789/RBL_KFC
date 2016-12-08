(function () {
    'use strict';

    // angular directive for this component. 
    var directive = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // template view to use. Currently only return string of the static html view.
            // 
            // Parameters
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/myaccountpage/edit-password/edit-password.html';
                }
                return 'partials/edit-password.html';
            },

            // This directive's controller
            controller: 'rbEditPassword.controller',

            // The controller alias
            controllerAs: 'editPassword',
        };
    }

    // register the directive
    var app = angular.module('main');
    directive.$inject = ["OPTIMISATION"];
    app.directive('rbEditPassword', directive);
}());