(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "AddressService";

    //instantiate factory
    module.factory(serviceID, addressService);

    addressService.$inject = ['CommonService'];

    function addressService(common) {

        var addressServiceMethods = {
            GetAddressTypeAhead: GetAddressTypeAhead,
            GetAddressDetails: GetAddressDetails
        };

        function GetAddressTypeAhead(addressText) {
            var params = {
                params: {
                    address: addressText
                }
            };
            return common.dataservice.getDataFromAPI('onlineorder/api/address/getAddressTypeAhead', params);
        }

        function GetAddressDetails(vm) {
            var value;

            switch (typeof vm) {
                case 'string':
                    value = vm;
                    break;

                case 'object':
                    value = vm.model.customerAddress;
                    break; 

                default:
                    value = {};
            }



            var addressParams = {
                params: {
                    address: value
                }
            };

            // break down address.
            return common.dataservice.getDataFromAPI('onlineorder/api/address/getAddressdetails', addressParams);
        }



        return addressServiceMethods;

    }

}());
