
(function () {
    'use strict';

    // Directive function. 
    var orderMenuTabDirective = function () {
        return {
            // Restrict to element use only.
            restrict: 'E',
            scope: {},
            // template view to use.
            // 
            // Parameters
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/order-menu/order-menu-tab.html';
                }
                return 'partials/order-menu-tab.html';
            },
            controller: 'rbOrderSubMenu.controller',
            controllerAs: 'orderMenuTab'};
    }

    // Register the directive.
    var app = angular.module('main');
    app.directive('rbOrderMenuTab', [orderMenuTabDirective]);
}());