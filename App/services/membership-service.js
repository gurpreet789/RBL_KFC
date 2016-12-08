(function () {
    'use strict';

    var module = angular.module('main');
    var serviceID = "MembershipService";
    var CustomerName = null;
    var isUserLoggedIn = false;
    //instantiate factory
    module.factory(serviceID, membershipService);

    membershipService.$inject = ['CommonService', '$state', 'CONSTANT1'];

    function membershipService(common, $state, cookie) {

        var membershipServiceMethods = {
            Login: Login,
            Logout: Logout,
            IsLoggedIn: IsLoggedIn,
            RegisterUser: RegisterUser,
            ForgotPassword: ForgotPassword,
            ResetPassword: ResetPassword,
            GetCurrentLoggedInCustomer: GetCurrentLoggedInCustomer,
            RouteAuthenication: RouteAuthenication
        };
        function RouteAuthenication(state) {

            return IsLoggedIn().then(
                function (data) {
                    if (data.isUserLoggedIn) {
                        return common.$q.when();
                    }
                    else {
                        if (data.isSessionAlive) {
                            // display error
                            common.displayError("Customer Not Logged In.");
                        } else {
                            // display error
                            common.displayError("Session is Timed Out.");
                        }
                        common.$timeout(function () {
                            // This code runs after the authentication promise has been rejected.
                            $state.go(state);
                        });
                        // Reject the authentication promise to prevent the state from loading
                        return common.$q.reject();
                    }
                });
        }


        function Login(_username, _password, _rememberMe) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            var userData = {
                username: _username,
                password: _password,
                rememberMe: _rememberMe
            };
            return common
                .dataservice
                .postDataToAPI("onlineorder/api/customer/login", userData, params).then(
                function (response) {
                    if (response.status >= 400) {
                        isUserLoggedIn = false;
                    } else {
                        if (response.data != null && response.data != undefined) {
                            isUserLoggedIn = true;
                            CustomerName = response.data.firstName;
                        }
                        else {
                            isUserLoggedIn = false;
                        }

                    }
                    return response;
                });
        }

        function Logout() {
            return common
                .dataservice
                .postDataToAPI('onlineorder/api/customer/logOut', '', '').then(function (response) {
                    if (response.status === 200) {
                        isUserLoggedIn = false;
                        CustomerName = null;
                    }
                    Cookies.expire(cookie);

                    return response;
                });
        }

        function IsLoggedIn() {
            var customResponse = {}
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            return common
               .dataservice
               .postDataToAPI('onlineorder/api/customer/IsLoggedIn', '', params)
               .then(function (response) {
                   if (response.status >= 400 || response==null || response.data == null || response == undefined || response.data == undefined) {
                       isUserLoggedIn = false;
                       CustomerName = null;
                   }

                   isUserLoggedIn = common.isLoggedIn = angular.lowercase(response.data[0]) === "true";
                   CustomerName = isUserLoggedIn ? response.data[1] : CustomerName;


                   customResponse.status = response.status;
                   customResponse.isUserLoggedIn = isUserLoggedIn;
                   customResponse.CustomerName = CustomerName;
                   customResponse.isSessionAlive = isUserLoggedIn ? angular.lowercase(response.data[2]) === "true" : false;
                   return customResponse;

               });
        }

        function RegisterUser(vm) {
            var dataRegister = setCustomerDataThroughModel(vm);
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            return common
                  .dataservice
                  .postDataToAPI('onlineorder/api/customer/createLogin', dataRegister, params);
        }

        function setCustomerDataThroughModel(vm) {
            var dataRegister = undefined;

            if (vm.model.customerAddress !== null && vm.model.customerAddress !== '' && vm.model.customerAddress !== undefined) {
                // data model.
                dataRegister = {
                    customerModel: {
                        firstName: vm.model.firstName,
                        lastName: vm.model.lastName,
                        contactTelephonePrimary: vm.model.phone,
                        contactEmailPrimary: vm.model.email,
                        marketingOptIn: vm.model.checkoutDiscount
                    },
                    customerAddress: {
                        unit: vm.model.customerAddressData.unit,
                        streetNumber: vm.model.customerAddressData.streetNumber,
                        buildingLetter: vm.model.customerAddressData.buildingLetter,
                        streetName: vm.model.customerAddressData.streetName,
                        city: vm.model.customerAddressData.city,
                        district: vm.model.customerAddressData.district,
                        postCode: vm.model.customerAddressData.postCode,
                        tradeZoneID: vm.model.customerAddressData.tradeZoneID
                    },
                    password: vm.model.password,
                    repeatPassword: vm.model.repeatPassword,
                    repeatEmail: vm.model.repeatEmail
                };
            }
            else {
                // data model.
                dataRegister = {
                    customerModel: {
                        firstName: vm.model.firstName,
                        lastName: vm.model.lastName,
                        contactTelephonePrimary: vm.model.phone,
                        contactEmailPrimary: vm.model.email,
                        marketingOptIn: vm.model.checkoutDiscount
                    },
                    customerAddress: null,
                    password: vm.model.password,
                    repeatPassword: vm.model.repeatPassword,
                    repeatEmail: vm.model.repeatEmail
                };
            }

            return dataRegister;
        }

        function ForgotPassword(email) {
            var params = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            var data = {
                contactEmailPrimary: email
            };

            return common
                .dataservice
                .postDataToAPI('onlineorder/api/customer/forgotPassword', data, params);

        }

        function ResetPassword(request) {
            var params = {
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            return common
                .dataservice
                .postDataToAPI('onlineorder/api/customer/resetpassword', request, params);

        }

        return membershipServiceMethods;

        function GetCurrentLoggedInCustomer() {
            var checkIsLoggedIn = function () {
                return IsLoggedIn().then(function (response) {
                    response.isUserLoggedIn = (response.status >= 400) ? false : response.isUserLoggedIn;
                    return response.isUserLoggedIn;
                });
            },
            getCurrentLoggedInCustomer = function (isUserLoggedIn) {
                if (!isUserLoggedIn) {
                    return null;
                }

                return common.dataservice.getDataFromAPI('onlineorder/api/customer/LoggedInCustomer').then(function (response) {
                    if (response.status >= 400) {
                        return null;
                    }

                    return response;
                });
            };

            return checkIsLoggedIn().then(getCurrentLoggedInCustomer);
        }

    }

}());