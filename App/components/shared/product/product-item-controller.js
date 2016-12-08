(function () {
    'use strict';

    var app = angular.module('main');

    // sets controller id.
    var controllerId = 'rbProductItem.controller';

    // registers controller.
    app.controller(controllerId, productItemController);

    // injects dependencies.
    productItemController.$inject = ['$scope', 'CommonService', 'ProductService'];

    // angular controller for this component.
    function productItemController($scope, common, productService) {
        // sets vm for this controller.
        var vm = this;

        // sets vm scopes.
        vm.productId = undefined;
        vm.productItem = undefined;
        vm.iSDeal = undefined;

        // initialises controller.
        initialise();

        // initialise method.
        function initialise() {
            // sets vm scope.
            var deferred = common.$q.defer();
            vm.productItem = $scope.productItem;
            vm.productId = $scope.productId;
            vm.iSDeal = $scope.iSDeal;

            return productService.GetProduct(vm);
        }
    };

}());
