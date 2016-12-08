(function () {
    'use strict';

    var module = angular.module('main');
    var serviceId = "StoresService";

    function StoreService(common, $q) {

        function GetStoreByDistrict(districtKey) {
            var deferred = $q.defer();
            var params = {
                params: {
                    district: districtKey
                }
            };

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/storeitem/GetStoreByDistrict", params)
                .then(function (data, status, headers, config) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function GetStoreByAddress(address) {
            var deferred = $q.defer();
            var params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            common
                .dataservice
                .postDataToAPI("/onlineorder/api/storeitem/GetStoreByAddress", address, params)
                .then(function (data, status, headers, config) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data.data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function GetMenuAndCompareBasket(storeid, orderOption, date) {
            var deferred = $q.defer();

            var params = {
                params: {
                    orderClass: orderOption,
                    storeId: storeid,
                    date: date
                }
            };

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/order/GetNotAvailableProduct", params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function RemoveProductsFromBasket(basketItems) {
            var deferred = $q.defer();
            var basketItemsArray = [];


            angular.forEach(basketItems, function (item) {
                basketItemsArray.push(item.basketItemId);
            });

            var params = {
                params: {
                    basketItemIds: basketItemsArray
                }
            }

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/cart/BulkRemoveBasketItem", params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function GetStoreDetail(storeId, orderClass, orderDate) {
            var deferred = $q.defer();
            var params = {
                params: {
                    storeId: storeId,
                    orderClass: orderClass,
                    orderDate: orderDate
                }
            };

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/storeitem/GetStoreDetails", params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function GetStoreOrderOption(storeId, orderClass, orderDate) {
            var deferred = $q.defer();
            var params = {
                params: {
                    storeId: storeId,
                    orderClass: orderClass,
                    orderDate: orderDate
                }
            };

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/storeitem/GetFormatedStoreOrderOption", params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function GetStoreDeliveryOption(storeId, deliveryDate) {
            var deferred = $q.defer();
            var params = {
                params: {
                    storeId: storeId,
                    deliveryDate: deliveryDate
                }
            };

            common
                .dataservice
                .getDataFromAPI("/onlineorder/api/deliverytimeslots/GetAvailableTimeSlots", params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function ReserveTimeSlot(selectedTime, storeId) {
            var deferred = $q.defer();

            var request = {
                StoreID: storeId,
                TimeSlot: selectedTime
            }

            var params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            common
                .dataservice
                .postDataToAPI("/onlineorder/api/deliverytimeslots/PostReserveDeliveryTimeSlot", request, params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        function ConfirmReservedTimeSlot(timeSlotId, storeId, orderTime) {
            var deferred = $q.defer();

            var request = {
                StoreID: storeId,
                TimeSlotID: timeSlotId,
                OrderTime: orderTime
            }

            var params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            common
                .dataservice
                .postDataToAPI("/onlineorder/api/deliverytimeslots/PostConfirmDeliveryTimeSlot", request, params)
                .then(function (data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        deferred.reject(data);
                        return deferred.promise;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        }

        var service = {
            GetStoreByDistrict: GetStoreByDistrict,
            GetStoreByAddress: GetStoreByAddress,
            GetStoreDetail: GetStoreDetail,
            GetStoreOrderOption: GetStoreOrderOption,
            GetStoreDeliveryOption: GetStoreDeliveryOption,
            GetMenuAndCompareBasket: GetMenuAndCompareBasket,
            RemoveProductsFromBasket: RemoveProductsFromBasket,
            ReserveTimeSlot: ReserveTimeSlot,
            ConfirmReservedTimeSlot: ConfirmReservedTimeSlot
        }

        return service;
    }

    module.factory(serviceId, StoreService);
    StoreService.$inject = ['CommonService', '$q'];

}());
