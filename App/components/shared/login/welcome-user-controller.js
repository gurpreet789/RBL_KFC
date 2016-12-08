(function () {
    'use strict';

    // welcome user controller
    var app = angular.module('main');
    var controllerId = 'rbWelcomeUser.controller';

    app.controller(controllerId, welcomeUserController);

    welcomeUserController.$inject = ['$scope', 'CommonService', 'MembershipService', '$rootScope', '$state', '$location'];

    // Login controller
    function welcomeUserController($scope, common, membershipService, $rootScope, $state, $location) {
        // sets vm for this controller.
        var vm = this;
        vm.model = {};
        vm.model.isLoggedIn = false;
        vm.model.isLoggedOut = true;

        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', ' welcome initialises');
            if ($rootScope.isLoggedInTriggered == undefined || ($rootScope.isLoggedInTriggered != undefined && !$rootScope.isLoggedInTriggered)) {
                isLoggedIn();
            }

        }

        $scope.$on('updatedUserName', function (event, updatedUserName) {
            vm.model.customername = updatedUserName;
        });

        function isLoggedIn() {
            return membershipService.IsLoggedIn()
                .then(
                function (response) {
                    if (response.status >= 400) {
                        vm.model.isLoggedIn = false;
                        vm.model.customername = '';
                        vm.model.isLoggedOut = false;
                    }
                    vm.model.customername = response.CustomerName;
                    vm.model.isLoggedIn = response.isUserLoggedIn;
                    vm.model.isLoggedOut = response.isUserLoggedIn;
                    $rootScope.isLoggedInTriggered = true;
                }
            ).finally(function () {
                $rootScope.$broadcast(IS_LOGGED_IN_USER, vm.model.customername, vm.model.isLoggedIn, vm.model.isLoggedOut);
            });

        }

        // login function.
        vm.onLogOut = function () {
            membershipService.Logout().then(function () {
                var pagePath = $location.path();
                if (pagePath.indexOf('myaccount')) {
                    common.$window.location.href = '/';
                } else {
                    common.$window.location.reload();
                }
            });
        };

        vm.setCursor = function () {

        }

    }
}());
