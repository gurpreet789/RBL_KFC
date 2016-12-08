(function () {
    'use strict';


    var app = angular.module('main');
    var controllerId = 'rbLogin.controller';

    function loginController($scope, common, membershipService, $rootScope, $window) {

        var vm = this;

        vm.model = {};

        function initialise() {
            var deferred = common.$q.defer();

            deferred.resolve('OK');

            vm.model = {};
            vm.model.modalReference = null;
            vm.model.isLogin = false;
            vm.model.customerName = null;
            vm.isLoading = false;
            vm.loginIsExecuted = false;

            vm.model.errorMessage = '';
            vm.model.customerName = '';
            vm.model.isDisplayErrorMessage = false;
            vm.model.isLogin = false;
            vm.model.username = '';
            vm.model.password = '';
            vm.model.rememberMe = false;

            deferred.resolve(vm.model.isLogin);
            deferred.resolve(vm.model.customerName);
            

            return deferred.promise;
        }

        function reset() {
            vm.model = {};

            $scope.form_login.$setPristine();
            $scope.form_login.$setUntouched();

            vm.resetLoginButton();
        }

        vm.resetLoginButton = function () {
            document.getElementsByClassName("btn-login")[0].removeAttribute('data-hit');
        }

        vm.onLogin = function () {
            if (document.getElementsByClassName("btn-login")[0].getAttribute('data-hit') == undefined) {
                document.getElementsByClassName("btn-login")[0].setAttribute('data-hit', 'true');
                vm.isLoading = true;
                if ($scope.form_login.$valid) {
                    if (vm.model.rememberMe === undefined) { vm.model.rememberMe = false; }
                    membershipService.Login(vm.model.username, vm.model.password, vm.model.rememberMe)
                    .then(function (response) {
                        if (response) {
                            if (response.status >= 400) {
                                vm.model.isDisplayErrorMessage = true;
                                if (response.data.message) {
                                    vm.model.errorMessage = response.data.message;
                                }
                                else {
                                    vm.model.errorMessage = response.data;
                                }
                                vm.isLoading = false;

                                if (vm.model.errorMessage == 'Your session has expired' ||
                                    vm.model.errorMessage == 'Your session has expired, reload now' ||
                                    vm.model.errorMessage == 'Session has expired' ||
                                    vm.model.errorMessage == 'Invalid token') {
                                    reset();
                                    hideLoginModal();
                                    common.validateResponse(response);
                                }
                            } else {
                                $window.location.reload();
                            }
                        }
                    });
                }
                else {
                    $scope.form_login.loginEmail.$setDirty();
                    $scope.form_login.loginPassword.$setDirty();

                    $scope.form_login.loginEmail.$setTouched();
                    $scope.form_login.loginPassword.$setTouched();

                    $scope.form_login.$setTouched();
                    $scope.form_login.$error.required = true;
                }
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
            initialise();
            $('#login-dialog').css('height', $(document).height() + 'px');
        });
    }

    loginController.$inject = ['$scope', 'CommonService', 'MembershipService', '$rootScope', '$window'];
    app.controller(controllerId, loginController);
}());
