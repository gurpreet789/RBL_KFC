(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbContactDetails.controller';

    // registers controller.
    app.controller(controllerId, contactDetailsController);

    // injects dependencies.
    contactDetailsController.$inject = ['$scope', 'CommonService', '$rootScope'];

    // angular controller for contact detail .
    function contactDetailsController($scope, common, $rootScope) {
        // sets vm of this controller.
        var vm = this;
        vm.isLoading = false;
        vm.nzPhonePattern = /^(((0{0,2}64[\s\-]?(3|4|6|7|9)|\(?0(3|4|6|7|9)\)?)[\s\-]?\d{3}[\s\-]?\d{4})|((0{0,2}?64[\s\-\(]?2(0|1|2|6|7|8|9){1}[\s\-\)]?|\(?02(0|1|2|6|7|8|9){1}\)?)[\s\-]?\d{3}[\s\-]?\d{3,5}))$/;
        vm.emailPattern = /^[^\.].*$/;

        // initialises the controller.
        initialise();
        

        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', 'Entering method.');

            // get current logged in customer
            var getCustomerPromise = getLoggedInCustomer()
                .then(function (data) {
                    common.$log.logInfo(controllerId, 'Activated MyAccount page controller.');

                    // assign data to view model upon successful
                    vm.model = data;

                    // keep original data for reset. Clone it
                    vm.oriModel = angular.copy(data);
                })
                .catch(function (reason) {
                    // display error
                    common.displayError(reason);

                    // redirect to home
                    common.$location.url('/');
                });

            // timeout. do these things after the directive has been loaded
            var timeoutPromise = common.$timeout(function () {
                //common.$log.logDebug(controllerId + ' initialise()', 'Entering timeout method.');

                // listen to submit form event
                $scope.$on('edit-details-edit-group-submit-form', function () {
                    vm.submitForm(vm.viewForm.$valid);
                });

                // listen to reset form event
                $scope.$on('edit-details-edit-group-reset-form', function () {
                    vm.resetForm(vm.viewForm);
                });

                // sent out event whenever text/password is changed
                $('#edit-details :text, #edit-details :password').on('change keyup paste', function () {
                    $scope.$broadcast('edit-details-edit-group-toggle-save-button', { isDisable: vm.viewForm.$invalid });
                });

                //common.$log.logDebug(controllerId + ' initialise()', 'Exitting timeout method.');
            });

            //common.$log.logDebug(controllerId + ' initialise()', 'Exiting method.');

            

            return common.initiateController([getCustomerPromise, timeoutPromise], controllerId);
        };

        vm.checkKeyUp = function () {
            $scope.$broadcast('edit-details-edit-group-toggle-save-button', { isDisable: vm.viewForm.$invalid });
        }
        // get the logged in customer details from Api controller
        function getLoggedInCustomer() {
            ////common.$log.logDebug(controllerId + ' getLoggedInCustomer()', 'Getting current logged in customer details')

            var deferred = common.$q.defer();

            common.dataservice.getDataFromAPI('onlineorder/api/customer/LoggedInCustomer')
                .then(function (response) {
                    //common.$log.logDebug(controllerId + ' getLoggedInCustomer()', 'Received response from data service. [response: %s]', [JSON.stringify(response)])

                    if (response.status >= 400) {
                        // response.data is the error message
                        deferred.reject(response.data);
                    }

                    // pass the response upon resolve
                    deferred.resolve(response);

                    // fire successfull event
                    $scope.$emit('get-contact-detail-success', response);
                });


            //common.$log.logDebug(controllerId + ' getLoggedInCustomer()', 'Exitting getting customer details from api')

            return deferred.promise;
        }

        // toggle all fields
        function toggleFields(isDisabled) {
            $('#edit-details #edit-details-firstname').prop('disabled', isDisabled);
            $('#edit-details #edit-details-lastname').prop('disabled', isDisabled);
            $('#edit-details #edit-details-phone').prop('disabled', isDisabled);
        }

        // submit form handler
        vm.submitForm = function (isValid) {
            vm.isLoading = true;
            //common.$log.logDebug(controllerId + ' submitForm()', 'Entering method.');

            if (!isValid) {
                //common.$log.logDebug(controllerId + ' submitForm()', 'Form is invalid.');
                // trigger event to go back to edit mode
                $scope.$broadcast('edit-details-edit-group-edit-fail');
                vm.isLoading = false;
                return;
            }

            var deferred = common.$q.defer();

            // prepare param
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            var modelToPost = {
                customerModel: vm.model,
                repeatEmail: vm.model.repeatEmail
            };

            common.dataservice.postDataToAPI('onlineorder/api/customer/CustomerDetails', modelToPost, params)
                .then(function (response) {
                    //common.$log.logDebug(controllerId + ' submitForm()', 'Received response from api controller. [response: %s]', [JSON.stringify(response)]);
                    // check status code
                    if (response.status >= 400) {
                        // trigger event to go back to edit mode
                        $scope.$broadcast('edit-details-edit-group-edit-fail', response.data);
                        //toggleFields(false);

                        // reject promise object
                        deferred.reject(response.data);
                        vm.isLoading = false;
                        common.validateResponse(response);
                        return;
                    }

                    // when success: 
                    // trigger event to stop loading
                    $scope.$broadcast('edit-details-edit-group-edit-success', 'success');
                    // refresh original customer values
                    vm.oriModel = angular.copy(vm.model);
                    $rootScope.$broadcast('updatedUserName', vm.oriModel.firstName);
                    // set form as pristine and clear validation
                    vm.viewForm.$setPristine();
                    vm.viewForm.$setUntouched();
                    vm.viewForm.$setValidity('required', true);
                    vm.viewForm.$setValidity('maxlength', true);
                    vm.viewForm.$setValidity('pattern', true);
                    //// enable fields
                    //toggleFields(false);

                    // resolve promise object
                    deferred.resolve('Save Contact Details OK');
                    vm.isLoading = false;
                })
                .catch(function (reason) {
                    //common.$log.logDebug(controllerId + ' submitForm()', 'Error when sending response to api controller. [reason: %s]', reason);
                    deferred.reject(reason);
                    vm.isLoading = false;
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

            // set form to pristine state and clear validation
            form.$setPristine();
            form.$setUntouched();
            form.$setValidity('required', true);
            form.$setValidity('maxlength', true);
            form.$setValidity('pattern', true);
        }

        // set form from mark up initialises
        vm.setForm = function (form) {
            vm.viewForm = form;
        }
    }
}());