(function () {
    'use strict';

    // angular directive for footer component. 
    var footerDirective = function (OPTIMISATION) {
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
                    return 'App/components/shared/footer/footer.html';
                }
                return 'partials/footer.html';
            },
            // controller definition
            controller: 'rbFooter.controller',

            // alias controller
            controllerAs: 'footer'
        };
    }

    // register the directive
    var app = angular.module('main');
    footerDirective.$inject = ["OPTIMISATION"];
    app.directive('rbFooter', footerDirective);
}());
