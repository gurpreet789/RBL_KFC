
(function () {
    'use strict';

    // Directive function. 
    var orderMenuSectionCountDirective = function (OPTIMISATION) {
        return {
            // Restrict to element use only.
            restrict: 'E',
            scope: {
                productSection: '@'
            },
            // template view to use.
            // 
            // Parameters
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function(element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/order-menu/order-menu-section-count.html';
                }
                return 'partials/order-menu-section-count.html';
            },
            controller: 'rbOrderMenuSectionCount.controller',
            controllerAs: 'orderMenuSectionCount'};
    }

    // Register the directive.
    var app = angular.module('main');
    orderMenuSectionCountDirective.$inject = ["OPTIMISATION"];
    app.directive('rbOrderMenuSectionCount', orderMenuSectionCountDirective);
}());