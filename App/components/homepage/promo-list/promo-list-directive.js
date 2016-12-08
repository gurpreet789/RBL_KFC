(function () {
    'use strict';

    var rbPromoListDirective = function (OPTIMISATION) {
        return {

            // restrict to element use only 
            restrict: 'E',

            // template view to use. Currently only return string of the template view.
            // 
            // Parameters
            // element:  
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/homepage/promo-list/promo-list.html';
                }
                return 'partials/promo-list.html';
            },
            link:function(){
                angular.element('.footer-backtotop').hide();
            },

            // this directive's controller.
            controller: 'rbPromoList.controller',

            // alias controller.
            controllerAs: 'promolist'
        };
    }

    var app = angular.module("main");
    rbPromoListDirective.$inject = ["OPTIMISATION"];
    app.directive("rbPromoList", rbPromoListDirective);

}());