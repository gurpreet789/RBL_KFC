(function () {
    'use strict';

    // cart panel directive
    var cartPanelDirective = function (OPTIMISATION) {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/mycart/cart-panel.html';
                }
                return 'partials/cart-panel.html';
            },
            controller: 'rbCartPanel.controller',
            controllerAs: 'cartpanel',
            link: function (scope, element, attrs) {

            }
        };
    };

    // register directive
    var app = angular.module('main');
    cartPanelDirective.$inject = ["OPTIMISATION"];
    app.directive('rbCartPanel', cartPanelDirective);
}());