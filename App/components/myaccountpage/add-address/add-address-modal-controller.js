(function () {
    'use strict';

    var ADDRESS_ERROR = "Invalid address.";

    var app = angular.module('main');

    //declares controller id.
    var controllerId = 'rbAddAddressModal.controller';

    //registers controller.
    app.controller(controllerId, addAddressModalController);

    //injects dependencies.
    addAddressModalController.$inject = ['$scope', '$http', 'CommonService', '$modalInstance', '$window'];

    // angular controller for deal detail page.
    function addAddressModalController($scope, $http, common, $modalInstance, $window) {
        // sets vm of this controller.
        var vm = this;
        vm.isLoading = false;
        // model init.
        vm.model = {};
        vm.selectedAddress = '';
        vm.IsValidAddress = false;


        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            var deferred = common.$q.defer();

            //common.$log.logDebug(controllerId + ' initialise()', 'AddAddressModal initialises');
            common.$log.logInfo(controllerId, 'Activated AddAddressModal controller.');
            deferred.resolve('OK');
            

            return deferred.promise;
        };

        // reset form.
        function reset() {
            vm.model.isDisplayErrorMessage = false;
            vm.model.errorMessage = '';
            vm.model.address = '';
            vm.model.comment = '';
            vm.selectedAddress = ''
            vm.IsValidAddress = false;
            common.$timeout(function () {
                $scope.form_add_new_address.$setPristine();
                $scope.form_add_new_address.$setUntouched();
                $scope.form_add_new_address.$setValidity('required', true);
                $scope.form_add_new_address.$setValidity('email', true);
                $scope.form_add_new_address.$setValidity('pattern', true);
            });
        }

        // clear form everytime modal is opened.
        reset();

        // cancel and close button event.
        vm.onCancel = function () {
            // close modal dialog.
            $modalInstance.close();
            // reset form.
            //reset();

        };

        // on address change.
        vm.onAddressFind = function addressFind() {
            var params = {
                params: {
                    address: vm.model.address
                }
            };

            vm.model.addressData = common.dataservice.getDataFromAPI('onlineorder/api/address/getAddressTypeAhead', params);
            return vm.model.addressData;
        };

        vm.onAddressSelected = function addressSelected($item, $model, $label) {
            vm.model.selectedAddress = $item;
            vm.model.IsValidAddress = true;

        }

        // submit add new address.
        vm.onSubmit = function () {
            vm.isLoading = true;
            // check if address is valid
            if (vm.model.address !== '' && vm.model.address !== undefined) {

                vm.model.address = $('#NewAccountAddressTitle').val();

                var addressParams = {
                    params: {
                        address: vm.model.address
                    }
                };

                // break down address.
                vm.callGetAPI('onlineorder/api/address/getAddressdetails', addressParams).finally(function () { vm.isLoading = false; });
            }
        };

        // calling Get API.
        vm.callGetAPI = function (api, params) {
            common
                .dataservice
                .getDataFromAPI(api, params)
                .then(function (data) {
                    if (data!=null && data.errorMessage == "Address must be entered.") {
                        vm.model.isDisplayErrorMessage = true;
                        vm.model.errorMessage = "Address must be entered.";
                        vm.isLoading = false;
                        return;
                    }

                    if (data.status >= 400) {
                        $modalInstance.close();
                        common.validateResponse(data);
                        return;
                    }

                    if (data === null) {
                        vm.model.isDisplayErrorMessage = true;
                        vm.model.errorMessage = ADDRESS_ERROR;
                        vm.isLoading = false;
                        return;
                    }

                    // check whether data is exists.
                    if (Object.keys(data).length > 0 || data !== null) {
                        vm.model.addressData = data;
                        // check if address is found.
                        if (vm.model.addressData !== null || vm.model.addressData !== '' || vm.model.addressData !== undefined) {
                            var paramsRegister = {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            };

                            var dataRegister = {
                                unit: vm.model.addressData.unit,
                                streetNumber: vm.model.addressData.streetNumber,
                                buildingLetter: vm.model.addressData.buildingLetter,
                                streetName: vm.model.addressData.streetName,
                                city: vm.model.addressData.city,
                                district: vm.model.addressData.district,
                                postCode: vm.model.addressData.postCode,
                                tradeZoneID: vm.model.addressData.tradeZoneID,
                                customerAddressDescription: vm.model.comment
                            };

                            // post add address
                            vm.callPostAPI('onlineorder/api/customer/addAddress', dataRegister, paramsRegister);
                        }
                        vm.isLoading = false;
                        return;
                    }

                });
        };

        // calling Post API.
        vm.callPostAPI = function (api, data, params) {
            common
                .dataservice
                .postDataToAPI(api, data, params)
                .then(function (data) {
                    // check data status.
                    if (data.status >= 400) {
                        // display error message.
                        vm.model.isDisplayErrorMessage = true;
                        vm.model.errorMessage = data.data;
                        common.validateResponse(data);
                        return;
                    }

                    // reset form.
                    //reset();

                    // close modal dialog.
                    //$modalInstance.close();
                    $window.location.reload();
                });
        };


    }
}());