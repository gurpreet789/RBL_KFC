(function () {
    'use strict';

    var matchField = function ($parse, common) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function link($scope, elem, attrs, ctrl) {

                var match = $parse(attrs.matchWith);

                var validator = function (value) {
                    var validity = value === match($scope);
                    ctrl.$setValidity('match', validity);
                    return value;
                }

                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.push(validator);

                $scope.$watch('matchWith', function (newval, oldval) {
                    validator(ctrl.$viewValue);
                });

            }
        };
    }

    var app = angular.module('main');
    matchField.$inject = ["$parse", "CommonService"];
    app.directive('matchWith', matchField);
}());
