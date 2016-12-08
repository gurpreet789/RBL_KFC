(function () {
    'use strict';

    var app = angular.module('main');
    var controllerId = 'rbDealDetail.controller';
    app.controller(controllerId, dealDetailController);

    dealDetailController.$inject = ['$scope', '$state', 'CommonService', '$modal', '$location', '$filter', 'CartInterfaceService', '$anchorScroll', 'DealService', '$rootScope'];

    function dealDetailController($scope, $state, common, $modal, $location, $filter, cartInterfaceService, $anchorScroll, dealService, $rootScope) {

        var vm = this;
        vm.deal = null;
        vm.dealId = common.$stateParams.dealId;
        vm.isloading = false;
        vm.isInitialised = false;
        vm.isComplete = false;
        vm.userTotalDealStepsCount = 0;
        vm.allProductsInDeal = [];
        vm.allSectionsInDeal = [];

        vm.selectedProductsInDeal = [];

        function completeEvent(event, args) {
            vm.completeDealItemCustomise(event, args);
        }

        $(document).bind(COMPLETE_DEAL_ITEM_CUSTOMISE, completeEvent);

        window.onbeforeunload = function (e) {
            // If we haven't been passed the event get the window.event
            e = e || window.event;

            var message = 'Are you sure want to cancel the deal?';

            // For IE6-8 and Firefox prior to version 4
            if (e) {
                e.returnValue = message;
            }

            // For Chrome, Safari, IE8+ and Opera 12+
            return message;
        };

        var stateChange = $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            event.preventDefault();
            common.showConfirmation("Cancel Deal", "", function () {
                dealService.cancelDeal()
                  .then(function (data) {
                      window.onbeforeunload = null;
                      cartInterfaceService.enableCart();
                      window.location = "/order/" + toParams.sectionName;

                  });
            }, function () {
                event.preventDefault();
            });
        });

        $scope.$on('$destroy', stateChange);

        vm.initialise = function () {

            vm.isloading = true;

            dealService
                .getDealDetails(vm.dealId)
                .then(function (data) {
                    if (data == null || data == undefined) {
                        vm.deal = {};
                        vm.deal.dealType = 'OfferCollection';
                        vm.redirectThePage();
                    }
                    else{
                        vm.deal = data;
                        vm.setUpTabs();
                    }
                }).finally(function () {
                    vm.isloading = false;
                    vm.isInitialised = true;
                });
        };

        vm.setUpTabs = function () {

            if (vm.deal && vm.deal.steps) {
                vm.deal.steps[0].isOpen = true;
            }

            var productUniqueId = 1;

            for (var j = 0; j < vm.deal.steps.length; j++) {

                var section = vm.deal.steps[j];

                section.tabId = j;
                section.isSides = section.isSides;
                section.sectionId = j;
                section.uniqueId = j + 1;

                var products = vm.deal.steps[j].products;

                for (var k = 0; k < products.length; k++) {

                    var product = products[k];

                    product.tabId = j + 1;
                    product.sectionId = section.uniqueId;
                    product.clientProductId = k;
                    product.canShowRemoveButton = true;
                    product.uniqueId = productUniqueId;
                    //product.uniqueId = (j + 1) + (k + 1);

                    vm.allProductsInDeal.push(product);
                    productUniqueId++;
                }

                vm.allSectionsInDeal.push(section);

            }

            vm.autoSelectSides();
            cartInterfaceService.disableCart();

        };

        vm.autoSelectSides = function () {

            for (var i = 0; i < vm.allSectionsInDeal.length; i++) {

                var section = vm.allSectionsInDeal[i];

                if (section.isSides && section.products.length == 1) {
                    var product = section.products[0];
                    product.canShowRemoveButton = false;
                    vm.addSideToDeal(product, section);
                }

            }
        };

        vm.cancelDeal = function () {
            common.showConfirmation("Cancel Deal", "", function () {
                dealService.cancelDeal()
                    .then(function (data) {
                        cartInterfaceService.enableCart();
                        vm.redirectThePage();
                    });
            });
        };

        vm.redirectThePage = function () {
            //switch (vm.deal.dealType) {
            //    case 'OfferDelivery':
            //        $scope.$broadcast('$destroy');
            //        window.onbeforeunload = null;
            //        $location.path("/order/deals/delivery");
            //        $location.url($location.path());
            //        cartInterfaceService.enableCart();
            //        break;
            //    case 'OfferCollection':
            //    default:
            //        $scope.$broadcast('$destroy');
            //        window.onbeforeunload = null;
            //        $location.path("/order/deals/pickup");
            //        $location.url($location.path());
            //        cartInterfaceService.enableCart();
            //        break;
            //}

            $scope.$broadcast('$destroy');
            window.onbeforeunload = null;
            $location.path("/order/deals");
            $location.url($location.path());
            cartInterfaceService.enableCart();
        }

        vm.startCustomise = function (product) {
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            common.$q.all(
               common.fadeAndScroll(scrollPostion, function () {
                   var param = { id: product.productId, name: product.name, sectionId: product.sectionId, uniqueId: product.uniqueId };
                   cartInterfaceService.startCustomiseDeal(param);
               })
           );
        };

        vm.editCustomisedProduct = function (product) {
            var param = { id: product.productId, name: product.name, sectionId: product.sectionId, data: product.selectedItem };
            cartInterfaceService.startCustomiseDeal(param);
        };

        vm.addToDeal = function (product, section) {

            vm.isloading = true;
            window.onbeforeunload = null;
            dealService
                .addToDeal(product.productId)
                .then(function (data) {

                    product.index = vm.userTotalDealStepsCount;

                    section.selectedStepCount++;
                    vm.userTotalDealStepsCount++;
                    product.isSelected = true;

                    data.states[0].tabId = product.tabId;
                    data.states[0].uniqueId = product.uniqueId;

                    data.states[0].sauces.length = 1;

                    vm.selectedProductsInDeal[product.index] = data.states[0];

                    product.selectedItem = vm.selectedProductsInDeal[product.index];

                    vm.checkForDealCompletion(section);
                }).finally(function () {
                    vm.isloading = false;
                });

        };

        vm.checkForDealCompletion = function (section) {

            vm.isComplete = vm.deal.totalDealStepsCount == vm.userTotalDealStepsCount;

            if (vm.isComplete) {
                vm.completeDeal();
                return;
            }

            if (section.selectedStepCount == section.totalStepCount) {

                section.isOpen = false;
                var index = vm.allSectionsInDeal.indexOf(section);

                var nextSection = vm.allSectionsInDeal[index + 1];

                if (nextSection) {
                    nextSection.isOpen = true;
                    $location.hash('top');
                    $anchorScroll();
                }
            }
        };

        vm.addSideToDeal = function (product, section) {

            product.index = vm.userTotalDealStepsCount;

            section.selectedStepCount++;
            vm.userTotalDealStepsCount++;

            var state = {
                productId: product.productId,
                productName: product.name,
                tabId: product.tabId,
                uniqueId: product.uniqueId,
            };

            product.isSelected = true;

            vm.selectedProductsInDeal[product.index] = state;
            product.selectedItem = vm.selectedProductsInDeal[product.index];

            vm.checkForDealCompletion(section);
        };

        vm.removeProduct = function (product, section) {

            var items = vm.selectedProductsInDeal.filter(function (item) {
                var it = item.uniqueId === product.uniqueId;
                return it;
            });
            var indexOfRemovedProduct = vm.selectedProductsInDeal.indexOf(items[0]);
            vm.selectedProductsInDeal.splice(indexOfRemovedProduct, 1);

            section.selectedStepCount--;
            vm.userTotalDealStepsCount--;
            product.isSelected = false;
            product.selectedItem = undefined;
        };

        vm.completeDeal = function () {

            dealService
                .completeDeal(vm.selectedProductsInDeal)
                .then(function () {

                    vm.redirectThePage();

                    $(document).unbind(COMPLETE_DEAL_ITEM_CUSTOMISE, completeEvent);

                    cartInterfaceService.completeCustomise();

                }).finally(function () {
                    $rootScope.$broadcast(RELOAD_MYCART);
                    window.onbeforeunload = null;
                });

        };


        vm.completeDealItemCustomise = function (event, args) {

            var value = args;

            var items = $filter('filter')(vm.allProductsInDeal, { sectionId: value.sectionId, productId: value.state.productId });

            if (items.length == 0) {
                return;
            }

            var product = items[0];

            if (product.index === undefined) {
                product.index = vm.userTotalDealStepsCount;
            }

            var section = $filter('filter')(vm.allSectionsInDeal, { uniqueId: value.sectionId })[0];

            if (!product.isSelected) {
                section.selectedStepCount++;
                vm.userTotalDealStepsCount++;
                product.isSelected = true;
            }

            value.state.tabId = product.tabId;
            value.state.uniqueId = value.uniqueId;
            product.selectedItem = value.state;
            vm.selectedProductsInDeal.splice(product.index, 1, value.state);

            vm.checkForDealCompletion(section);
        };

    };

}());