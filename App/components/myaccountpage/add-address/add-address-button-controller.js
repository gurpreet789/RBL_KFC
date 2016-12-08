(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbAddAddressButton.controller';

    // registers controller.
    app.controller(controllerId, addAddressButtonController);

    // injects dependencies.
    addAddressButtonController.$inject = ['$scope', '$http', 'CommonService', '$modal', '$window', "OPTIMISATION"];

    // angular controller for deal detail page.
    function addAddressButtonController($scope, $http, common, $modal, $window, OPTIMISATION) {
        // sets vm of this controller.
        var vm = this;

        // initialises the controller.
        initialise();

        // initialise method.
        function initialise() {
            var deferred = common.$q.defer();

            //common.$log.logDebug(controllerId + ' initialise()', 'addAddressButton initialises');
            common.$log.logInfo(controllerId, 'Activated addAddressButton controller.');
            deferred.resolve('OK');

            return deferred.promise;
        };

        // open add new address modal dialog.
        vm.onModal = function () {
            var modalObj = $modal.open({
                templateUrl: function() {
                    if (!OPTIMISATION) {
                        return 'App/components/myaccountpage/add-address/add-address-modal.html';
                    }
                    return 'partials/add-address-modal.html';
                } ,
                controller: 'rbAddAddressModal.controller',
                controllerAs: 'addAddressModal',
                scope: $scope,

            })

            /**
           * re-set focus on autofocus element
           * reason: Auto-focusing of a freshly-opened modal element causes any child elements with the autofocus attribute to lose focus.
           */
            modalObj.opened.finally(function () {
                setTimeout(function () {
                    $('#form_add_new_address input[type="text"]')[0].focus();
                }, 200);
            });
        };
    }
}());