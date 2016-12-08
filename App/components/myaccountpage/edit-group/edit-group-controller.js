(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbEditGroup.controller';

    // registers controller.
    app.controller(controllerId, editGroupController);

    // injects dependencies.
    editGroupController.$inject = ['$scope', 'CommonService'];

    // angular controller for deal detail page.
    function editGroupController($scope, common) {
        // sets vm of this controller.
        var vm = this;

        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            var deferred = common.$q.defer();

            common.$log.logInfo(controllerId, 'Activated EditGroup ' + $scope.groupName + ' controller.');
            deferred.resolve('OK');

            common.$timeout(function () {
                // fire this directive initialised
                $scope.$emit($scope.groupName + '-edit-group-initialised', $scope.groupName);
            });

            return deferred.promise;
        };
    }
}());