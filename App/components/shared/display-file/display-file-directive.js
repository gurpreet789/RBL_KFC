(function () {
    'use strict';

    var rbDisplayFileDirective = function () {
        // this directive custom attributes
        var directiveAttributes = {
            fileType: '@',
            filePath: '@',
        };

        return {

            // restrict to element use only 
            restrict: 'E',

            // directive custom attributes
            scope: directiveAttributes,

            // replace the directive element with template
            replace: true,

            // template view to use. 
            template: '<object type="{{fileType}}" data="{{filePath}}"></object>',

            // logic for the directive
            link: function (scope, element, attributes) {
                // previous element attributes keys
                var oldElementAttrKeys = Object.keys(attributes.$attr);

                // move all attributes from old element to new element in template 
                oldElementAttrKeys.forEach(function (attrKey) {
                    // ignore directive custom attributes
                    if (attrKey in directiveAttributes) {
                        return;
                    }

                    element.attr(attrKey, attributes[attrKey]);
                });
            }
        };
    }

    var app = angular.module("main");
    app.directive("rbDisplayFile", [rbDisplayFileDirective]);
}());