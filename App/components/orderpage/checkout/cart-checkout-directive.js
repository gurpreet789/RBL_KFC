(function () {
    'use strict';

    // cart checkout directive
    var cartCheckoutDirective = function (OPTIMISATION) {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/checkout/cart-checkout.html';
                }
                return 'partials/cart-checkout.html';
            },
            controller: 'rbCheckout.controller',
            controllerAs: 'checkout'
        };
    }

    // register directive
    var app = angular.module('main');
    cartCheckoutDirective.$inject = ["OPTIMISATION"];
    app.directive('rbCartCheckout', cartCheckoutDirective);
}());