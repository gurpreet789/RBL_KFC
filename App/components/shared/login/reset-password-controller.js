(function () {
    'use strict';

    var app = angular.module('main');

    function resetPasswordController($scope, $http, common, $modal, $rootScope, $stateParams, OPTIMISATION) {
        var vm = this;

        vm.common = common;
        vm.resetPasswordModal = {};
        vm.token = $stateParams.GUID;
        vm.session = $stateParams.sessionid;

        vm.initialise = function () {
            vm.showResetPasswordModal();
        }

        vm.showResetPasswordModal = function () {
            vm.resetPasswordModal = $modal.open({
                templateUrl: function (element, attr) {
                    if (!OPTIMISATION) {
                        return 'App/components/shared/login/reset-password.html';
                    }
                    return 'partials/reset-password.html';
                },
                controller: 'rbResetPasswordForm.controller',
                controllerAs: "resetPasswordForm",
                backdrop: 'static',
                scope: $scope
            });
        }

        vm.initialise();

       

    }

    var controllerId = 'rbResetPassword.controller';
    app.controller(controllerId, resetPasswordController);

    resetPasswordController.$inject = ['$scope', '$http', 'CommonService', '$modal', '$rootScope', '$stateParams', 'OPTIMISATION'];

}());