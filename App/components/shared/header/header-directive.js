(function () {
    'use strict';

    // angular directive for header component. 
    var headerDirective = function (OPTIMISATION, $spMenu) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // template view to use. Currently only return string of the static html view.
            // 
            // Parameters
            // element:  
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/shared/header/header.html';
                }
                return 'partials/header.html';
            },
            // controller definition
            controller: 'rbHeader.controller',

            // alias controller
            controllerAs: 'header'
        };
    }

    // register the directive
    var app = angular.module('main');
    headerDirective.$inject = ["OPTIMISATION", "$spMenu"];
    app.directive('rbHeader', headerDirective);
}());
