(function () {
    'use strict';

    var app = angular.module('main');
    var controllerId = 'rbCheckout.controller';
    app.controller(controllerId, checkoutController);

    function checkoutController($scope, $http, common, $modal, $rootScope, OPTIMISATION, cartInterfaceService, checkoutService) {
        var vm = this;

        vm.CheckoutService = checkoutService;
        vm.common = common;
        vm.optimation = OPTIMISATION;
        vm.CartInterfaceService = cartInterfaceService;
        vm.$modal = $modal;
        vm.nzPhonePattern = /^(((0{0,2}64[\s\-]?(3|4|6|7|9)|\(?0(3|4|6|7|9)\)?)[\s\-]?\d{3}[\s\-]?\d{4})|((0{0,2}?64[\s\-\(]?2(0|1|2|6|7|8|9){1}[\s\-\)]?|\(?02(0|1|2|6|7|8|9){1}\)?)[\s\-]?\d{3}[\s\-]?\d{3,5}))$/;
        vm.emailPattern = /^[^\.].*$/;

        vm.OrderClass = {
            NOT_SET: 0,
            Collection: 1,
            Delivery: 2,
            RoomService: 3,
            DriveThru: 4
        };

        vm.PickupOptions = {
            NOT_SET: 0,
            ASAP: 1,
            LATER: 2
        }

        vm.message = "helo";

        vm.CurrentCustomerData = {
            title: 7,
            firstName: "",
            lastName: "",
            contactEmailPrimary: "",
            contactTelephonePrimary: "",
            customerAddressList: Array[0],
            marketingOptIn: false
        };

        vm.formatedSelectedTime = "";

        vm.reservedDeliveryTimeSlotId = 0;

        vm.OrderOption = vm.OrderClass.NOT_SET;

        vm.storeId = 0;
        vm.selectedStoreName = "";

        vm.storeName = "";

        vm.isLoading = false;

        vm.totalPrice = 0;

        vm.orderId = 0;

        vm.data = {};

        vm.orderClass = "";

        vm.user = {};

        vm.selectedStore = {};

        vm.selectedUserAddress = "";
        vm.selectedUserAddressModel = "";

        vm.MinimumDeliveryOrderAmount = 0.0;

        vm.currentBasketItems = [];

        vm.timeFeedbackMessage = '';

        vm.isDelivery = false;

        vm.isLoggedIn = false;

        vm.initialise = function () {
            var params = {
                params: {
                    chekOutOptions: vm.OrderClass.Collection
                }
            }
            vm.OrderOption = vm.OrderClass.Collection;
            vm.isLoading = true;
        }

        vm.dismissModal = function (modalInstance) {
            modalInstance.dismiss('continue');
        }

        vm.checkoutOptionShowModal = true;


        vm.showCheckOut = function (data) {
            cartInterfaceService.carLoading(true);
            ga('send', 'event', 'Checkout', 'Check Out', 'In-cart');
            vm.common.validateSession().then(function (response) {
                cartInterfaceService.carLoading(false);
                if (response.isSessionAlive) {
                    vm.initialise();
                    cartInterfaceService.closeCartNoPositionRevert();
                    vm.data = data;
                    vm.modalStep1 = vm.$modalInstance = $modal.open({
                        templateUrl: function (element, attr) {
                            if (!OPTIMISATION) {
                                return 'App/components/orderpage/checkout/show-checkout-modal.html';
                            }
                            return 'partials/show-checkout-modal.html';
                        },
                        controller: 'rbShowCheckoutModal.controller',
                        controllerAs: "checkOutOptions",
                        backdrop: 'static',
                        scope: $scope
                    });

                }
                else {
                    common.validateResponse(response);
                }
            });
        }

        vm.showPayment = function (data) {
            vm.modalStep2 = vm.$modalInstance = $modal.open({
                templateUrl: function (element, attr) {
                    if (!OPTIMISATION) {
                        return 'App/components/orderpage/checkout/payment-checkout.html';
                    }
                    return 'partials/payment-checkout.html';
                },
                controller: 'rbPaymentCheckoutController.controller',
                controllerAs: "checkoutPayment",
                backdrop: 'static',
                scope: $scope
            });

            vm.modalStep1.close();
        }

        $scope.$on('ShowReceipt', function () {
            vm.ShowThankYou(window.OrderId)
        })

        vm.ShowThankYou = function (orderId) {
            vm.orderId = orderId;
            if (vm.modalStep1 != undefined && vm.modalStep1 != null){
                vm.modalStep1.close();
            }
            if (vm.modalStep2 != undefined && vm.modalStep2 != null) {
                vm.modalStep2.close();
            }
            vm.common.scrollScreenUp();
            vm.receiptModal = $modal.open({
                templateUrl: function (element, attr) {
                    if (!OPTIMISATION) {
                        return 'App/components/orderpage/checkout/receipt-checkout.html';
                    }
                    return 'partials/receipt-checkout.html';
                },
                controller: 'rbReceiptCheckoutController.controller',
                controllerAs: "checkoutReceipt",
                backdrop: 'static',
                scope: $scope
            });
        }

    }

    

    checkoutController.$inject = ['$scope', '$http', 'CommonService', '$modal', '$rootScope', 'OPTIMISATION', 'CartInterfaceService', 'CheckoutService'];

}());