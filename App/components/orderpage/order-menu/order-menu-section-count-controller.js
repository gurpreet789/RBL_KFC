(function () {
    'use strict';

    var app = angular.module('main');

    // Instantiate the controllerID.
    var controllerID = 'rbOrderMenuSectionCount.controller';

    // Register the controller.
    app.controller(controllerID, controller);

    // Inject dependencies.
    controller.$inject = ['$scope', 'CommonService', 'ProductService', '$rootScope'];

    function controller($scope, common, productService, $rootScope) {

        // View Model.
        var vm = this;

        vm.productSectionId = $scope.productSection;
        vm.productsCount = 0;
        // Activate method to execute controller logic.
        initialise();

        // Method which executes and data fetch controller logic and returns a promise.
        function initialise() {
            if (vm.productsCount === 0 && vm.productSectionId && vm.productSectionId !== null) {
                productService.GetProductCount(vm.productSectionId).then(function (data) {
                    vm.productsCount = data;
                    $rootScope.productsCount = data;
                });

            }
           
        }
    }
}());
