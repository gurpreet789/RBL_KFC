(function () {
    'use strict';

    var rbHeroDirective = function(OPTIMISATION) {
        return {

            // restrict to element use only 
            restrict: 'E',

            scope: {
                containerClass: '@',
                showDeal: '@',
            },

            // template view to use. Currently only return string of the template view.
            // 
            // Parameters
            // element:  
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/hero/hero.html';
                }
                return 'partials/hero.html';
            },
        };
    }

    var app = angular.module("main");
    rbHeroDirective.$inject = ["OPTIMISATION"];
    app.directive("rbHero", rbHeroDirective);

}());