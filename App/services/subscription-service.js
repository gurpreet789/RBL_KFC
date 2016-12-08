(function () {
    'use strict';

    var module = angular.module('main');
    var serviceId = "SubscriptionService";

    function SubscriptionService(common, $q) {

        function Subscribe(actionUrl, firstName, lastName, email) {
            var deferred = $q.defer();
            var formatedActionUrl = actionUrl;
            var params = {
                params: {
                    FNAME: firstName,
                    LNAME: lastName,
                    EMAIL: email
                }
            };

            common
                .dataservice
                .getDataFromAPI(formatedActionUrl, params);
        }

        var service = {
            Subscribe: Subscribe
        }

        return service;
    }

    module.factory(serviceId, SubscriptionService);
    SubscriptionService.$inject = ['CommonService', '$q'];

}());
