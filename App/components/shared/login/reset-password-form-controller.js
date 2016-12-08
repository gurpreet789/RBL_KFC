(function () {
    'use strict';

    var app = angular.module('main');

    function resetPasswordFormController($scope, $http, common, $modal, $rootScope, $stateParams, membershipService) {
        var vm = this;
        var parentVM = $scope.resetPasssword;
        vm.common = common;
        vm.$modal = $modal;
        vm.showModal = false;

        vm.initialise = function () {
            vm.showModal = true;
        }

        vm.initialise();

        vm.onClose = function () {
            $scope.form_changePassword.$setPristine();
            $scope.form_changePassword.$setUntouched();
            parentVM.resetPasswordModal.close();
            common.$location.url('/');
        }

        vm.onSubmit = function () {
            if (vm.model.password != vm.model.repeatPassword) {
                vm.model.isDisplayErrorMessage = true;
                vm.model.errorMessage = "Password and repeat password must be match";
            }

            var request = {
                Password: vm.model.password,
                ConfirmPassword: vm.model.repeatPassword,
                RequestId: parentVM.token,
                MicrosSession: parentVM.session,
            }

            membershipService.ResetPassword(request).then(function (response) {
                if (response.status >= 400) {
                    common.validateResponse(response);
                    vm.onClose();
                } else {
                    vm.onClose();
                    common.displayNotification('Reset Password', 'Your password has been changed', false);
                }
            });
        }

    }

    var controllerId = 'rbResetPasswordForm.controller';
    app.controller(controllerId, resetPasswordFormController);

    resetPasswordFormController.$inject = ['$scope', '$http', 'CommonService', '$modal', '$rootScope', '$stateParams', 'MembershipService'];

}());