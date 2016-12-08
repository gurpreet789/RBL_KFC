(function () {
    'use strict';

    var app = angular.module('main');

    function paymentResponseController($scope, $rootScope, $http, $stateParams, CheckoutService, MembershipService, CommonService, StoresService) {
        var messageForDomain = window.location.protocol + '//' + window.location.hostname;

        var showBasket = function () {

            


            var basketData;
            var userData;
            $rootScope.$broadcast("pageLoad", {});
            MembershipService.GetCurrentLoggedInCustomer().then(function (response) {
                userData = response;
                CheckoutService.GetCustomerInfoStorage().then(function (response) {
                    userData = userData == undefined || userData == null ? response : userData;
                    CheckoutService.GetCartSessionStorage().then(function (data) {

                        if (data != "Object reference not set to an instance of an object.") {
                            basketData = data;
                            basketData.receiptNumber = $stateParams.receipt;
                            basketData.transactionNumber = $stateParams.transaction;
                            basketData.comment = data.orderComments;
                            window.FormatedSelectedTime = data.orderTimeString;
                            window.OrderComment = data.orderComments;
                            window.OrderClass = data.isDelivery ? "Delivery" : "Pick Up";
                        } else {
                            CommonService.displayError('Sorry but there was a problem with your payment');
                            $rootScope.$broadcast("stopPageLoad", {});
                        }
                        CheckoutService.GetStoreInfoStorage().then(function (storeData){
                            window.Store = storeData;
                        }).finally(function () {
                            CheckoutService.BuyNow(userData, basketData).then(function (data) {
                                if (data.errorMessage == undefined) {
                                    window.Data = userData;
                                    window.OrderId = data.orderId;
                                    $rootScope.$broadcast("ShowReceipt", {});
                                } else {
                                    CommonService.displayError(data.errorMessage);
                                }
                                CheckoutService.RemoveCartSessionStorage();
                                $rootScope.$broadcast("stopPageLoad", {});
                            });
                        });
                    })
                });
            });
        }

        var initialize = function () {
            var message = $stateParams.transaction + '|' + $stateParams.receipt + '|' + $stateParams.response
            message = message.split('|');
            window.parent.postMessage(message, messageForDomain);
            if (message == undefined || message.length != 3 || message[2] == 'false') {
                CommonService.displayError("Sorry but there was a problem with your payment, please choose another payment method");
                CheckoutService.RemoveCartSessionStorage();
            } else {
                showBasket();
            }
        };

        initialize();

       
    }

    var controllerId = 'rbPaymentResponseController.controller';
    app.controller(controllerId, paymentResponseController);

    paymentResponseController.$inject = ['$scope', '$rootScope', '$http', '$stateParams', 'CheckoutService', 'MembershipService', 'CommonService', 'StoresService'];

}());