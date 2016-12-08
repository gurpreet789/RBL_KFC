(function () {
    'use strict';

    function iValidateAntiForgeryToken($http) {
        return {
            restrict: 'A',
    
            link: function (scope, element, attrs) {
                $http.defaults.headers.common['rbt'] = attrs.rbt;

            }
        };
    };

    // register the directive
    var app = angular.module('main');
    iValidateAntiForgeryToken.$inject = ["$http"];
    app.directive('rbt', iValidateAntiForgeryToken);

})();