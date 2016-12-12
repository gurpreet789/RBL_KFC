(function () {
    'use strict';

    var app = angular.module('main');

    // Instantiate the controllerID.
    var controllerID = 'rbBurgerMenu.controller';

    // Register the controller.
    app.controller(controllerID, burgerMenuController);

    // Inject dependencies.
    burgerMenuController.$inject = ['$scope', 'CommonService', '$spMenu', '$state', 'MembershipService', '$rootScope', 'ProductService', 'CartInterfaceService', '$location', '$timeout'];

    function burgerMenuController($scope, common, $spMenu, $state, membershipService, $rootScope, ProductService, CartInterfaceService, $location, $timeout) {

        // View Model.
        var vm = this;
        vm.model = {};
        vm.model.isLoggedIn = false;
        vm.model.isLoggedOut = true;
        vm.model.customername = '';
        vm.model.newProductCount = null;
        vm.model.isDealOpened = false;

        $scope.$on(IS_LOGGED_IN_USER, function (event, customername, isLoggedIn, isLoggedOut) {
            vm.model.customername = customername;
            vm.model.isLoggedIn = isLoggedIn;
            vm.model.isLoggedOut = isLoggedOut;
        })

        $scope.$on(NEW_PRODUCT_COUNT, function (event, productsCount) {
            vm.model.newProductCount = productsCount;
        })

        $scope.selectSection = function (setSection) {
            $spMenu.toggle();
            common.$location.path("/order/" + setSection);
            CartInterfaceService.enableCart();
        }

        $scope.loadSpecialMenu = function () {
            $spMenu.toggle();
        }
        $scope.$on('updatedUserName', function (event, updatedUserName) {
            vm.model.customername = updatedUserName;
        });
        $scope.subMenu = function (type, sectionName) {
            $spMenu.toggle();
            $state.go("order.section.subsection", { sectionName: type, subsection: sectionName });
            CartInterfaceService.enableCart();
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

        $scope.initialize = function () {
            if (vm.model.newProductCount == null) {
                ProductService.GetProductCount('individual-meals').then(function (data) {
                    vm.model.newProductCount = data;
                });
            }
        }

        vm.trackAndRedirect = function (href, eventCategory, eventAction, eventLabel) {
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: eventAction,
                eventLabel: eventLabel
            });

            window.open(href, '_self');
        }

        $scope.DealOpened = function () {
            if (!vm.model.isDealOpened) {
                vm.model.isDealOpened = true;
            } else {
                $timeout(function() {
                    vm.model.isDealOpened = false;
                }, 365);
            }
        }

        $scope.initialize();

        

    }
}());
