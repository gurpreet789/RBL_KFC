(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "ProductActionService";
    var productDataCollection = {};
    //instantiate factory
    module.factory(serviceID, productActionService);

    productActionService.$inject = ['$rootScope', 'CommonService', 'CartInterfaceService'];

    function productActionService($rootScope,common,cartInterfaceService) {

        var productActionServiceMethods = {
            // common angular dependencies
            Customise: Customise,
            AddSideToCart: AddSideToCart,
            AddQuickPizzaToCart: AddQuickPizzaToCart
        };

        function Customise(productId, name, scrollPostion) {
            common.$q.all(
                common.fadeAndScroll(scrollPostion, function () {
                    var product = { id: productId, name: name };
                    cartInterfaceService.startCustomise(product);
                })
            );
        };

        function AddSideToCart(productID, scrollPostion) {
            common.$q.all(
                common.fadeAndScroll(scrollPostion, function () {
                    var params = {
                        params: {
                            productId: productID,
                            quantity: 1
                        }
                    };
                    callApi('onlineorder/api/order/AddSide', params);
                       
                })
             );
        };

        function AddQuickPizzaToCart (productID, scrollPostion) {

            common.$q.all(
                common.fadeAndScroll(scrollPostion, function () {

                    var params = {
                        params: {
                            productId: productID,
                            quantity: 1
                        }
                    };
                    callApi('onlineorder/api/order/AddQuickPizza', params);

                })
             );
           
        };

        function callApi(api, params) {
            cartInterfaceService.openCart();
            common
                .dataservice
                .getDataFromAPI(api, params)
                .then(function(data) {

                    if (data.status >= 400) {
                        common.validateResponse(data);
                        return;
                    }
                    cartInterfaceService.carLoading(false);
                    cartInterfaceService.completeCustomise();
                    return;
                });
        }

        return productActionServiceMethods;

    }

}());