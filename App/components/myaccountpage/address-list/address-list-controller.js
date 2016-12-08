(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbAddressList.controller';

    // registers controller.
    app.controller(controllerId, addressListController);

    // injects dependencies.
    addressListController.$inject = ['$scope', 'CommonService'];

    // angular controller for address list component.
    function addressListController($scope, common) {
        // sets vm of this controller.
        var vm = this;
        vm.model = {};
        vm.isLoading = false;
        // initialises the controller.
        initialise();
        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', 'Entering method.');
         
            var deferred = common.$q.defer();

            // register get contact detail successful event
            $scope.$on('get-contact-detail-success', function (event, args) {
                //common.$log.logDebug(controllerId + ' initialise()', 'Entering get contact detail success method.');

                vm.model.addressObjList = [];
                // get the customer address list
                args.customerAddressList.forEach(function (address) {
                    address.selectedAddress = address.fullAddress;

                    if (address.customerAddressDescription === " ") {
                        address.customerAddressDescription = "";
                    }

                    vm.model.addressObjList.push({
                        model: address,
                    });
                });

                // backup original model
                vm.oriModel = angular.copy(vm.model);

                // each of address has its form. do to each of it
                vm.model.addressObjList.forEach(function (address) {
                    // listen to submit form event
                    $scope.$on('edit-address-' + address.model.addressId + '-edit-group-submit-form', function (event, data) {
                        var addressList = event.currentScope.addressList.model.addressObjList;
                        var addressId = $('#' + event.targetScope.groupName + ' form input[name="addressId"]').val();
                        var form = getFormFromAddressModel(addressList, addressId);

                        vm.submitForm(form.$valid, addressId);
                    });

                    // listen to reset form event
                    $scope.$on('edit-address-' + address.model.addressId + '-edit-group-reset-form', function (event, data) {
                        var addressList = event.currentScope.addressList.model.addressObjList;
                        var addressId = $('#' + event.targetScope.groupName + ' form input[name="addressId"]').val();
                        var form = getFormFromAddressModel(addressList, addressId);
                        vm.resetForm(form, addressId);
                    });

                    // listen to edit group directive initialised method
                    $scope.$on('edit-address-' + address.model.addressId + '-edit-group-initialised', function (event, data) {
                        //common.$log.logDebug(controllerId + ' initialise()', 'Entering edit group directive initialised method.');
                        // sent out event whenever text/password is changed
                        $('#' + data + ' :text').on('change keyup paste', function (event) {
                            var addressId = $(event.target).parents('form').find('input[name="addressId"]').val();
                            var formValid = $(event.target).parents('form').find('input[name="formValid"]').val();
                            $scope.$broadcast('edit-address-' + addressId + '-edit-group-toggle-save-button', { isDisable: formValid == "true" });
                        });
                    });


                });

                // success, resolve model
                deferred.resolve(vm.model);
                
                common.$log.logInfo(controllerId, 'Activated AddressList controller.');
            });

            //common.$log.logDebug(controllerId + ' initialise()', 'Exiting method.');

            return deferred.promise;
        };

        // get form from addressList model
        function getFormFromAddressModel(addressList, addressId) {
            var address = getAddressById(addressList, addressId);
            return address.editAddressForm;
        }

        // get address model by addressId
        function getAddressById(addressList, addressId) {
            var result = undefined;

            for (var i = 0; i < addressList.length; i++) {
                if (addressList[i].model.addressId.toString() !== addressId.toString()) {
                    continue;
                }

                result = addressList[i];
                break;
            }

            return result;
        }

        // toggle all fields
        //function toggleFields(isDisabled, addressId) {
        //    $('#edit-address-' + addressId + ' input[name="fullAddress"]').prop('disabled', isDisabled);
        //    $('#edit-address-' + addressId + ' textarea[name="comment"]').prop('disabled', isDisabled);
        //}

        // submit form handler
        vm.submitForm = function (isValid, addressId) {
            vm.isLoading = true;
            //common.$log.logDebug(controllerId + ' submitForm()', 'Entering method.');

            if (!isValid) {
                //common.$log.logDebug(controllerId + ' submitForm()', 'Form is invalid.');
                vm.isLoading = false;
                return;
            }

            var deferred = common.$q.defer();


            var address = getAddressById(vm.model.addressObjList, addressId);

            // prepare param
            var params = {
                params: {
                    address: address.model.fullAddress,
                }
            };

            common.dataservice.getDataFromAPI('onlineorder/api/address/getAddressdetails', params)
                .then(function (getAddressResponse) {
                    //common.$log.logDebug(controllerId + ' submitForm()', 'Received response from get address api controller. [response: %s]', [JSON.stringify(getAddressResponse)]);

                    if (getAddressResponse.status >= 400) {
                        common.validateResponse(getAddressResponse);
                    }
                    else {
                        // check status code
                        if (getAddressResponse === null) {
                            // trigger event to go back to edit mode
                            $scope.$broadcast('edit-address-' + addressId + '-edit-group-edit-fail', "Invalid Address.");
                            //toggleFields(false, addressId);

                            // reject promise object
                            vm.isLoading = false;
                            deferred.reject(getAddressResponse.data);
                            return;
                        }

                        // prepare address to be saved
                        var addressObj = getAddressResponse;
                        addressObj.addressId = address.model.addressId;
                        addressObj.customerAddressDescription = address.model.customerAddressDescription;

                        // prepare param
                        var updateParams = {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };

                        // send update request
                        common.dataservice.postDataToAPI('onlineorder/api/customer/CustomerAddress', addressObj, updateParams)
                            .then(function (updateAddressResponse) {
                                //common.$log.logDebug(controllerId + ' submitForm()', 'Received update address response from api controller. [response: %s]', [JSON.stringify(updateAddressResponse)]);
                                // check status code
                                if (updateAddressResponse.status >= 400) {
                                    // trigger event to go back to edit mode
                                    $scope.$broadcast('edit-address-' + addressId + '-edit-group-edit-fail', updateAddressResponse.data);
                                    //toggleFields(false, addressId);

                                    // reject promise object
                                    vm.isLoading = false;
                                    deferred.reject(updateAddressResponse.data);
                                    return;
                                }

                                // when success: 
                                // trigger event to stop loading
                                $scope.$broadcast('edit-address-' + addressId + '-edit-group-edit-success', 'success');

                                // refresh original customer values
                                for (var i = 0; i < vm.model.addressObjList.length; i++) {
                                    if (vm.oriModel.addressObjList[i].model.addressId.toString() !== addressId) {
                                        continue;
                                    }

                                    vm.oriModel.addressObjList[i].model = angular.copy(vm.model.addressObjList[i].model);
                                    break;
                                }

                                // set form to pristine state 
                                var form = getFormFromAddressModel(vm.model.addressObjList, addressId);
                                form.$setPristine();
                                form.$setUntouched();
                                form.$setValidity('required', true);
                                form.$setValidity('maxlength', true);
                                form.$setValidity('pattern', true);

                                // enable fields
                                //toggleFields(false, addressId);

                                // resolve promise object
                                deferred.resolve('Save Address OK');
                                vm.isLoading = false;
                            })
                            .catch(function (reason) {
                                //common.$log.logDebug(controllerId + ' submitForm()', 'Error when sending response to api controller. [reason: %s]', reason);
                                deferred.reject(reason);
                                vm.isLoading = false;
                            });
                    }
                });

            // disable all fields
            //toggleFields(true, addressId);

            //common.$log.logDebug(controllerId + ' submitForm()', 'Exiting method.');

            return deferred.promise;
        }

        // reset all fields in form 
        vm.resetForm = function (form, addressId) {

            // use original model for the specific address
            for (var i = 0; i < vm.model.addressObjList.length; i++) {
                if (vm.model.addressObjList[i].model.addressId.toString() !== addressId) {
                    continue;
                }

                vm.model.addressObjList[i].model = angular.copy(vm.oriModel.addressObjList[i].model);
                break;
            }

            // set form to pristine state and clear validation
            form.$setPristine();
            form.$setUntouched();
            form.$setValidity('required', true);
            form.$setValidity('maxlength', true);
            form.$setValidity('pattern', true);
        }

        // on changing address field
        vm.onAddressFind = function (address) {
            var params = {
                params: {
                    address: address.model.fullAddress
                }
            };

            return common.dataservice.getDataFromAPI('onlineorder/api/address/getAddressTypeAhead', params).then(function (response) {
                if (response.status >= 400) {
                    common.validateResponse(response);
                    return '';
                }

                vm.model.fullAddress = response;
                return vm.model.fullAddress;
            });
        };
        vm.onAddressSelected = function addressSelected($item, $model, $label, index) {
            vm.model.addressObjList[index].model.selectedAddress = $item;
            $scope.$broadcast('edit-address-' + vm.model.addressObjList[index].model.addressId + '-edit-group-toggle-save-button', { isDisable: false });
        }

      
    }
}());