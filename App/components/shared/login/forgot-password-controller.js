(function () {
    'use strict';

    // register login controller
    var app = angular.module('main');
    var controllerId = 'rbForgotPassword.controller';


    function forgotPasswordController($scope, common, membershipService, $rootScope) {
        var vm = this;

        vm.emailPattern = /^[^\.].*$/;

        vm.model = {};
        vm.isLoading = false;
        function reset() {
            vm.model = {};

            $scope.form_forgot_password.$setPristine();
            $scope.form_forgot_password.$setUntouched();
        }

        vm.onSubmit = function () {
            vm.isLoading = true;
            if ($scope.form_forgot_password.$valid) {

                membershipService.ForgotPassword(vm.model.email)
                .then(
                    function (data) {

                        if (data.status >= 400) {

                            vm.model.isDisplayErrorMessage = true;
                            if (data.data.message) {
                                vm.model.errorMessage = data.data.message;
                            }
                            else {
                                vm.model.errorMessage = data.data;
                            }
                            vm.isLoading = false;

                            if (vm.model.errorMessage == 'Your session has expired' ||
                            vm.model.errorMessage == 'Your session has expired, reload now' ||
                            vm.model.errorMessage == 'Session has expired' || 
                            vm.model.errorMessage == 'Invalid token') {
                                reset();
                                hideForgotPassword();
                                common.validateResponse(data);
                            }

                            return;
                        }

                        vm.model.sendTo = vm.model.email;

                        //reset();
                        vm.model.isDisplayErrorMessage = false;
                        $scope.form_forgot_password.$setPristine();
                        $scope.form_forgot_password.$setUntouched();
                        vm.isLoading = false;
                        submitForgotPassword();
                       
                    }
                );
            }
            else {
                $scope.form_forgot_password.EmailInput.$setDirty();
                $scope.form_forgot_password.$setTouched();
                $scope.form_forgot_password.$error.required = true;
            }
        };

        vm.onClose = function () {
            reset();
        };

        $(document).on('hide.bs.modal', function () {
            reset();
            $scope.$apply();
        });

        $(document).on('shown.bs.modal', function () {
            $('#forgotpassword').css('height', $(document).height() + 'px');
        });
    }

    app.controller(controllerId, forgotPasswordController);

    forgotPasswordController.$inject = ['$scope', 'CommonService', 'MembershipService', '$rootScope'];

}());
