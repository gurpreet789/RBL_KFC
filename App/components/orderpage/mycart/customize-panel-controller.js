(function () {
    'use strict';

    var app = angular.module('main');

    var controllerId = 'rbCustomizePanel.controller';

    app.controller(controllerId, customizePanelController);

    customizePanelController.$inject = ['$scope', 'CommonService', 'CartInterfaceService', '$filter'];

    function customizePanelController($scope, common, cartInterfaceService, $filter) {

        // sets vm scopes.
        var vm = this;

        $scope.vm = vm;

        vm.cartButtonLabel = "Add to cart";
        vm.isDeal = false;
        vm.IsCustomiseReload = false;

        vm.lastSectionSelected = undefined;

        vm.isConfirmOpened = false;
        vm.first = true;

        reset();


        // initialise method.
        function reset() {

            vm.isDeal = false;
            vm.data = {};
            vm.selectedSection = undefined;

            vm.toppings = [];

            vm.qyantityItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            vm.quantity = vm.qyantityItems[0];

            vm.sauces = [];
            vm.baseTypes = [];
            vm.defaultToppings = [];
            vm.sizes = [];

            vm.canselectExtraTopping = false;

            vm.selectedSauce = {};
            vm.selectedBase = {};
            vm.selectedTopping = {};

            vm.selectedSize = 0;

            vm.mainProductId = -1;

            vm.hasPizza = vm.mainProductId > 0;
            vm.first = true;
            
        };

        $(document).on(START_CUSTOMISE, startCustomise);
        $(document).on(START_CUSTOMISE_DEAL, startCustomiseDeal);
        $(document).on(START_CUSTOMISE_RELOAD, reloadCustomise);
        $(document).on(CANCEL_CUSTOMISE, cancelCustomise);
        $(document).on(CANCEL_CUSTOMISE_CONFIGURATION, cancelCustomiseConfiguration);

        function startCustomise(event, args) {
            reset();

            vm.IsCustomiseReload = false;

            vm.mainProductId = args.id;
            vm.mainProductName = args.name;

            var params = {
                params: {
                    id: vm.mainProductId
                }
            };

            vm.callAPI('onlineorder/api/order', params);
            vm.quantity = vm.qyantityItems[0];

            vm.updateCartButton();
        };

        function startCustomiseDeal(event, args) {
            reset();

            vm.isDeal = true;
            vm.IsCustomiseReload = false;

            vm.mainProductId = args.id;
            vm.mainProductName = args.name;
            vm.sectionId = args.sectionId;
            vm.uniqueId = args.uniqueId;

            if (args.data) {
                vm.postDataToAPI('onlineorder/api/deal/EditDealItem', args.data);
                return;
            }

            var params = {
                params: {
                    productId: vm.mainProductId
                }
            };

            vm.callAPI('onlineorder/api/deal/AddToDeal', params);

            vm.updateCartButton();
        }

        function reloadCustomise(event, args) {
            reset();

            vm.IsCustomiseReload = true;


            vm.mainProductId = args.id;
            vm.mainProductName = args.name;
            vm.isDeal = args.isDeal;

            var params = {
                params: {
                    productId: vm.mainProductId,
                    basketItemId: args.basketItemId,
                    quantity: args.quantity,
                }
            };

            vm.callAPI('onlineorder/api/order/ReloadProduct', params);

            vm.quantity = vm.qyantityItems[args.quantity - 1];

            vm.cartButtonLabel = vm.isDeal ? "Update deal" : "Update cart";

            

        }

        function cancelCustomiseConfiguration() {
            vm.isConfirmOpened = false;
            vm.cancelOrder();
        }

        function cancelCustomise(args) {
            var params = {
                params: {
                    productId: vm.mainProductId
                }
            };

            vm.callAPI('onlineorder/api/order/CancelProduct', params);
        }

        vm.removeTopping = function (productToppingId, parentProductToppingGroupId) {

            var params = {
                params: {
                    productToppingId: productToppingId,
                    parentProductToppingGroupId: parentProductToppingGroupId
                }
            };

            vm.changeToppings(params);

        };

        vm.changeSection = function () {
            vm.updateDropdown();
        };

        vm.changeSpeciality = function () {

            var params = {
                params: {
                    specialityId: vm.selectedSpeciality.productSpecialityId,
                    sectionId: vm.selectedSection.productSectionId
                }
            };

            vm.callAPI('onlineorder/api/order/ChangeSpeciality', params);

        };

        vm.addTopping = function () {

            var params = {
                params: {
                    productToppingId: vm.selectedTopping.productToppingId,
                    parentProductToppingGroupId: vm.selectedTopping.parentProductToppingGroupId
                }
            };

            vm.changeToppings(params);

        };

        vm.changeToppings = function (params) {
            vm.callAPI('onlineorder/api/order/ChangeTopping', params);
        };

        vm.changeSauce = function () {

            var params = {
                params: {
                    productToppingId: vm.selectedSauce.productToppingId,
                    parentProductToppingGroupId: vm.selectedSauce.parentProductToppingGroupId,
                    productId: vm.selectedSection.productId
                }
            };

            vm.callAPI('onlineorder/api/order/ChangeSauce', params);

        };

        vm.changeBaseType = function () {

            var params = {
                params: {
                    productBaseTypeId: vm.selectedBase.productBaseTypeId
                }
            };

            vm.callAPI('onlineorder/api/order/ChangeBase', params);

        };

        vm.changeSize = function () {

            var params = {
                params: {
                    productSizeId: vm.selectedSize.productSizeId
                }
            };

            vm.callAPI('onlineorder/api/order/ChangeSize', params)
                .finally(function () {
                    cartInterfaceService.carLoading(false);
                });

        };

        vm.cancelOrder = function () {

            if (vm.isConfirmOpened) {
                return;
            }

            vm.isConfirmOpened = true;

            common.showConfirmation("Cancel", "", function () {
                var params = {
                    params: {
                        productId: vm.mainProductId
                    }
                };

                vm.callAPI('onlineorder/api/order/CancelProduct', params);

                if (!vm.IsCustomiseReload) {

                    cartInterfaceService.cancelCustomise();

                } else {

                    cartInterfaceService.completeCustomise();
                }

                if (vm.isDeal && common.$stateParams.sectionName === 'deal-detail') {
                    cartInterfaceService.disableCart();
                }

                reset();

                vm.isConfirmOpened = false;

            }, function () {
                vm.isConfirmOpened = false;
            });

        };

        vm.updateCartButton = function () {
            vm.cartButtonLabel = vm.isDeal ? "Add" : "Add to cart";
        };

        vm.completeCustomise = function () {

            if (vm.IsCustomiseReload) {
                vm.completeOrder();
            } else {
                vm.data.defaultState.sauces.length = 1;
                vm.data.defaultState.reference = "Customised";
                var param = { state: vm.data.defaultState, sectionId: vm.sectionId, uniqueId: vm.uniqueId };
                cartInterfaceService.completeDealItemCustomise(param);
            }

            if (vm.isDeal && common.$stateParams.sectionName === 'deal-detail') {
                cartInterfaceService.disableCart();
            }
        };

        vm.completeOrder = function () {
            var params = {
                params: {
                    quantity: vm.quantity
                }
            };

            vm.callAPI('onlineorder/api/order/CompleteOrder', params);
        };

        vm.postDataToAPI = function (api, data) {

            var paramsRegister = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            cartInterfaceService.carLoading(true);

            common
                .dataservice
                .postDataToAPI(api, data, paramsRegister)
                .then(function (response) {

                    vm.updateUI(response.data);

                }).finally(function () {
                    cartInterfaceService.carLoading(false);
                });

        };

        vm.callAPI = function (api, params) {

            vm.hasPizza = vm.mainProductId > 0;
            cartInterfaceService.carLoading(true);

            common
                .dataservice
                .getDataFromAPI(api, params)
                .then(function (data) {
                    vm.updateUI(data);
                }).finally(function () {
                    vm.first = false;
                    cartInterfaceService.carLoading(false);
                });

        };

        vm.updateUI = function (data) {

            if (data.status >= 400) {
                common.validateResponse(data);
                return;
            }

            if (data === "cancelled") {
                reset();
                return;
            }

            if (data === "completed") {
                cartInterfaceService.completeCustomise();
                return;
            }

            vm.data = data;
            vm.data.defaultState = vm.data.states[0];
            vm.updateDropdown();


            vm.hasPizza = vm.mainProductId > 0;

            var selectedTopingsCount = 0;
            angular.forEach(vm.data.defaultState.selectedToppings, function (val, key) {
                selectedTopingsCount = selectedTopingsCount + val.displayOrder;
            });


            vm.canselectExtraTopping = (selectedTopingsCount + 1) >= vm.data.defaultState.maxToppingCount && vm.hasPizza;

            vm.canChangeToppings = vm.canselectExtraTopping || vm.data.isHalfAndHalf;

            //if is a deal and is getting the ui for the first time reload changeSize to ensure the correct total is being loaded
            if (vm.first && vm.isDeal) {
                cartInterfaceService.carLoading(true);
                vm.changeSize();
                
            }

        };

        vm.updateDropdown = function () {

            if (vm.selectedSection === undefined) {
                vm.selectedSection = vm.data.sections[0];
            } else {
                var section = $filter('filter')(vm.data.sections, { productId: vm.selectedSection.productId })[0];
                vm.selectedSection = section;
            }

            vm.data.defaultState = $filter('filter')(vm.data.states, { selectedSectionId: vm.selectedSection.productSectionId })[0];

            //this is workaround for sauce dropdown to always select the first items
            //There is no default sauce returned from the service
            vm.selectedSauce = vm.data.defaultState.sauces[0];
            vm.selectedSize = vm.data.sizes[vm.data.defaultState.selectedSizeIndex];
            vm.selectedBase = vm.data.baseTypes[vm.data.defaultState.selectedBaseIndex];
            vm.selectedSpeciality = vm.data.specialities[vm.data.defaultState.selectedSpecialityIndex];
            
        };

    }

}());