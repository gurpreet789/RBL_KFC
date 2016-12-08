(function () {
    'use strict';

    // angular directive for this component. 
    var directive = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // template view to use.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/myaccountpage/add-address/add-address-button.html';
                }
                return 'partials/add-address-button.html';
            },

            // This directive's controller
            controller: 'rbAddAddressButton.controller',

            // The controller alias
            controllerAs: 'addAddressButton'
        };
    }

    // register the directive
    var app = angular.module('main');
    directive.$inject = ["OPTIMISATION"];
    app.directive('rbAddAddressButton', directive);
}());