(function () {
    'use strict';

    // right hand panel directive
    var rightHandPanelDirective = function(OPTIMISATION) {
        return {
            // restrict for element only.
            restrict: 'E',
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/mycart/right-hand-panel.html';
                }
                return 'partials/right-hand-panel.html';
            },
            controller: 'rbRightHandPanel.controller',
            controllerAs: 'sidepanel',
            link: function(scope, element, attrs) {
                //Expose the functions to directives, this is pivotal to ensuring the binding is clean in the view
                scope.isLoading = scope.sidepanel.isLoading;
                scope.toggle = scope.sidepanel.toggle;
            }
        };
    };

    // register directive
    var app = angular.module('main');
    rightHandPanelDirective.$inject = ["OPTIMISATION"];
    app.directive('rbRightHandPanel', rightHandPanelDirective);
}());