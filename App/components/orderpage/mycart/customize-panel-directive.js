(function () {
    'use strict';

    // customize panel directive
    var customizePanelDirective = function(OPTIMISATION) {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/mycart/customize-panel.html';
                }
                return 'partials/customize-panel.html';
            },
            controller: 'rbCustomizePanel.controller',
            controllerAs: 'customizePanel',
            link: function (scope, element, attrs) {
                //Expose the functions to directives, this is pivotal to ensuring the binding is clean in the view
                scope.canselectExtraTopping = scope.customizePanel.canselectExtraTopping;
            }
        };
    };

    // register directive
    var app = angular.module('main');
    customizePanelDirective.$inject = ["OPTIMISATION"];
    app.directive('rbCustomizePanel', customizePanelDirective);
}());