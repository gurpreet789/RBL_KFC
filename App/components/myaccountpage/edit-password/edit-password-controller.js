(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbEditPassword.controller';

    // registers controller.
    app.controller(controllerId, editPasswordController);

    // injects dependencies.
    editPasswordController.$inject = ['$scope', 'CommonService'];

    // angular controller for deal detail page.
    function editPasswordController($scope, common) {
        // sets vm of this controller.
        var vm = this;
        vm.passwordPattern = /^[\S].*[\S]$/;
        vm.isLoading = false;
        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', 'Entering method.');

            var deferred = common.$q.defer();

            // original model has empty strings. undefined makes reseting form failed
            vm.oriModel = {
                'oldPassword': '',
                'newPassword': '',
                'confirmPassword': '',
            };

            vm.model = angular.copy(vm.oriModel);

            // timeout. do these things after the directive has been loaded
            common.$timeout(function () {
                // listen to submit form event
                $scope.$on('edit-password-edit-group-submit-form', function () {
                    vm.submitForm(vm.viewForm.$valid);
                });

                // listen to reset form event
                $scope.$on('edit-password-edit-group-reset-form', function () {
                    vm.resetForm(vm.viewForm);
                });

     
                deferred.resolve('OK');
                common.$log.logInfo(controllerId, 'Activated EditPassword controller.');
           });

            //common.$log.logDebug(controllerId + ' initialise()', 'Exiting method.');
            return deferred.promise;
        };

        vm.checkKeyUp = function()
        {
           $scope.$broadcast('edit-password-edit-group-toggle-save-button', { isDisable: vm.viewForm.$invalid });
        }

        // toggle all fields
        function toggleFields(isDisabled) {
            $('#edit-password #old-password').prop('disabled', isDisabled);
            $('#edit-password #new-password').prop('disabled', isDisabled);
            $('#edit-password #confirm-password').prop('disabled', isDisabled);
        }

        // submit form handler
        vm.submitForm = function (isValid) {
            vm.isLoading = true;
            //common.$log.logDebug(controllerId + ' submitForm()', 'Entering method.');

            if (!isValid) {
                vm.isLoading = false;
                //common.$log.logDebug(controllerId + ' submitForm()', 'Form is invalid.');
                return;
            }

            if (vm.model.newPassword !== vm.model.confirmPassword) {
                vm.isLoading = false;
                $scope.$broadcast('edit-password-edit-group-edit-fail', "Oops! Your passwords don’t match.");
                return;
            }

            var deferred = common.$q.defer();

            // prepare param
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            common.dataservice.postDataToAPI('onlineorder/api/customer/UpdatePassword', vm.model, params)
                .then(function (response) {
                    //common.$log.logDebug(controllerId + ' submitForm()', 'Received response from api controller. [response: %s]', [JSON.stringify(response)]);
                    // check status code
                    if (response.status >= 400) {
                        vm.isLoading = false;
                        // trigger event to go back to edit mode
                        $scope.$broadcast('edit-password-edit-group-edit-fail', response.data);
                        //toggleFields(false);

                        // reject promise object
                        deferred.reject(response.data);
                        common.validateResponse(response);
                        return;
                    }

                    // when success: 
                    // trigger event to stop loading
                    $scope.$broadcast('edit-password-edit-group-edit-success', 'success');
                    // reset form
                    vm.resetForm(vm.viewForm);
                    //// enable fields
                    //toggleFields(false);

                    // resolve promise object
                    deferred.resolve('OK');
                    vm.isLoading = false;
                })
                .catch(function (reason) {
                    vm.isLoading = false;
                    //common.$log.logDebug(controllerId + ' submitForm()', 'Error when sending response to api controller. [reason: %s]', reason);
                    deferred.reject(reason);
                });

            //// disable all fields 
            //toggleFields(true);

            //common.$log.logDebug(controllerId + ' submitForm()', 'Exiting method.');

            return deferred.promise;
        }

        // reset all fields in form 
        vm.resetForm = function (form) {
            // use original model
            vm.model = angular.copy(vm.oriModel);

            // set form to pristine state 
            form.$setPristine();
            form.$setUntouched();
            form.$setValidity('required', true);
            form.$setValidity('maxlength', true);
            form.$setValidity('minlength', true);
        }

        // set form from mark up initialises
        vm.setForm = function (form) {
            vm.viewForm = form;
        }
    }
}());