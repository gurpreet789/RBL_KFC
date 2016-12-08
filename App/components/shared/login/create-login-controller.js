(function () {
    'use strict';

    var app = angular.module('main');
    var controllerId = 'rbCreateLogin.controller';

    function createLoginController($scope, common, addressService, membershipService, $rootScope, $window) {
        var vm = this;

        vm.nzPhonePattern = /^(((0{0,2}64[\s\-]?(3|4|6|7|9)|\(?0(3|4|6|7|9)\)?)[\s\-]?\d{3}[\s\-]?\d{4})|((0{0,2}?64[\s\-\(]?2(0|1|2|6|7|8|9){1}[\s\-\)]?|\(?02(0|1|2|6|7|8|9){1}\)?)[\s\-]?\d{3}[\s\-]?\d{3,5}))$/;
        vm.passwordPattern = /^[\S].*[\S]$/;
        vm.emailPattern = /^[^\.].*$/;
        vm.isLoading = false;
        vm.model = {};
        vm.model.customerAddressData = {};

        function reset() {
            vm.model = {};
            $("#form_create_login #CreateLoginPhone").val('');
            $("#form_create_login #CreatePassword1").val('');
            $("#form_create_login #CreatePassword2").val('');

            $scope.form_create_login.$setPristine();
            $scope.form_create_login.$setUntouched();
        }

        vm.createLogin = function () {
            vm.isLoading = true;
            membershipService.RegisterUser(vm)
                .then(function (data) {
                    if (data.status >= 400) {
                        vm.isLoading = false;
                        vm.model.isDisplayErrorMessage = true;
                        if (data.data.message) {
                            vm.model.errorMessage = data.data.message;
                        }
                        else {
                            vm.model.errorMessage = data.data;
                        }

                        if (vm.model.errorMessage == 'Your session has expired' ||
                            vm.model.errorMessage == 'Your session has expired, reload now'||
                            vm.model.errorMessage == 'Session has expired'||
                            vm.model.errorMessage == 'Invalid token') {
                            reset();
                            hideCreateLogin();
                            common.validateResponse(data);
                        }

                        return;
                    }
                    $window.location.reload();
                    //reset();
                    //vm.isLoading = false;
                    //ShowLoginModal();

                });
        };

        vm.register = function register() {
            if ($scope.form_create_login.$valid) {
                vm.createLogin();
            }
        }

        vm.onAddressFind = function addressFind() {
            vm.model.customerAddress = '';
            vm.model.customerAddressData = addressService.GetAddressTypeAhead(vm.model.customerAddressWorking);
            return vm.model.customerAddressData;
        };

        vm.onAddressSelected = function addressSelected($item, $model, $label) {
            vm.model.customerAddress = $item;
            addressService.GetAddressDetails($item)
                .then(function (data) {
                    vm.model.customerAddressData = data;
                });
        }

        vm.onSubmit = function submit() {
            vm.register();
        };

        vm.onClose = function () {
            reset();
        };

        $(document).on('hide.bs.modal', function () {
            reset();
            $scope.$apply();
        });

    }

    app.controller(controllerId, createLoginController);

    createLoginController.$inject = ['$scope', 'CommonService', 'AddressService', 'MembershipService', '$rootScope', '$window'];
}());
