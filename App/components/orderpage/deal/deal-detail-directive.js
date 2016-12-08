(function () {
    'use strict';

    var dealDetailDirective = function(OPTIMISATION) {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/deal/deal-detail.html';
                }
                return 'partials/deal-detail.html';
            },
            controller: 'rbDealDetail.controller',
            controllerAs: 'dealDetail',
            link: function (scope, element, attrs) {
                //Expose the functions to directives, this is pivotal to ensuring the binding is clean in the view
                angular.element('div.product-filter-dropdown').css("display","none");
            }
        };
    };

    // register the directive
    var app = angular.module('main');
    dealDetailDirective.$inject = ["OPTIMISATION"];
    app.directive('rbDealDetail', dealDetailDirective);

}());