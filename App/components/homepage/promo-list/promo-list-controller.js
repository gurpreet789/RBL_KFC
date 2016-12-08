(function () {
    'use strict';

    // register content controller
    var app = angular.module('main');
    var controllerId = 'rbPromoList.controller';

    app.controller(controllerId, rbPromoListController);

    rbPromoListController.$inject = ['$scope', 'CommonService', 'ContentService', '$rootScope'];

    // content controller
    function rbPromoListController($scope, common, contentService, $rootScope) {
        // sets vm for this controller.
        var vm = this;
        vm.model = {};
        vm.isLoadComplete = false;

        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', 'promo list initialises');

            contentService.GetHomepagePromoContent()
           .then(function (data) {
               vm.model = data;
               vm.isLoadComplete = true;
           });
           
        }
        
    }
}());
