(function () {
    'use strict';

    // register content controller
    var app = angular.module('main');
    var controllerId = 'rbDealWidget.controller';

    app.controller(controllerId, dealWidgetController);

    dealWidgetController.$inject = ['$scope', 'CommonService', 'ContentService', '$rootScope'];

    // content controller
    function dealWidgetController($scope, common, contentService, $rootScope) {
        // sets vm for this controller.
        var vm = this;
        vm.isloading = true;
        vm.HomepageDealURL = "";
        vm.HomepageDealImage = "";

        if (window.location.pathname == '/' && (vm.HomepageDealURL.length == 0 || vm.HomepageDealImage.length == 0))
        {
            contentService.GetHomepageDealContent()
            .then(function (data) {
                vm.HomepageDealURL = $rootScope.homepageDealURL = data.homepageDealURL;
                vm.HomepageDealImage = $rootScope.homepageDealImagePath = data.homepageDealImagePath;
                $rootScope.dealContentLoaded = true;
                vm.isloading = false;
            });
        }
        else {
            vm.isloading = false;
        }

        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            //common.$log.logDebug(controllerId + ' initialise()', 'deal widget initialises');
        }
    }
}());
