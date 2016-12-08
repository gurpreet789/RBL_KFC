(function () {
    'use strict';

    // angular directive for burgurMenu component. 
    var burgurMenuDirective = function (OPTIMISATION, $spMenu, $window) {
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
                    return 'App/components/shared/header/burger-menu.html';
                }
                return 'partials/burger-menu.html';
            },
            //      attributes of the element.
            link: function (scope, element, attrs) {
                angular.element('#burgurmenu-overlay').on("click", function () {
                    $spMenu.toggle();
                });
            },
            // This directive's controller
            controller: 'rbBurgerMenu.controller',

            // The controller alias
            controllerAs: 'burgermenu',
        };
    };

    // register the directive
    var app = angular.module('main');
    burgurMenuDirective.$inject = ["OPTIMISATION", "$spMenu", '$window'];
    app.directive('rbBurgerMenu', burgurMenuDirective);
}());
