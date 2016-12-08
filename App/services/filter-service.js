(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "FilterService";
    var filterListCollection = undefined;
    //instantiate factory
    module.factory(serviceID, filterService);

    filterService.$inject = ['CommonService'];
    
    function filterService(common) {

        var filterServiceMethods = {
            // common angular dependencies
            FetchFilters: FetchFilters
        };

        function FetchFilters(vm) {
            if (filterListCollection !== undefined) {
                var deferred = common.$q.defer();
                deferred.resolve(setVMStateAfterFilterFetch(vm, filterListCollection));
                return deferred.promise;

            }
            else {
                return common.dataservice.getDataFromAPI('onlineorder/api/configuration/GetFilters')
                    .then(function (data) {
                        // sets the data to product list.
                        setVMStateAfterFilterFetch(vm, data);
                });
            }

        }

        function setVMStateAfterFilterFetch(vm, data) {
            vm.filterList = data;
            filterListCollection = data;
            // checks if filter list is defined or not empty.
            //also check to see if empty value passed in

            if (typeof vm.filterList !== 'undefined' && vm.filterList.length !== 0 && vm.filterList[0].name.length !== 0) {
                vm.hasFilters = true;
            } else {
                vm.hasFilters = false;
            }

            return vm.filterList;
        }

        return filterServiceMethods;

    }

}());