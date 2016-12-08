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
                    return 'App/components/myaccountpage/contact-details/contact-details.html';
                }
                return 'partials/contact-details.html';
            },

            // This directive's controller
            controller: 'rbContactDetails.controller',

            // The controller alias
            controllerAs: 'contactDetails',
        };
    }

    // register the directive
    var app = angular.module('main');
    directive.$inject = ["OPTIMISATION"];
    app.directive('rbContactDetails', directive);
}());