(function () {
    'use strict';

    var module = angular.module('main');
    //instantiate factory
    module.factory("DealService", dealService);

    dealService.$inject = ['CommonService', '$q'];

    function dealService(common, $q) {

        var service = {};

        service.getDealDetails = function (dealId) {
            var deferred = $q.defer();

            var params = {
                params: {
                    dealId: dealId,
                }
            };

            common
                .dataservice
                .getDataFromAPI('onlineorder/api/deal', params)
                .then(function (data) {
                    if (data!=null && data!=undefined && data.status >= 400) {
                        data = null;
                    }

                    deferred.resolve(data);
                    return deferred.promise;

                }, function (error) {
                    deferred.reject(error);
                    return deferred.promise;
                });

            return deferred.promise;
        };

        service.addToDeal = function (productId) {
            var deferred = $q.defer();

            var params = {
                params: {
                    productId: productId,
                }
            };

            common
                .dataservice
                .getDataFromAPI('onlineorder/api/deal/AddToDeal', params)
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
        };

        service.completeDeal = function (selectedProductsInDeal) {
            var deferred = $q.defer();


            var paramsRegister = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };


            selectedProductsInDeal.sort(function (a, b) {
                return a.tabId - b.tabId;
            });

            common
                .dataservice
                .postDataToAPI('onlineorder/api/deal/CompleteDeal', selectedProductsInDeal, paramsRegister)
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
        };

        service.cancelDeal = function () {
            var deferred = $q.defer();
            common
                .dataservice
                .getDataFromAPI('onlineorder/api/deal/CancelDeal')
                .then(function (data) {
                    if (data.status >= 400) {
                        var errorMessage = "";
                        if (data.data.message) {
                            errorMessage = data.data.message;
                        }
                        else {
                            errorMessage = data.data;
                        }
                        common.displayError(errorMessage);
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

        return service;

    }

}());