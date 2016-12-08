(function () {
    'use strict';

    // Directive function. 
    var directive = function (OPTIMISATION) {
        return {
            // Restrict to element use only.
            restrict: 'E',

            // Allow transclusion.
            transclude: true,

            // leftCaption is content for left tab heading.
            // rightCaption is content for right tab heading.
            // leftContentApi is api for populate left tab content.
            // rightContentApi is api for right tab content.
            scope: {
                leftCaption: '@',
                rightCaption: '@',
                leftUrl:'@',
                rightUrl: '@',
                sectionName:'@'
            },

            // template view to use.
            // 
            // Parameters
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/orderpage/order-sub-menu/order-sub-menu.html';
                }
                return 'partials/order-sub-menu.html';
            },

            // This directive's controller
            controller: 'rbOrderSubMenu.controller',

            // The controller alias
            controllerAs: 'orderSubMenu'
        };
    }

    // Register the directive.
    var app = angular.module('main');
    directive.$inject = ["OPTIMISATION"];
    app.directive('rbOrderSubMenu', directive);
}());