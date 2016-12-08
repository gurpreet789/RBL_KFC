(function () {
    'use strict';

    // angular directive for PromoItem component. 
    var promoItemDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // allow element content to pass to the directive element
            transclude: true,

            // isolated scope of the directive. 
            scope: {
                // promo article style
                style: '@promoStyle',

                // promo object data (for image)
                data: '@promoData',

                // promo object data (for image link)
                link: '@promoLink',
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
                    return 'App/components/shared/promo/promo-item.html';
                }
                return 'partials/promo-item.html';
            },
        };
    }

    // register the directive
    var app = angular.module('main');
    promoItemDirective.$inject = ["OPTIMISATION"];
    app.directive('rbPromoItem', promoItemDirective);
}());
