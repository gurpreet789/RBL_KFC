(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "voucherService";

    //instantiate factory
    module.factory(serviceID, voucherService);

    voucherService.$inject = ['CommonService'];

    function voucherService(common) {

        var voucherServiceMethods = {
            // common angular dependencies
            applyVoucher: applyVoucher,
            removeVoucher: removeVoucher
        };
        function applyVoucher(voucherCode) {
            var params = {
                params: {
                    voucherCode: voucherCode
                }
            };
           return common
               .dataservice
               .getDataFromAPI('onlineorder/api/Voucher/ApplyVoucher', params)
               .then(function (response) {
                   if (response.status >= 400) {
                       common.validateResponse(response);
                   }
                   return response;
               });
        }
        function removeVoucher(voucherCode) {
            var params = {
                params: {
                    voucherCode: voucherCode
                }
            };
            return common
                .dataservice
                .getDataFromAPI('onlineorder/api/Voucher/RemoveVoucher', params)
                .then(function (response) {
                    if (response.status >= 400) {
                        common.validateResponse(response);
                    }
                    return response;
                });
        }
        return voucherServiceMethods;
    }

}());