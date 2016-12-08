(function () {
    'use strict';

    var app = angular.module('main');

    function paymentCheckoutController($scope, $rootScope, addressService, MembershipService, StoresService) {

        var vm = $scope.checkout;
        var data = vm.data;
        var paymentVM = this;

        paymentVM.CustomerInfo = {};
        paymentVM.OrderId = 0;
        paymentVM.permitForNextStep = false;
        paymentVM.ModalTitle = "NOT_SET";
        paymentVM.totalPrice = data.basketTotal = vm.totalPrice;
        paymentVM.nzPhonePattern = vm.nzPhonePattern;
        paymentVM.emailPattern = vm.emailPattern;
        paymentVM.isLoading = false;
        paymentVM.orderOption = vm.OrderOption;
        paymentVM.customerAddress = '';
        paymentVM.OrderClass = vm.OrderClass;
        paymentVM.customerAddresses = {};
        paymentVM.selectedUserAddress = vm.selectedUserAddress;
        paymentVM.isDelivery = data.isDelivery = (vm.OrderOption == vm.OrderClass.Delivery);
        paymentVM.deliveryFee = vm.DeliveryFee
        paymentVM.constructPaymentForm = {};
        paymentVM.selectedPaymentMethod = 0;
        paymentVM.showModal = true;
        paymentVM.isDisplayError = false;
        paymentVM.errorMessage = '';
        paymentVM.mobileEFTPOSCharge = '';
        paymentVM.paymentOptions = '';
        paymentVM.creditCardMessage = '';
        paymentVM.selectedOption = '';
        paymentVM.selectedPaymentOption = '';
        vm.timeFeedbackMessage = "";

        paymentVM.initialize = function () {
            paymentVM.isLoading = true;
            vm.common.scrollScreenUp();

            vm.CheckoutService.GetPaymentOptions(paymentVM.isDelivery).then(function (response) {
                //paymentVM.paymentOptions = response.paymentOptions;
                //paymentVM.creditCardMessage = response.creditCardMessage;
                paymentVM.paymentOptions = response;
            });

            if (vm.user == null || !vm.user.hasOwnProperty("firstName")) {
                MembershipService.GetCurrentLoggedInCustomer().then(function (currentCustomer) {
                    if (currentCustomer != null && currentCustomer.status < 400) {
                        paymentVM.CustomerInfo = currentCustomer;
                    }
                    else {
                        paymentVM.CustomerInfo = null;
                    }

                    vm.CurrentCustomerData = paymentVM.CustomerInfo;
                    return currentCustomer;
                });
            }
            else {
                paymentVM.CustomerInfo = vm.user;
                vm.CurrentCustomerData = vm.user;

                $scope.firstname_new = vm.user.firstName;
                $scope.lastname_new = vm.user.lastName;
                $scope.phone_new = vm.user.contactTelephonePrimary;
                $scope.email_new = vm.user.contactEmailPrimary;
            }

            switch (vm.OrderOption) {
                case 1: {
                    vm.orderClass = "Pick up";
                    if (vm.user.hasOwnProperty("contactEmailPrimary")) {
                        if (paymentVM.CustomerInfo.customerAddressList.length == 1) {
                            paymentVM.customerAddress = $scope.deliveryAddress_new = paymentVM.CustomerInfo.customerAddressList[0].fullAddress;
                        }
                    }
                    break;
                }
                case 2: {
                    vm.orderClass = "Delivery";
                    if (vm.selectedUserAddress) {
                        paymentVM.customerAddress = $scope.deliveryAddress_new = vm.selectedUserAddress;
                        $scope.Comments = vm.selectedUserAddressModel.customerAddressDescription;
                    }

                    break;
                }
                case 3:
                    vm.orderClass = "Room service";
                    break;
                case 4:
                    vm.orderClass = "Drive thru";
                    break;
                default:
                    vm.orderClass = "NOT_SET";
                    break;
            }

            paymentVM.orderClass = vm.orderClass;

            if (paymentVM.isDelivery && ($rootScope.mobileEFTPOSChargeLoaded == undefined || paymentVM.mobileEFTPOSCharge == '')) {
                vm.CheckoutService.GetSurchargeMobileEFTPOS().then(function (response) {
                    paymentVM.mobileEFTPOSCharge = response;
                    $rootScope.mobileEFTPOSChargeLoaded = true;
                    paymentVM.isLoading = false;
                });
            }
            else {
                paymentVM.isLoading = false;
            }


        }

        paymentVM.initialize();

        paymentVM.onAddressFind = function addressFind() {
            paymentVM.customerAddress = '';
            paymentVM.customerAddressData = addressService.GetAddressTypeAhead($scope.deliveryAddress_new);
            return paymentVM.customerAddressData;
        };

        paymentVM.onAddressSelected = function addressSelected($item, $model, $label) {
            paymentVM.customerAddress = $item;
        }

        paymentVM.saveData = function () {

            return vm.CheckoutService.AddCartSessionStorage(data);
        }

        paymentVM.saveCustomerInfo = function () {
            return vm.CheckoutService.AddCustomerInfoStorage(vm.CurrentCustomerData)
        }

        paymentVM.buyNow = function () {
            paymentVM.isLoading = true;

            ga('send', 'event', 'Checkout', 'Buy now', 'Payment');

            if (vm.CurrentCustomerData == null || !vm.CurrentCustomerData.hasOwnProperty("contactEmailPrimary")) {

                vm.CurrentCustomerData = {
                    firstName: $scope.firstname_new,
                    lastName: $scope.lastname_new,
                    contactEmailPrimary: $scope.email_new,
                    contactTelephonePrimary: $scope.phone_new
                }
            }

            data.orderComment = $scope.Comments;
            data.orderComments = $scope.Comments;

            if (vm.OrderOption == vm.OrderClass.Delivery) {
                data.deliveryAddress = vm.selectedUserAddressModel;
            }

            data.selectedPaymentMethod = paymentVM.selectedPaymentMethod;
            data.transactionNumber = '';
            data.receiptNumber = '';
            data.newTimeSlot = false;

            var buyNow = function () {
                return vm.CheckoutService.BuyNow(vm.CurrentCustomerData, data);
            };

            var showReceipt = function (orderCallbak) {
                paymentVM.isLoading = false;
                if (orderCallbak.orderId != undefined) {
                    vm.orderId = orderCallbak.orderId;
                    vm.ShowThankYou(vm.orderId);
                    paymentVM.Close();
                }
                else if (orderCallbak.errorMessage != undefined && orderCallbak.errorMessage.length > 0) {
                    if (orderCallbak.displayMode == 2) {
                        vm.common.displayError(orderCallbak.errorMessage, true);
                        vm.$modalInstance.close();
                    }
                    else {
                        paymentVM.isDisplayError = true;
                        paymentVM.errorMessage = orderCallbak.errorMessage;
                    }
                }
            };

            if (paymentVM.selectedPaymentMethod != 1) {
                if (paymentVM.isDelivery) {
                    var confirmTimeSlot = function () {
                        return StoresService.ConfirmReservedTimeSlot(vm.reservedDeliveryTimeSlotId, data.storeId, data.orderTime).then(function (response) {
                            if (response.status >= 400) {
                                vm.common.displayError(response.data);
                            } else {
                                if (data.orderTime != response.data.timeValue) {
                                    vm.timeFeedbackMessage = 'You are allotted the closest time slot available. Please call the store for any queries';
                                    vm.formatedSelectedTime = response.data.timeValue;
                                    data.newTimeSlot = true;
                                }
                                data.orderTime = response.data.timeValue;
                                return true;
                            }
                            return false;
                        })
                    };

                    confirmTimeSlot()
                        .then(buyNow)
                        .then(showReceipt)
                        .finally(function () {
                            $rootScope.$broadcast(CART_LOADING, { isLoading: false });
                            $rootScope.$broadcast(VOUCHER);
                        })
                        .catch(function () { $rootScope.$broadcast(CART_LOADING, { isLoading: false }); });
                }
                else {
                    buyNow()
                    .then(showReceipt)
                    .finally(function () {
                        $rootScope.$broadcast(CART_LOADING, { isLoading: false });
                        $rootScope.$broadcast(VOUCHER);
                    })
                    .catch(function () { $rootScope.$broadcast(CART_LOADING, { isLoading: false }); });
                }

            } else {
                var mem = paymentVM.CustomerInfo;
                paymentVM.saveCustomerInfo();
                paymentVM.saveData();
                paymentVM.payNow();
            }
        }

        paymentVM.Close = function () {
            $rootScope.$broadcast('SHOW_STEP1_MODAL', { showModal: true });
            vm.$modalInstance.close();
        }

        paymentVM.CancelCheckout = function () {
            $rootScope.$broadcast('CLOSE_STEP1_MODAL', { showModal: true });
            vm.$modalInstance.close();
        }

        paymentVM.choosePayment = function (paymentTypeId) {
            paymentVM.selectedPaymentMethod = paymentTypeId;
        };

        paymentVM.payNow = function () {
            $rootScope.$broadcast(CART_LOADING, { isLoading: true });

            paymentVM.constructPaymentForm = {
                Amount: data.basketTotal,
                StoreId: vm.storeId,
                ItemPuchased: "Pizza",
                OrderData: { IsDelivery: paymentVM.isDelivery },
                PaymentMethod: paymentVM.selectedPaymentMethod
            };

            var showPaymentForm = function () {
                $rootScope.$broadcast(CART_LOADING, { isLoading: false });
                paymentVM.PaymentFormModal = vm.$modal.open({
                    templateUrl: function (element, attr) {
                        if (!vm.optimation) {
                            return 'App/components/orderpage/checkout/paynow-checkout.html';
                        }
                        return 'partials/paynow-checkout.html';
                    },
                    controller: 'rbCheckoutPayNowController.controller',
                    controllerAs: "checkoutPayNow",
                    backdrop: 'static',
                    scope: $scope
                })
            };

            vm.CheckoutService.GetPaymentForm(paymentVM.constructPaymentForm).then(function (response) {
                if (response.status >= 400) {
                    vm.common.displayError("No response from payment gateway");
                    $rootScope.$broadcast(CART_LOADING, { isLoading: false });
                } else {
                    vm.paymentURL = response.data;
                    window.location = vm.paymentURL;
                    //showPaymentForm();
                   // $rootScope.$broadcast("SHOW_STEP2_MODAL", { showModal: false });
                }
                return;
            }).catch(function () { $rootScope.$broadcast(CART_LOADING, { isLoading: false }); });
        }

        $scope.$on(CART_LOADING, function (event, args) {
            paymentVM.isLoading = args.isLoading;
            vm.isLoading = args.isLoading;
        });

        $scope.$on("SHOW_STEP2_MODAL", function (event, args) {
            paymentVM.showModal = args.showModal;
        })

    }

    var controllerId = 'rbPaymentCheckoutController.controller';
    app.controller(controllerId, paymentCheckoutController);
    paymentCheckoutController.$inject = ['$scope', '$rootScope', 'AddressService', 'MembershipService', 'StoresService'];
}());