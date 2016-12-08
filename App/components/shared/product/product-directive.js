(function () {
    'use strict';

    // angular directive for product list component. 
    var productListDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            scope: {
                headerClass: '@',
                headerTitle: '@',
                hasFilter: '@',
                hasTitle: '@',
                isNested: '@',
                productTab: '@',
            },

            // template view to use. Currently only return string of the static html view.
            // 
            // Parameters
            // element:  
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/product/product-list.html';
                }
                return 'partials/product-list.html';
            },

            // This directive's controller
            controller: 'rbProductList.controller',

            // The controller alias
            controllerAs: 'product',

            link: function (scope, element, attrs) {
                //Expose the functions to directives, this is pivotal to ensuring the binding is clean in the view
                scope.addSideToCart = scope.product.addSideToCart;
                scope.addQuickPizzaToCart = scope.product.addQuickPizzaToCart;
                scope.customise = scope.product.customise;
                scope.changeFilter = scope.product.changeFilter;
            }
    };
}

    // register the directive
    var app = angular.module('main');
    productListDirective.$inject = ["OPTIMISATION"];
    app.directive('rbProductList', productListDirective);
}());
