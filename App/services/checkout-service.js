(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "CheckoutService";

    function CheckoutService(common) {

        function InitCheckout(basketData) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            var checkoutRequestModel = {
                BasketId: basketData.basketId,
                OrderClass: basketData.OrderOption,
                StoreId: basketData.storeId,
                OrderTime: basketData.orderTime,
                OrderTimeStringWithFormat: basketData.orderTimeString,
                DeliveryAddress: basketData.deliveryAddress,
                UserAgent: basketData.UserAgent
            };

            return common.dataservice.postDataToAPI("/onlineorder/api/checkout/initcheckout", checkoutRequestModel, params);
        }

        function PlaceOrder(placeOrderRequest) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI("/onlineorder/api/checkout/placeorder", placeOrderRequest, params);
        }

        function ConstructOrderRequest(customerData, basketData) {
            var order = {
                Title: customerData.title,
                FirstName: customerData.firstName,
                LastName: customerData.lastName,
                ContactEmailPrimary: customerData.contactEmailPrimary,
                ContactTelephonePrimary: customerData.contactTelephonePrimary,
                Comment: basketData.orderComments,
                PaymentData: [{ Amount: basketData.basketTotal, PaymentMethodType: basketData.selectedPaymentMethod }],
                Address: {},
                IsDelivery: basketData.isDelivery,
                PaymentType: basketData.selectedPaymentMethod,
                ReceiptNumber: basketData.receiptNumber,
                TransactionId: basketData.transactionNumber,
                BasketId: basketData.basketId,
                OrderClass: basketData.OrderOption != undefined ? basketData.OrderOption : basketData.orderOption,
                OrderTime: basketData.orderTime,
                NewTimeSlot: basketData.newTimeSlot,
                SelectedStoreId: basketData.storeId,
                SelectedStoreName: basketData.storeName,
                UserAgent: basketData.UserAgent != undefined ? basketData.UserAgent : basketData.userAgent
            };

            if (basketData.deliveryAddress != null && basketData.deliveryAddress != undefined) {
                order.Address.AddressId = basketData.deliveryAddress.addressId;
                order.Address.AddressType = basketData.deliveryAddress.addressType;
                order.Address.StreetName = basketData.deliveryAddress.streetName;
                order.Address.BuildingNumber = basketData.deliveryAddress.streetNumber;
                order.Address.BuildingLetter = basketData.deliveryAddress.buildingLetter;
                order.Address.RoomNumber = basketData.deliveryAddress.unit;
                order.Address.District = basketData.deliveryAddress.city;
                order.Address.Territory = basketData.deliveryAddress.district;
                order.Address.TownCity = basketData.deliveryAddress.city;
                order.Address.PostCodeOrZip = basketData.deliveryAddress.postCode;
            }

            return order;
        }

        function GetReceipt() {
            return common.dataservice.getDataFromAPI("/onlineorder/api/checkout/confirmationorder");
        }

        function GetPaymentForm(paymarkConstructFormRequest) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI("/onlineorder/api/checkout/PayNow", paymarkConstructFormRequest, params);
        }

        function GetSurchargeMobileEFTPOS() {
            return common.dataservice.getDataFromAPI('onlineorder/api/order/getmobileeftpossurcharge');
        }

        function GetBasketDataFromSessionId() {
            return common.dataservice.getDataFromAPI('onlineorder/api/cart/basket');
        }

        function AddCartSessionStorage(basketData) {

            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI('onlineorder/api/checkout/addcartsession', basketData, params);
        }

        function GetCartSessionStorage() {
            return common.dataservice.getDataFromAPI('onlineorder/api/checkout/cartsession');
        }

        function RemoveCartSessionStorage() {
            return common.dataservice.postDataToAPI('onlineorder/api/checkout/removecartsession');
        }

        function AddCustomerInfoStorage(userData) {

            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI('onlineorder/api/checkout/addcustomersession', userData, params);
        }

        function GetCustomerInfoStorage() {
            return common.dataservice.getDataFromAPI('onlineorder/api/checkout/customersession');
        }

        function AddStoreInfoStorage(storeData) {

            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI('onlineorder/api/checkout/addstoresession', storeData, params);
        }

        function GetStoreInfoStorage() {
            return common.dataservice.getDataFromAPI('onlineorder/api/checkout/storesession');
        }

        function BuyNow(customerData, basketData) {

            var result = {
                errorMessage: undefined,
                orderId: undefined,
                displayMode: 1,
            };

            var placeOrder = function (order) {
                var errorMessage = "Sorry, an error occurred while processing your request";

                return PlaceOrder(order).then(function (orderResponse) {
                    if (orderResponse.status < 400 && orderResponse.data.isSuccess) {
                        result.orderId = orderResponse.data.orderId;
                    }
                    else if (orderResponse) {
                        if (orderResponse.data) {
                            if (orderResponse.data.errorMessage) {
                                errorMessage = orderResponse.data.errorMessage;
                            }
                            else if (orderResponse.data.exceptionMessage) {
                                errorMessage = orderResponse.data.exceptionMessage;
                            }
                            else if (orderResponse.data) {
                                errorMessage = orderResponse.data;
                            }
                        }
                        result.errorMessage = errorMessage;
                        result.displayMode = orderResponse.data && orderResponse.data.errorMessage ? 1 : 2;
                    }

                    return result;
                });
            };

            var orderRequest = ConstructOrderRequest(customerData, basketData);

            return placeOrder(orderRequest)
        }

        function ValidateTransaction(paymarkValidateTransactionRequest) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            return common.dataservice.postDataToAPI("/onlineorder/api/checkout/paynowvalidate", paymarkValidateTransactionRequest, params);
        }

        function GetPaymentOptions(isDelivery) {
            var params = {
                params: {
                    isDelivery: isDelivery,
                }
            };

            return common.dataservice.getDataFromAPI("/onlineorder/api/checkout/paymentoptions", params);
        }

        var service = {
            PlaceOrder: PlaceOrder,
            ConstructOrderRequest: ConstructOrderRequest,
            GetReceipt: GetReceipt,
            BuyNow: BuyNow,
            GetPaymentForm: GetPaymentForm,
            ValidateTransaction: ValidateTransaction,
            GetSurchargeMobileEFTPOS: GetSurchargeMobileEFTPOS,
            InitCheckout: InitCheckout,
            GetPaymentOptions: GetPaymentOptions,
            GetBasketDataFromSessionId: GetBasketDataFromSessionId,
            AddCartSessionStorage: AddCartSessionStorage,
            GetCartSessionStorage: GetCartSessionStorage,
            RemoveCartSessionStorage: RemoveCartSessionStorage,
            AddCustomerInfoStorage: AddCustomerInfoStorage,
            GetCustomerInfoStorage: GetCustomerInfoStorage,
            AddStoreInfoStorage: AddStoreInfoStorage,
            GetStoreInfoStorage: GetStoreInfoStorage

        };

        return service;
    }

    //instantiate factory
    module.factory(serviceID, CheckoutService);
    CheckoutService.$inject = ['CommonService', '$q'];

}());