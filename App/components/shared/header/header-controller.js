(function () {
    'use strict';

    var app = angular.module('main');
    var controllerId = 'rbHeader.controller';

    function headerController($scope, $rootscope, $http, $q, common, contentService, subscriptionService) {
        var vm = this;
        vm.trackAndRedirect = function (href, eventCategory, eventAction, eventLabel) {
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: eventAction,
                eventLabel: eventLabel
            });

            window.open(href, '_self');
        }
    }

    app.controller(controllerId, headerController);
    headerController.$inject = ['$scope', '$rootScope', '$http', '$q', 'CommonService', 'ContentService', 'SubscriptionService'];
}());
