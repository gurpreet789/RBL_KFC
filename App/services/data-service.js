(function () {
    'use strict';

    var module = angular.module('rbData.service', []);

    //instantiate the factoryID
    var serviceId = 'DataService';

    //instantiate factory
    module.factory(serviceId, dataservice);

    dataservice.$inject = ['$http', '$log'];

    // Dataservice generic method
    function dataservice($http, $log) {

        var vm = this;
        vm.apiString = '';

        //revealing module pattern
        return {
            getStaticPage: getStaticPage,
            getDataFromAPI: getDataFromAPI,
            postDataToAPI: postDataToAPI,
        };

        // execute get data from api controller
        function getDataFromAPI(apiString, params) {
            //$log.logDebug(serviceId + ' getDataFromAPI', 'Executing [apiString: %s, params: %s ]', [apiString, JSON.stringify(params)]);

            vm.apiString = apiString;
            return $http.get(apiString, params)
                .then(onAPIDataFetchComplete)
                .catch(onAPIDataFetchFailed);

            // success
            function onAPIDataFetchComplete(response) {
                //$log.logDebug(serviceId + ' getDataFromAPI', 'Received response from API [response.data: %s ]', [JSON.stringify(response.data)]);

                if (!response.data || response.data.length === 0) {
                    //$log.logWarn(serviceId + ' getDataFromAPI', 'there is no data returned for %s call', [vm.apiString]);
                }

                return response.data;
            }

            // fail
            function onAPIDataFetchFailed(error) {
                //$log.logError(serviceId + ' getDataFromAPI', 'XHR Failed for api call %s %s', [vm.apiString, error.data]);
                return error;
            }
        }

        // execute get static page
        function getStaticPage(staticPagePath) {
            $log.logDebug(serviceId + ' getStaticPage', 'Executing [staticPagePath: %s]', [staticPagePath]);
            
            // Get the HTML content from HTML file.
            return $http.get(staticPagePath)
                .then(onStaticPageFetchComplete)
                .catch(onStaticPageFetchFailed);

            // on success
            function onStaticPageFetchComplete(response) {
                $log.logDebug(serviceId + ' getStaticPage', 'Received response');

                if (!response.data || response.data.length === 0) {
                    $log.logWarn(serviceId + ' getStaticPage', 'Static page %s exists but empty', [staticPagePath]);
                }

                return response.data;
            }

            // on failure
            function onStaticPageFetchFailed(error) {
                $log.logError(serviceId + ' getStaticPage', 'Failed to get static page %s. Error: %s' , [staticPagePath, error.data]);
            }
        }

        // execute post data to api controller
        function postDataToAPI(apiString, data, params) {
            //$log.logDebug(serviceId + ' postDataToAPI', 'Executing [apiString: %s, data: %s, params: %s ]', [apiString, JSON.stringify(data), JSON.stringify(params)]);

            vm.apiString = apiString;
            return $http.post(apiString, data, params)
                .then(onAPIDataFetchComplete)
                .catch(onAPIDataFetchFailed);

            // success
            function onAPIDataFetchComplete(response) {
                //$log.logDebug(serviceId + ' postDataToAPI', 'Received response from API [response: %s ]', [JSON.stringify(response)]);

                return response;
            }

            // fail
            function onAPIDataFetchFailed(error) {
                //$log.logError(serviceId + ' postDataToAPI', 'XHR Failed for api call %s %s', [vm.apiString, error]);
                return error;
            }
        }
    }

}());