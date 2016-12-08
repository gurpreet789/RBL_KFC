(function () {
    'use strict';

    var app = angular.module('main');

    // Instantiate the controllerID.
    var controllerID = 'rbOrderMenuTab.controller';

    // Register the controller.
    app.controller(controllerID, controller);

    // Inject dependencies.
    controller.$inject = ['$scope', '$rootScope', 'CommonService', 'CartInterfaceService'];

    function controller($scope, $rootscope, common, cartInterfaceService) {

        // View Model.
        var vm = this;

        // Activate method to execute controller logic.
        initialise();

        // Method which executes and data fetch controller logic and returns a promise.
        function initialise() {
            angular.element('.footer-backtotop').show();
            // sets section name (pizzas, new-products, deals, etc).
            vm.section = common.$stateParams.sectionName;

            if (vm.section == null) {
                vm.section = "pizzas";
            }

        }

        // sets section then redirect to url based on section ('/order/pizzas').
        vm.selectSection = function (setSection) {
            $rootscope.eventTrackingAction = setSection;
            $rootscope.$broadcast('GA_EVENT');
            common.$location.path("/order/" + setSection);
            cartInterfaceService.enableCart();
        };

        // checks the section if selected or not.
        vm.isSelected = function (selectedSection) {
            return vm.section === selectedSection;
        };
    }
}());
