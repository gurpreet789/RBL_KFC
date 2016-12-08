(function () {
    'use strict';

    var rbDisplayTooltipDirective = function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    // on mouseenter
                    $(element).tooltip('show');
                }, function () {
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    }

    var app = angular.module("main");
    app.directive("rbDisplayTooltip", [rbDisplayTooltipDirective]);
}());