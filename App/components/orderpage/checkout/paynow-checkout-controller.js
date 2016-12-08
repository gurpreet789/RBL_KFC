(function () {
    'use strict';

    var app = angular.module('main');

    app.directive('iframeOnload', iframeOnload);

    function iframeOnload() {
        return {
            restrict: 'A',
            scope: {
                callback: '&iframeOnload'
            },
            link: function (scope, elem, attrs) {
                elem.on('load', function () {
                    scope.callback();
                });
            }
        };
    }

    function paynowCheckoutController($scope, $rootScope, $modalInstance, checkoutService, $sce, CommonService, StoresService) {

        var checkoutVm = $scope.checkout;
        var paymentVm = $scope.checkoutPayment;
        var data = checkoutVm.data;
        var paynowVM = this;
        var thisModalInstance = paymentVm.PaymentFormModal;

        paynowVM.originDomain = window.location.protocol + '//' + window.location.hostname;
        paynowVM.eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        paynowVM.paymentURL = checkoutVm.paymentURL;
        paynowVM.totalPrice = data.basketTotal;
        paynowVM.isLoading = false;
        paynowVM.showModal = true;
        paynowVM.isDelivery = data.isDelivery = (checkoutVm.OrderOption == checkoutVm.OrderClass.Delivery);

        paynowVM.Close = function () {
            $rootScope.$broadcast("SHOW_STEP2_MODAL", { showModal: true });
            thisModalInstance.close();
            window.removeEventListener(paynowVM.eventMethod == "attachEvent" ? "onmessage" : "message", paynowVM.postMessageEvent, false);
        }

        paynowVM.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        paynowVM.InitListener = function () {
            var messageEvent = paynowVM.eventMethod == "attachEvent" ? "onmessage" : "message";
            window.addEventListener(messageEvent, paynowVM.postMessageEvent, false);
        }

        paynowVM.postMessageEvent = function (e) {
            if (e.origin == paynowVM.originDomain && !paynowVM.messageReceived) {
                CommonService.scrollScreenUp();

                paynowVM.turnOnLoading();

                document.getElementById("paymentFrame").style.display = 'none';

                var message = e.data.split('|');
                if (message != undefined && message.length == 3 && message[2] == 'true') {
                    paynowVM.messageReceived = true;
                    paynowVM.completeOrder(message[0], message[1]);
                }
                else {
                    paynowVM.turnOffLoading();
                    CommonService.displayError("Sorry but there was a problem with your payment, please choose another payment method");
                    paynowVM.Close();
                }
            }
        }

        paynowVM.messageReceived = false;

        paynowVM.completeOrder = function (trans, receipt) {
            var showReceipt = function (OrderId) {
                if (OrderId != null && OrderId != undefined) {
                    checkoutVm.orderId = OrderId;
                    checkoutVm.ShowThankYou(OrderId);
                }
            };

            data.transactionNumber = trans;
            data.receiptNumber = receipt;
            data.newTimeSlot = false;

            if (checkoutVm.isDelivery) {

                var confirmTimeSlot = function () {
                    return StoresService.ConfirmReservedTimeSlot(checkoutVm.reservedDeliveryTimeSlotId, data.storeId, data.orderTime).then(function (response) {
                        if (response.status >= 400) {
                            CommonService.validateResponse(response);
                        } else {
                            if (data.orderTime != response.data.timeValue) {
                                paymentVm.timeFeedbackMessage = 'You are allotted the closest time slot available. Please call the store for any queries';
                                paymentVm.formatedSelectedTime = response.data.timeValue;
                                data.newTimeSlot = true;
                            }
                            data.orderTime = response.data.timeValue;
                            return true;
                        }
                        return false;
                    })
                },
                buyNow = function (permitNextStep) {
                    if (permitNextStep) {
                        return checkoutVm.CheckoutService.BuyNow(checkoutVm.CurrentCustomerData, data).then(function (response) {
                            if (response.errorMessage != undefined && response.errorMessage.length > 0) {
                                CommonService.validateResponse(response);
                                thisModalInstance.close();
                                return null;
                            }

                            return response;
                        });
                    }
                };

                confirmTimeSlot()
                    .then(buyNow)
                    .then(showReceipt)
                    .finally(function () {
                        paynowVM.turnOffLoading();
                        thisModalInstance.close();
                    })
                    .catch(function () {
                        paynowVM.turnOffLoading();
                        thisModalInstance.close();
                    });

            }
            else {
                checkoutVm.CheckoutService.BuyNow(checkoutVm.CurrentCustomerData, data)
                .then(showReceipt)
                .finally(function () {
                    paynowVM.turnOffLoading();
                    thisModalInstance.close();
                })
                .catch(function () {
                    paynowVM.turnOffLoading();
                    thisModalInstance.close();
                });
            }
        }

        paynowVM.onErrorHappened = function (message) {
            CommonService.displayError(message);
            paynowVM.Close();
        }

        paynowVM.initialize = function () {
            paynowVM.isLoading = true;
            CommonService.scrollScreenUp();
            paynowVM.InitListener();
        }

        paynowVM.initialize();

        $scope.$on(CART_LOADING, function (event, args) {
            paynowVM.isLoading = args.isLoading;
            checkoutVm.isLoading = args.isLoading;
        });

        $scope.onloadCallback = function () {
            if (document.getElementById("paymentFrame").style.display != 'none') {
                paynowVM.turnOffLoading();
            }
        };

        paynowVM.turnOffLoading = function () {
            paynowVM.isLoading = false;
            var loadingScreen = document.getElementById("payment-loading");
            loadingScreen.className = "cart-loading-panel ng-hide";
        }

        paynowVM.turnOnLoading = function () {
            paynowVM.isLoading = true;
            var loadingScreen = document.getElementById("payment-loading");
            loadingScreen.className = "cart-loading-panel";
        }

    }

    var controllerId = 'rbCheckoutPayNowController.controller';
    app.controller(controllerId, paynowCheckoutController);
    paynowCheckoutController.$inject = ['$scope', '$rootScope', '$modalInstance', 'CheckoutService', '$sce', 'CommonService', 'StoresService'];
}());