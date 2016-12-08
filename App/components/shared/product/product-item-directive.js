(function () {
    'use strict';

    // angular directive for product item component. 
    var productItemDirective = function(OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // allow element content to pass to the directive
            transclude: true,

            // isolated scope of the directive. 
            scope: {
                // 'id' markup attribute
                productId: '@id',
                iSDeal: '=isDeal',
                // 'b-item' binding attribute
                productItem: '=bItem'
            },

            // template view to use. Currently only return string of the static html view.
            // 
            // Parameters
            // element:  
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function(element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/product/product-item.html';
                }
                return 'partials/product-item.html';
            },

            // This directive's controller
            controller: 'rbProductItem.controller',

            // The controller alias
            controllerAs: 'productItemController',

            // Directive view logic
            link: function(scope, element, attrs) {

                var flips = function(event) {
                    $(this).closest(".card").find(".back").toggle();
                    $(this).closest(".card").find(".front").toggle();
                    $(this).closest(".card").toggleClass("flipped");
                    event.stopPropagation();
                };

                if (scope.iSDeal === undefined) {
                    scope.canShowPrice = true;
                } else {
                    scope.canShowPrice = !scope.iSDeal;
                }

                // Flips by clicking the "Tell me more".
                element.find('.face.back .title').on('click', flips);

                element.find('.description').on('click', flips);

                // Flips by clicking the product image.
                element.find('img.product').on('click', flips);
            },
        };
    };

    // register the directive
    var app = angular.module('main');
    productItemDirective.$inject = ["OPTIMISATION"];
    app.directive('rbProductItem', productItemDirective);
}());
