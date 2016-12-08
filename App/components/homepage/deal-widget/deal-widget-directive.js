(function () {
    'use strict';

    var rbDealWidgetDirective = function (OPTIMISATION) {
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
                    return 'App/components/homepage/deal-widget/deal-widget.html';
                }
                return 'partials/deal-widget.html';
            },

            // this directive's controller.
            controller: 'rbDealWidget.controller',

            // alias controller.
            controllerAs: 'dealwidget'
        };
    }

    var app = angular.module("main");
    rbDealWidgetDirective.$inject = ["OPTIMISATION"];
    app.directive("rbDealWidget", rbDealWidgetDirective);

}());