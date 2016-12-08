(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "ContentService";
    //instantiate factory


    function contentService(common) {

        function GetHomepageDealContent() {
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/configuration/GetHomepageDealContent');
        }

        function GetDeliverySettings() {
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/configuration/GetDeliverySettings');
        }

        function GetHomepagePromoContent() {
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/configuration/GetHomepagePromoContent');
        }

        function GetCategoryID() {
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/configuration/GetCategoryID');
        }

        function GetMailChimpDetails() {
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/configuration/GetMailChimpDetails');
        }

        var contentServiceMethods = {
            GetHomepageDealContent: GetHomepageDealContent,
            GetDeliverySettings: GetDeliverySettings,
            GetHomepagePromoContent: GetHomepagePromoContent,
            GetCategoryID: GetCategoryID,
            GetMailChimpDetails: GetMailChimpDetails
        };

        return contentServiceMethods;
    }

    module.factory(serviceID, contentService);
    contentService.$inject = ['CommonService'];

}());