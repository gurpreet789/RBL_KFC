(function () {
    'use strict';

    var app = angular.module('main');

    // Instantiate the controllerID.
    var controllerID = 'rbOrderSubMenu.controller';

    // Register the controller.
    app.controller(controllerID, controller);

    // Inject dependencies.
    controller.$inject = ['$scope', '$http', 'CommonService', '$state', 'ProductService', '$rootScope'];

    function controller($scope, $http, common, $state, productService, $rootScope) {

        // Constant of drop down left option value.
        var dropdownLeftValueConstant = 'left';

        // Constant of drop down right option value.
        var dropdownRightValueConstant = 'right';

        // View Model.
        var vm = this;

        vm.sectionName = $scope.sectionName;

        // True indicate left tab is active, false for right tab.
        vm.isLeftTabActive=false;
        vm.isLeftTabVisible = false;
        //
        vm.isRightTabActive = false;
        vm.isRightTabVisible = false;
  
        vm.leftUrl = $scope.leftUrl;
        vm.rightUrl = $scope.rightUrl;

        // Load leftTabData or rightTabData based on selectedTab.
        // selectedTab true indicate left tab.
        // selectedTab false indicate right tab.
        vm.load = function (selectedTab, triggerStateChange) {
            if (vm.sectionName == "sides") {
                vm.isLeftTabVisible = true;
                vm.isRightTabVisible = true;
            }
            //|| vm.sectionName != "burgers"
            if (selectedTab == dropdownRightValueConstant) {
                // Activate left tab.
                vm.isLeftTabActive = false;
                vm.isRightTabActive = true;                

                productService.TabSelection[vm.sectionName] = dropdownRightValueConstant;
                vm.selectedType = productService.TabSelection[vm.sectionName];

                if (triggerStateChange) { $state.go('order.section.subsection', { subsection: "" + vm.rightUrl }) }
            }
            else {
                // Activate right tab.
                vm.isLeftTabActive = true;
                vm.isRightTabActive = false;
                
                productService.TabSelection[vm.sectionName] = dropdownLeftValueConstant;
                vm.selectedType = productService.TabSelection[vm.sectionName];

                if (triggerStateChange) { $state.go("order.section.subsection", { subsection: "" + vm.leftUrl }); }
            }
        };
        $rootScope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
              if (toParams.subsection && toParams.subsection) {
                  var subsection = toParams.subsection;
                  vm.sectionName = toParams.sectionName;
                  setTheTab(subsection, false);
              }
          });
        function setTheTab(subsection, triggerChange)
        {
           
            if (!productService.TabSelection[vm.sectionName]) {
                productService.TabSelection[vm.sectionName] = dropdownLeftValueConstant;

            }
            if (subsection === vm.rightUrl) {
                productService.TabSelection[vm.sectionName] = dropdownRightValueConstant;
            }
            else {
                productService.TabSelection[vm.sectionName] = dropdownLeftValueConstant;
            }
            // Set default value;
            vm.selectedType = productService.TabSelection[vm.sectionName];
            // Load data to default shown tab.
            vm.load(vm.selectedType,triggerChange);
        }

        // Method which executes and data fetch controller logic and returns a promise.
        function initialise() {
            var subsection = common.$stateParams.subsection;
            setTheTab(subsection,true);
        }

        // Activate method to execute controller logic.
        initialise();

       


    }
}());
