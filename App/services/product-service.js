(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "ProductService";
    var productDataCollection = {};
    var tabSelection = {};

    //instantiate factory
    module.factory(serviceID, productService);

    productService.$inject = ['CommonService'];

    function productService( common ) {

        var productServiceMethods = {
            // common angular dependencies
            FetchProducts: FetchProducts,
            GetProduct:GetProduct,
            GetProductCount: GetProductCount,
            TabSelection: tabSelection
        };

        function FetchProducts(vm) {

            var productCollectionItem = productDataCollection[vm.productTab];
 
            if (productCollectionItem !== undefined) {
                var deferred = common.$q.defer();
                deferred.resolve(setVMStateAfterProductFetch(vm, productCollectionItem));
                return deferred.promise;

            }
            else {
                var params = {
                    params: {
                        productTab: vm.productTab
                    }
                };

                

                return common.dataservice.getDataFromAPI('onlineorder/api/product', params)
                    .then(function (data) {
                        // sets the data to product list.
                        setVMStateAfterProductFetch(vm,data);
                });
            }

        }

        function setVMStateAfterProductFetch(vm,data) {
            vm.productList = data;
            productDataCollection[vm.productTab] = data;
            // checks if product list is defined or not empty.
            if (typeof vm.productList !== 'undefined' && vm.productList.length !== 0) {
                vm.hasProducts = true;
            } else {
                vm.hasProducts = false;
            }

            return vm.productList;
        }

        function GetProduct(vm) {
            var deferred = common.$q.defer();
            // checks which is defined in scope, product item or product id.

            // checks if product item is in the scope.
            if (typeof vm.productItem !== 'undefined') {

                // product item is defined.
                deferred.resolve(vm.productItem);

            } else {
                // product id is defined.
                if (typeof vm.productId !== 'undefined') {
                    // get product by product id.
                    getProductHelper(vm.productId).then(function (data) {
                        deferred.resolve(vm.productItem);

                    });
                } else {
                    // product id is undefined.
                    var msg = 'Product id is not specified';
                    deferred.reject(msg);
                }
            }

            return deferred.promise;
        }

        function getProductHelper(productId) {
            var params = {
                params: {
                    id: productId
                }
            }
           
            return common.dataservice.getDataFromAPI('onlineorder/api/product/', params)
               .then(function (data) {
                   vm.productItem = data;
                  
            });
        }

        function GetProductCount(productTabSelector) {
            var productCollectionItem = productDataCollection[productTabSelector];
            if (productCollectionItem !== undefined) {
                var deferred = common.$q.defer();
                deferred.resolve(productCollectionItem.length);
                return deferred.promise;

            } else {

                var params = {
                    params: {
                        productTab: productTabSelector
                    }
                };

                return common.dataservice.getDataFromAPI('onlineorder/api/product', params)
                    .then(function(data) {
                        // sets the data to product list.
                        if (data && data.length > 0) {
                            productDataCollection[productTabSelector] = data;
                            return data.length;
                        }

                        return 0;
                    });
               }
        }

        return productServiceMethods;

    }

}());