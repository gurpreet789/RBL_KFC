//Copyright (C) 2014 Zach Snow (http://zachsnow.com)

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function () {
    var module = angular.module('multi-transclude', []);

    var Ctrl = ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
        // Ensure we're transcluding or nothing will work.
        if (!$transclude) {
            throw new Error(
              'Illegal use of ngMultiTransclude controller. No directive ' +
              'that requires a transclusion found.'
            );
        }

        var toTransclude;

        $scope.$on('$destroy', function () {
            if (toTransclude) {
                toTransclude.remove();
                toTransclude = null;
            }
        });

        // Transclude content that matches name into element.
        this.transclude = function (name, element) {
            for (var i = 0; i < toTransclude.length; ++i) {
                // Uses the argument as the `name` attribute directly, but we could
                // evaluate it or interpolate it or whatever.
                var el = angular.element(toTransclude[i]);
                if (el.attr('name') === name) {
                    element.empty();
                    element.append(el);
                    return;
                }
            }
        };

        // There's not a good way to ask Angular to give you the closest
        // controller from a list of controllers, we get all multi-transclude
        // controllers and select the one that is the child of the other.
        this.$element = $element;
        this.isChildOf = function (otherCtrl) {
            return otherCtrl.$element[0].contains(this.$element[0]);
        };

        // get content to transclude
        $transclude(function (clone) {
            toTransclude = clone;
        });
    }];

    module.directive('ngMultiTemplate', function () {
        return {
            transclude: true,
            templateUrl: function (element, attrs) {
                return attrs.ngMultiTemplate;
            },
            controller: Ctrl
        };
    });

    module.directive('ngMultiTranscludeController', function () {
        return {
            controller: Ctrl
        };
    });

    module.directive('ngMultiTransclude', function () {
        return {
            require: ['?^ngMultiTranscludeController', '?^ngMultiTemplate'],
            link: function (scope, element, attrs, ctrls) {
                // Find the deepest controller (closes to this element).
                var ctrl1 = ctrls[0];
                var ctrl2 = ctrls[1];
                var ctrl;
                if (ctrl1 && ctrl2) {
                    ctrl = ctrl1.isChildOf(ctrl2) ? ctrl1 : ctrl2;
                }
                else {
                    ctrl = ctrl1 || ctrl2;
                }

                // A multi-transclude parent directive must be present.
                if (!ctrl) {
                    throw new Error('Illegal use of ngMultiTransclude. No wrapping controller.')
                }

                // Receive transcluded content.
                ctrl.transclude(attrs.ngMultiTransclude, element);
            }
        };
    });
})();
