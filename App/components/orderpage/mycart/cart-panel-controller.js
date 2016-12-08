(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbCartPanel.controller';

    // registers controller.
    app.controller(controllerId, cartPanelController);

    // injects dependencies.
    cartPanelController.$inject = ['$scope', 'CommonService', 'CartInterfaceService', 'voucherService', '$rootScope', '$window', '$timeout'];

    // angular controller for cart panel component.
    function cartPanelController($scope, common, cartInterfaceService, voucherService, $rootScope, $timeout) {
        // sets vm scopes.
        var vm = this;

        vm.canCheckout = false;
        voucherVaribles();

        function voucherVaribles() {
            vm.voucherCode = '';
            vm.voucherMessage = '';
            vm.isVoucherApplied = false;
            vm.voucherDiscountAmount = '0';
        }

        function reloadCart() {
            vm.callAPI('onlineorder/api/cart/basket')
        }

        $scope.$on(VOUCHER, function (event) {
            voucherVaribles();
        });

        $scope.$on(RELOAD_MYCART, function (event) {
            if ($rootScope.reloadIsTriggered == undefined || !$rootScope.reloadIsTriggered) {
                $rootScope.reloadIsTriggered = true;
                reloadCart();
            }
        })

        vm.callAPI = function (api, params) {

            cartInterfaceService.carLoading(true);

            common
                .dataservice
                .getDataFromAPI(api, params)
                .then(function (data) {
                    $rootScope.reloadIsTriggered = false;
                    if (data.exceptionMessage || data.status >= 400) {
                        common.validateResponse(data);
                        return;
                    }

                    vm.data = data;

                }).finally(function () {
                    if (vm.data.voucherCode != null) {
                        vm.isVoucherApplied = true;
                        vm.voucherDiscountAmount = vm.data.voucherDiscountAmount;
                        vm.voucherMessage = vm.data.voucherDescription;

                    } else if (vm.data.voucherCode == null) {
                        vm.isVoucherApplied = false;
                        vm.voucherMessage = '';
                    }
                    cartInterfaceService.carLoading(false);
                    if (vm.data != null) {
                        vm.canCheckout = vm.data.basketItems.length > 0;
                        $rootScope.$broadcast(CART_ITEMS_COUNT, vm.data.basketItems.length);
                    }
                    vm.addbottomTotal(vm.data.basketTotal);
                    $rootScope.reloadIsTriggered = false;
                    
                });

        };


        vm.editProduct = function (pizza, isDeal) {
            var param = { id: pizza.productId, name: pizza.description, basketItemId: pizza.basketItemId, quantity: pizza.quantity, isDeal: isDeal };
            $.when(window.scrollTo(0, 0)).done(cartInterfaceService.reloadCustomise(param));
        };


        vm.addbottomTotal = function (total) {
            $('.bottom-total').remove();
            var bottomCheckout = $("rb-cart-checkout div.total").clone();
            bottomCheckout.html("<p><span>Total $" + total + "</span></p>").addClass("bottom-total");
            $('div.cart table.table').after(bottomCheckout);
        }

        vm.removeProduct = function (basketItemId, description) {

            common.showConfirmation("Delete", "", function () {
                var params = {
                    params: {
                        basketItemId: basketItemId
                    }
                };

                vm.callAPI('onlineorder/api/cart/RemoveBasketItem', params);
            });

        };

        vm.addvoucher = function () {
            if (vm.voucherCode != '') {
                voucherService.applyVoucher(vm.voucherCode).then(function (response) {
                    if (response.status >= 400) {
                        common.validateResponse(response);
                        return;
                    } else {
                        if (response.voucherActive == true) {
                            vm.isVoucherApplied = true;
                            reloadCart();
                            vm.voucherMessage = response.description;
                        } else {
                            if (response.displayErrorMessage == null)
                            { vm.voucherMessage = response.description; return; }
                            vm.voucherMessage = response.displayErrorMessage;
                        }
                    }
                });
            } else {
                vm.voucherMessage = 'Please Enter VoucherCode';
            }
        }

        vm.removeVoucher = function () {
            if (vm.data.voucherCode != null) {
                voucherService.removeVoucher(vm.data.voucherCode).then(function (response) {
                    if (response.status >= 400) {
                        common.validateResponse(response);
                        return;
                    }
                    else if (response.isVoucherRemoved) {
                        reloadCart();
                        vm.voucherMessage = '';
                        vm.isVoucherApplied = false;
                    } else {
                        vm.voucherMessage = response.displayErrorMessage;
                        vm.voucherCode = '';
                    }
                });
            }
        }
    }
}

());