(function () {
    'use strict';

    var app = angular.module('main');

    // sets the controller id.
    var controllerId = 'rbProductList.controller';

    // registers controller.
    app.controller(controllerId, productListController);

    // injects dependencies.
    productListController.$inject = ['$scope', 'ProductService', 'ProductActionService', 'FilterService', '$rootScope', 'CommonService', 'ContentService'];


    // angular controller for this component.
    function productListController($scope, productService, productActionService, filterService, $rootScope, common, contentService) {
        // sets vm for this controller.
        var vm = this;

        // sets vm scopes.
        vm.productList = undefined;
        vm.productListLive = [];
        vm.categoryList = undefined;
        vm.hasProducts = false;
        vm.hasFilters = $rootScope.hasFilters;
        vm.filterList = $rootScope.filterList;
        vm.productTab = $scope.productTab;
        vm.dispatchCount = false;
        vm.selectedFilter = '';
        vm.selectedFilterProductCount = undefined;
        vm.loading = true;
        vm.CategoryID = $rootScope.CategoryID;
        // initialises controller.
        initialise();

        // initialise method.
        function initialise() {
            productService.FetchProducts(vm).then(function () {
                if (vm.productTab == 'pizzas') {
                    InitFilter();
                }

                angular.forEach(vm.productList, function (product, index) {
                    common.$timeout(function () {
                        if ($rootScope.categoryIdLoaded == undefined || $rootScope.CategoryID == undefined || $rootScope.CategoryID == null) {
                            contentService.GetCategoryID().then(function (data) {
                                $rootScope.categoryIdLoaded = true;
                                vm.CategoryID = $rootScope.CategoryID = data;
                                product.enableOrderNow = product.productKeyValuePairList.categoryId != $rootScope.CategoryID;

                                if (product.productType === 3) {
                                    if (product.displayOrder > 0) {
                                        vm.productListLive.push(product);
                                    }
                                } else {
                                    vm.productListLive.push(product);
                                }

                            });
                        } else {
                            product.enableOrderNow = product.productKeyValuePairList.categoryId != $rootScope.CategoryID;

                            if (product.productType === 3) {
                                if (product.displayOrder > 0) {
                                    vm.productListLive.push(product);
                                }
                            } else {
                                vm.productListLive.push(product);
                            }

                        }
                    }, index * 100);
                });


                vm.loading = false;

            });
        }

        function InitFilter() {
            // sets promises.
            if (!$rootScope.hasFilters) {
                filterService.FetchFilters(vm);
                $rootScope.filterList = vm.filterList;
                $rootScope.hasFilters = vm.hasFilters;
            }
        };

        vm.customise = function (productId, name) {
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            return productActionService.Customise(productId, name, scrollPostion);
        };

        vm.addSideToCart = function (productId) {
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            return productActionService.AddSideToCart(productId, scrollPostion);
        };

        vm.addQuickPizzaToCart = function (productId) {
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            return productActionService.AddQuickPizzaToCart(productId, scrollPostion);
        };

        vm.changeFilter = function () {
            vm.selectedFilter = (vm.selectedFilter === undefined) || (vm.selectedFilter === 'All') ? '' : vm.selectedFilter;
        }

        vm.matchProductFilter = function (product) {
            if (vm.selectedFilter === '') return true;

            var reg = RegExp("^" + vm.selectedFilter + "$");

            var productFilters = product.productFilter.split('|');
            if (productFilters.length > 1) {
                var filterResult = false;
                angular.forEach(productFilters, function (value, key) {
                    if (reg.test(value)) {
                        filterResult = true;
                    }
                })

                return filterResult;
            }

            return reg.test(product.productFilter);
        }
    }
}());