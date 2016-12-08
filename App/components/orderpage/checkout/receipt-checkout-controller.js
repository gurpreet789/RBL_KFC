(function () {
    'use strict';

    var app = angular.module('main');

    function receiptCheckoutController($scope, $rootScope, StoresService) {

        var vm = $scope.checkout;
        var data = vm != undefined ? vm.data : window.Data;
        var receiptVm = this;

        var MaxProductIDLength = 36;
        var MaxProductInfoLength = 100;

        receiptVm.selectedStore = vm.selectedStore.storeName != undefined ? vm.selectedStore : window.Store;
        receiptVm.user = vm != undefined ? vm.user : "";
        receiptVm.isDelivery = data.isDelivery;
        receiptVm.deliveryFee = vm != undefined ? vm.DeliveryFee : "";
        receiptVm.SelectedPickupTime = vm.formatedSelectedTime != undefined && vm.formatedSelectedTime != "" ? vm.formatedSelectedTime : window.FormatedSelectedTime;
        receiptVm.orderComment = data.orderComment != undefined ? data.orderComment : window.OrderComment;
        receiptVm.timeFeedbackMessage = vm.timeFeedbackMessage != undefined ? vm.timeFeedbackMessage : "";
        receiptVm.isLoggedIn = vm.isLoggedIn != undefined ? vm.isLoggedIn : "";
        receiptVm.orderClass = vm.orderClass != undefined ? vm.orderClass : "";
        receiptVm.isLoading = true;
        receiptVm.createdOrderTime = "";


        window.orderVars = new Object;
        window.orderVars.Total = 0;
        window.orderVars.Total = "";
        window.orderVars.ProductId = "";
        window.orderVars.ProductInfo = "";
        window.orderVars.Quantity = 0;
        window.orderVars.ebRand = Math.random() + ''; window.orderVars.ebRand = window.orderVars.ebRand * 1000000;


        receiptVm.initialize = function () {
            if (window.OrderId != undefined || vm.orderId != undefined) {
                receiptVm.orderClass = receiptVm.orderClass == "" ?  window.OrderClass : receiptVm.orderClass ;
                receiptVm.isLoading = true;
                vm.common.scrollScreenUp();
                vm.CheckoutService.GetReceipt().then(function (orderConfirmation) {

                    if (data != undefined && orderConfirmation && orderConfirmation.order && orderConfirmation.order.orderItems) {
                        //saved total as a global variable for facebook pixel
                        window.orderVars.Total = orderConfirmation.order.orderTotal;
                        window.orderVars.OrderId = orderConfirmation.order.orderId;

                        ga('ecommerce:addTransaction', {
                            // Micros Store Id as four digits + "-" + Micros Order Id
                            'id': vm.selectedStore.storeId + '-' + orderConfirmation.order.orderId,
                            // Store name.
                            'affiliation': vm.selectedStore.storeName,
                            // Total price on the order including delivery fee
                            'revenue': orderConfirmation.order.orderTotal,
                            // it is a currency type, 1 – Pick up, 2 – Delivery
                            'shipping': '0',
                            // assume not required
                            'tax': ''
                        });

                        var productSKUs = [];
                        angular.forEach(orderConfirmation.order.orderItems, function (item, i) {

                            var productSKUOccurance = 0;
                            for (var j = 0; j < orderConfirmation.order.orderItems.length; j++) {
                                if (item.productId === orderConfirmation.order.orderItems[j].productId) {
                                    productSKUOccurance++;
                                }
                            }
                            productSKUs.push(item.productId);

                            var productId = item.productId;
                            if (productSKUOccurance > 1) {
                                var prefix = 0;
                                for (var j = 0; j < productSKUs.length; j++) {
                                    if (item.productId === productSKUs[j]) {
                                        prefix++;
                                    }
                                }

                                productId += "-" + prefix;
                                
                            }

                            window.orderVars.ProductId += item.productId + ","
                            window.orderVars.ProductInfo += item.productDescription + ",";
                            window.orderVars.Quantity += item.quantity;

                            ga('ecommerce:addItem', {
                                // Micros Store Id as four digits + "-" + Micros Order Id
                                'id': vm.selectedStore.storeId + '-' + vm.orderId,
                                // Product name
                                'name': item.productDescription,
                                // Micros Product Id
                                'sku': productId,
                                // Pizza or Side or Deal
                                'category': item.productType,
                                // Note Micros does not return the price for a deal item. If a customised deal item, then Micros returns the price of additional items only.
                                'price': item.priceTotal,
                                // Quantity
                                'quantity': item.quantity
                            });
                        });

                        ga('ecommerce:send');
                    }

                    //if revenue tagging is enabled in serverside config.
                    if (orderConfirmation.revenueTagEnable == "true") {
                        //remove trailing comma
                        window.orderVars.ProductId = window.orderVars.ProductId.replace(/,$/, "");
                        window.orderVars.ProductInfo = window.orderVars.ProductInfo.replace(/,$/, "");
                        //Tuncate product info for revenue tagging if too long
                       if (window.orderVars.ProductId.length > MaxProductIDLength) {
                           window.orderVars.ProductId.substr(0, MaxProductIDLength-1);
                        }
                       if (window.orderVars.ProductInfo.length > MaxProductInfoLength) {
                           window.orderVars.ProductInfo.substr(0, MaxProductInfoLength-1);
                        }
                        //RevenueTag elemet added to page on load
                        var el = document.createElement('script');
                        el.src = orderConfirmation.revenueTagUrl + '&amp;rnd=' + window.orderVars.ebRand + '&amp;Value=' + window.orderVars.Total + '&amp;OrderID=' + window.orderVars.OrderId + '&amp;ProductID=' + window.orderVars.ProductId + '&amp;ProductInfo=' + window.orderVars.ProductInfo + '&amp;Quantity=' + window.orderVars.Quantity;
                        document.body.appendChild(el);
                    }

                    var utcToLocalCreatedOrderTime = moment.utc(orderConfirmation.order.dateCreated).toDate();

                    receiptVm.createdOrderTime = moment(utcToLocalCreatedOrderTime).format("h:mm A. dddd, DD MMMM YYYY");
                    receiptVm.receipt = orderConfirmation;
                    receiptVm.isLoading = false;

                    $rootScope.$broadcast(RELOAD_MYCART);
                    return;
                });
            }
        }

        receiptVm.initialize();

        receiptVm.printReceipt = function () {
            window.print();
        }

        receiptVm.Close = function () {
            vm.receiptModal.close();
            if (document.URL.toLocaleLowerCase().indexOf("payment") != -1) {
                window.location = document.URL.split('/')[0];
            }
        }



    }

    var controllerId = 'rbReceiptCheckoutController.controller';
    app.controller(controllerId, receiptCheckoutController);
    receiptCheckoutController.$inject = ['$scope', '$rootScope', 'StoresService'];
}());