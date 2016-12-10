(function () {
    'use strict';

    var app = angular.module('main');

    function showCheckoutModalController($scope, $http, $q, $timeout, common, $modalInstance, $location, $rootScope, OPTIMISATION, cartInterfaceService, membershipService, storesService, addressService, contentService, googleMapService) {

        var vm = $scope.checkout;
        var checkOutVm = this;
        var googleMapMarkers = [];
        var map = null;
        var infowindow = null;
        var mapLocations = [];
        var bounds = null;
        var marker;
        checkOutVm.visibility = true;

        checkOutVm.map = {
            center: {
                latitude: 51.219053,
                longitude: 4.404418
            },
            zoom: 14,
            options:
            {
                scrollwheel: false
            }
        };

        checkOutVm.isShowMap = false;

        checkOutVm.user = '';

        checkOutVm.isLoading = false;

        checkOutVm.PickupOptions = vm.PickupOptions;
        checkOutVm.SelectedPickupOption = checkOutVm.PickupOptions.NOT_SET;

        checkOutVm.storeOderOptions = null;
        checkOutVm.pickupDates = [];
        checkOutVm.pickupHours = [];
        checkOutVm.pickupHoursTemp = [];
        checkOutVm.deliveryHours = [];
        checkOutVm.selectedDate = "";
        checkOutVm.selectedHour = "";
        checkOutVm.formatedSelectedTime = "";
        checkOutVm.storeOpenTime = "";
        checkOutVm.storeCloseTime = "";
        checkOutVm.currentStoreTime = "";
        checkOutVm.asapTime = "";
        checkOutVm.creditMessage = ""
        checkOutVm.isASAP = false;
        checkOutVm.isLater = false;
        checkOutVm.isNotAllowASAP = false;
        checkOutVm.isValidTimeSlot = true;
        checkOutVm.isMissingDeliveryTimeSlot = false;
        checkOutVm.reservedDeliveryTimeSlotId = 0;
        checkOutVm.isServiceNotAvailable = false;

        checkOutVm.validStores = true;
        checkOutVm.OrderOption = vm.OrderOption;
        checkOutVm.OrderClass = vm.OrderClass;
        checkOutVm.isPickup = false;
        checkOutVm.isDelivery = true;

        checkOutVm.stores = [];
        checkOutVm.store = {};
        checkOutVm.storeData = {};
        checkOutVm.isStoreClosed = false;
        checkOutVm.isBeforeOpenTime = false;
        checkOutVm.isDayClosed = false;
        checkOutVm.isAfterClosingTime = false;



        checkOutVm.totalPrice = vm.totalPrice = vm.data.basketTotal;
        checkOutVm.hasProductsInCart = vm.data.basketItems.length > 0;
        checkOutVm.deliveryPrice = vm.data.deliveryChargeAmount;
        checkOutVm.deliveryTotal = 0;
        checkOutVm.isAllowDelivery = true;

        checkOutVm.invalidBasketAmount = 1;
        checkOutVm.invalidProductsName = [];
        checkOutVm.invalidProducts = {};

        checkOutVm.customerAddress = "";
        checkOutVm.customerAddresses = {};
        checkOutVm.customerAddressData = "";
        checkOutVm.customerAddressWorking = "";
        checkOutVm.customerAddressPickup = "";
        checkOutVm.customerAddressModel = 0;

        checkOutVm.currentDeliveryOrderOption = {
            storeid: 0,
            datetime: ''
        };

        vm.common.scrollScreenUp();

        checkOutVm.ResetForm = function () {
            checkOutVm.invalidBasketAmount = 1;
            checkOutVm.invalidProductsName = [];
            checkOutVm.invalidProducts = {};
            checkOutVm.stores = [];
            checkOutVm.store = {};

            $scope.store = '';
            $scope.district = '';
            $scope.userAddress = '';

            checkOutVm.customerAddresses = {};
            checkOutVm.customerAddress = '';
            checkOutVm.customerAddressData = "";
            checkOutVm.customerAddressWorking = "";
            checkOutVm.customerAddressPickup = "";
            checkOutVm.isMissingDeliveryTimeSlot = false;
            checkOutVm.isServiceNotAvailable = false;

            $scope.pickup.$setPristine();
            $scope.pickup.$setUntouched();
            $scope.pickup.$invalid = true;

            checkOutVm.pickupDates = [];
            checkOutVm.pickupHours = [];
            checkOutVm.selectedDate = "";
            checkOutVm.selectedHour = "";

            checkOutVm.isValidTimeSlot = true;

            checkOutVm.isShowMap = false;

        }

        checkOutVm.ResetStoreAttribute = function () {
            vm.storeId = 0;
            vm.selectedStore = {};
            checkOutVm.store = {};
            checkOutVm.storeOderOptions = null;
            checkOutVm.storeData = {};
            checkOutVm.invalidBasketAmount = 1;
            checkOutVm.invalidProductsName = [];
            checkOutVm.invalidProducts = {};
            checkOutVm.pickupDates = [];
            checkOutVm.isStoreClosed = false;
            checkOutVm.isBeforeOpenTime = false;
            checkOutVm.isAfterClosingTime = false;
            checkOutVm.isDayClosed = false;
            checkOutVm.isServiceNotAvailable = false;
            checkOutVm.isValidTimeSlot = true;
            checkOutVm.validStores = true;
            checkOutVm.currentDeliveryOrderOption.storeid = 0;
            checkOutVm.currentDeliveryOrderOption.datetime = '';
        }

        checkOutVm.Close = function () {
            vm.modalStep1.close();
        }

        checkOutVm.GetCurrentLoggedInCustomer = function () {
            membershipService.GetCurrentLoggedInCustomer()
                            .then(function (response) {
                                if (response != null && response.status < 400) {
                                    vm.isLoggedIn = true;
                                    checkOutVm.user = response;
                                    vm.user = response;
                                }
                                else {
                                    vm.isLoggedIn = false;
                                }
                            });
        }

        checkOutVm.GetStore = function (key) {
            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });

            checkOutVm.isMissingDeliveryTimeSlot = false;

            checkOutVm.ResetStoreAttribute();

            if (key !== "" || key.hasOwnProperty("addressId")) {
                var service;

                switch (typeof key) {

                    case 'object':
                        service = storesService.GetStoreByAddress(key);
                        break;

                    case 'string':
                    default:
                        service = storesService.GetStoreByDistrict(key);
                        break;
                }

                return service
                    .then(function (data) {
                        $scope.store = '';
                        $scope.pickup.storeId.$setPristine();
                        $scope.pickup.storeId.$setUntouched();

                        checkOutVm.validStores = data.storeList.length > 0;

                        if (data.storeList.length > 0) {
                            checkOutVm.stores = data.storeList;
                            checkOutVm.creditMessage = data.creditMessage;
                            var i = 0;
                        }
                        else {
                            checkOutVm.stores = [];
                            checkOutVm.store = {};
                            $scope.pickup.storeId.$setPristine();
                            $scope.pickup.storeId.$setUntouched();
                            $scope.pickup.storeId.$invalid = false;
                        }

                        googleMapService.Initialise()
                            .then(function () {
                                checkOutVm.RenderGoogleMap(checkOutVm.stores);
                            });

                        return;
                    })
                    .finally(function () {
                        $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                    });
            }
            else {
                checkOutVm.stores = [];
            }

            return;
        }

        checkOutVm.selectFirstStore = function (firstStoreId) {
            var sel = document.getElementById('ChooseStore2CooseStore');
            var opts = sel.options;
            for (var opt, j = 0; opt = opts[j]; j++) {
                if (opt.value == firstStoreId) {
                    sel.selectedIndex = j;
                    break;
                }
            }
        }

        checkOutVm.ChangeStore = function (store) {
            checkOutVm.invalidProductsName = [];
            checkOutVm.isMissingDeliveryTimeSlot = false;

            if (typeof store !== "undefined") {
                vm.selectedStoreName = store.storeName;
                vm.storeId = store.storeId;
                vm.selectedStore = store;
                vm.CheckoutService.AddStoreInfoStorage(store);
                checkOutVm.invalidBasketAmount = 0;
                //checkOutVm.isServiceNotAvailable = true;
                checkOutVm.pickupDates = [];

                $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });
                storesService.GetStoreDetail(vm.storeId, vm.OrderOption, "")
                    .then(function (data) {
                        if (data.hasOwnProperty('storeDetail')) {

                            checkOutVm.storeOderOptions = data.storeOderOptions;
                            checkOutVm.storeData = data;
                            checkOutVm.isServiceNotAvailable = checkOutVm.storeOderOptions !== null && checkOutVm.storeOderOptions.storeOrderOptions.length === 0 || (checkOutVm.isDelivery && !checkOutVm.storeData.storeDetail.storeAllowsDelivery);

                            checkOutVm.store = store;


                            if (data.storeOderOptions.hasOwnProperty('storeOrderOptions')) {
                                checkOutVm.store = vm.selectedStore = data.storeDetail.store;
                                checkOutVm.DefaultDateAndTime(data);

                                if (checkOutVm.isNotAllowASAP) {
                                    checkOutVm.SetPickupOtptionLater();
                                    checkOutVm.ChangeDate();
                                } else {
                                    checkOutVm.SetPickupOptionASAP();
                                }

                            } else {
                                checkOutVm.SetInvalidTimeSlot();
                            }

                            if (checkOutVm.isDelivery) {
                                $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });
                                var formatedDeliveryDate = checkOutVm.selectedDate; //formatedDateStoreOrderOptions//moment().format("YYYY-MM-DDT00:00:00");
                                checkOutVm.isValidTimeSlot = true;

                                if (checkOutVm.currentDeliveryOrderOption.storeid == 0 || checkOutVm.currentDeliveryOrderOption.storeid != vm.storeId || checkOutVm.currentDeliveryOrderOption.datetime != formatedDeliveryDate) {

                                    checkOutVm.currentDeliveryOrderOption.storeid = vm.storeId;
                                    checkOutVm.currentDeliveryOrderOption.datetime = formatedDeliveryDate;

                                    storesService.GetStoreDeliveryOption(vm.storeId, formatedDeliveryDate)
                                    .then(function (data) {
                                        checkOutVm.SetDeliveryAttribute(data);
                                    })
                                    .finally(function () {
                                        $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                                    });
                                }
                                else {
                                    $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                                }
                            } else {
                                $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                            }

                            checkOutVm.isStoreClosed = checkOutVm.isDayClosed || checkOutVm.isAfterClosingTime || checkOutVm.isBeforeOpenTime;
                        }
                    });

            } else {
                checkOutVm.ResetStoreAttribute();
            }
        }

        checkOutVm.ShowInfoWindowMap = function (store) {
            var markerIndex = checkOutVm.stores.map(function (st) {
                return st.storeId;
            }).indexOf(vm.selectedStore.storeId);

            google.maps.event.trigger(googleMapMarkers[markerIndex], 'click');
        }

        checkOutVm.ChangeDate = function (isDropdown) {

            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });
            switch (checkOutVm.OrderOption) {
                case checkOutVm.OrderClass.Delivery:
                    var formatedDeliveryDate = checkOutVm.selectedDate;
                    if (checkOutVm.currentDeliveryOrderOption.storeid == 0 || checkOutVm.currentDeliveryOrderOption.storeid != vm.storeId || checkOutVm.currentDeliveryOrderOption.datetime != formatedDeliveryDate) {
                        checkOutVm.currentDeliveryOrderOption.storeid = vm.storeId;
                        checkOutVm.currentDeliveryOrderOption.datetime = formatedDeliveryDate;

                        storesService.GetStoreDeliveryOption(vm.storeId, formatedDeliveryDate)
                            .then(function (data) {
                                checkOutVm.SetDeliveryAttribute(data);
                            })
                            .finally(function () {
                                $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                            });
                    }
                    else {
                        $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                    }

                    if (isDropdown) {
                        checkOutVm.isMissingDeliveryTimeSlot = false;
                    }

                    break;
                case checkOutVm.OrderClass.Collection:
                default:
                    storesService.GetStoreOrderOption(vm.storeId, vm.OrderOption, checkOutVm.selectedDate)
                        .then(function (data) {
                            if (data != null && data.length > 0) {
                                checkOutVm.pickupHours = data;
                                checkOutVm.selectedHour = data[0].timeValue;
                            }
                            else {
                                checkOutVm.pickupHours = [];
                                checkOutVm.selectedHour = "";
                                checkOutVm.formatedSelectedTime = "";
                            }
                            checkOutVm.ChangeHour();
                            checkOutVm.SetInvalidTimeSlot();
                        })
                        .finally(function () {
                            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                        });
                    break;
            }
        }

        checkOutVm.ChangeHour = function () {
            checkOutVm.formatedSelectedTime = vm.formatedSelectedTime = checkOutVm.selectedHour;
        }

        checkOutVm.SetDeliveryAttribute = function (data) {
            if (data.responseMessage !== "DELIVERY_TIME_SLOTS_NOT_FOUND") {
                checkOutVm.deliveryHours = data.formatedTimeStoreOrderOptions;
                checkOutVm.selectedHour = data.formatedTimeStoreOrderOptions != null && data.formatedTimeStoreOrderOptions.length > 0 ? data.formatedTimeStoreOrderOptions[0].timeValue : "";
            }
            else {
                checkOutVm.pickupHours = [];
                checkOutVm.selectedHour = "";
                checkOutVm.formatedSelectedTime = "";
            }
            checkOutVm.SetInvalidTimeSlot();
            checkOutVm.ChangeHour();
        }

        checkOutVm.DefaultDateAndTime = function (data) {
            var openTimeString = checkOutVm.isDelivery ? checkOutVm.store.openingHours[0].deliveryTimePeriods[0].openTime : checkOutVm.store.openingHours[0].collectionTimePeriods[0].openTime;
            var closingTimeString = checkOutVm.isDelivery ? checkOutVm.store.openingHours[0].deliveryTimePeriods[0].closeTime : checkOutVm.store.openingHours[0].collectionTimePeriods[0].closeTime;
            var storeOpenTimeObj = moment(moment().format("YYYY-MM-DD") + "T" + openTimeString);
            var storeCloseTimeObj = moment(moment().format("YYYY-MM-DD") + "T" + closingTimeString);

            if (storeCloseTimeObj.isBefore(storeOpenTimeObj)) {
                storeCloseTimeObj = storeCloseTimeObj.add(1, "d");
            }

            checkOutVm.pickupDates = data.formatedDateStoreOrderOptions != null && data.formatedDateStoreOrderOptions.length > 0 ? data.formatedDateStoreOrderOptions : [];
            checkOutVm.pickupHours = data.formatedTimeStoreOrderOptions != null && data.formatedTimeStoreOrderOptions.length > 0 ? data.formatedTimeStoreOrderOptions : [];


            checkOutVm.storeOpenTime = storeOpenTimeObj.format();
            checkOutVm.storeCloseTime = storeCloseTimeObj.format();

            checkOutVm.currentStoreTime = data.storeOderOptions.storeLocalisedDateTime.length > 0 ? data.storeOderOptions.storeLocalisedDateTime : "";

            checkOutVm.selectedDate = data.formatedDateStoreOrderOptions != null && data.formatedDateStoreOrderOptions.length > 0 ? data.formatedDateStoreOrderOptions[0].dateValue : "";
            checkOutVm.selectedHour = data.formatedTimeStoreOrderOptions != null && data.formatedTimeStoreOrderOptions.length > 0 ? data.formatedTimeStoreOrderOptions[0].timeValue : "";
            checkOutVm.asapTime = data.formatedTimeStoreOrderOptions != null && data.formatedTimeStoreOrderOptions.length > 0 ? data.formatedTimeStoreOrderOptions[0].timeValue : "";

            checkOutVm.SetInvalidTimeSlot();
        }

        checkOutVm.SetInvalidTimeSlot = function () {
            checkOutVm.isBeforeOpenTime = (moment(checkOutVm.currentStoreTime) < moment(checkOutVm.storeOpenTime));
            checkOutVm.isAfterClosingTime = (moment(checkOutVm.currentStoreTime) > moment(checkOutVm.storeCloseTime));
            checkOutVm.isDayClosed = !checkOutVm.store.openingHours[0].storeOpen;
            checkOutVm.isNotAllowASAP = checkOutVm.isBeforeOpenTime || checkOutVm.isAfterClosingTime || checkOutVm.storeData.formatedTimeStoreOrderOptions === null;

            checkOutVm.isValidTimeSlot = checkOutVm.selectedHour.length > 0;
            checkOutVm.isServiceNotAvailable = checkOutVm.storeOderOptions !== null && checkOutVm.storeOderOptions.storeOrderOptions.length === 0 || (checkOutVm.isDelivery && !checkOutVm.storeData.storeDetail.storeAllowsDelivery);

            return null;
        }

        checkOutVm.RemoveInvalidProductFromBasket = function () {
            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });
            storesService.RemoveProductsFromBasket(checkOutVm.invalidProducts)
                .then(function (data) {
                    if (data.basketId > 0) {
                        $rootScope.$broadcast(RELOAD_MYCART);
                        checkOutVm.invalidProductsName = [];
                        checkOutVm.invalidProducts = {};
                        checkOutVm.invalidBasketAmount = 0;
                        checkOutVm.totalPrice = vm.totalPrice = data.basketTotal;
                        checkOutVm.hasProductsInCart = data.basketItems.length > 0;

                        checkOutVm.deliveryTotal = parseFloat(checkOutVm.totalPrice) + (parseFloat(vm.DeliveryFee) > 0 ? parseFloat(vm.DeliveryFee) : 0);
                        checkOutVm.isAllowDelivery = checkOutVm.deliveryTotal >= vm.MinimumDeliveryOrderAmount;

                        if (!checkOutVm.isAllowDelivery) {
                            checkOutVm.ResetForm();
                        }
                    }
                })
                .finally(function () {
                    $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                });
        }

        checkOutVm.showModal = vm.checkoutOptionShowModal;

        checkOutVm.Continue = function () {
            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });

            vm.data.OrderOption = vm.OrderOption;
            vm.data.storeId = vm.storeId;
            vm.data.orderTime = vm.formatedSelectedTime;
            vm.data.deliveryAddress = vm.selectedUserAddressModel;
            vm.data.orderTimeString = checkOutVm.formatedSelectedTime;
            vm.data.storeName = vm.selectedStoreName;
            vm.data.UserAgent = navigator.userAgent;

            vm.CheckoutService.InitCheckout(vm.data).then(function (response) {
                if (response.status < 400 && response.data != null && response.data != undefined) {

                    checkOutVm.invalidBasketAmount = response.data.productNotAvailable.numberOfUnavailableProductInBasket;
                    checkOutVm.invalidProducts = response.data.productNotAvailable.unavailableBasketItemModels;

                    if (checkOutVm.invalidBasketAmount === 0) {

                        vm.totalPrice = response.data.totalOrder;

                        if (checkOutVm.isDelivery) {
                            if (response.data.isTimeSlotReserved) {
                                checkOutVm.SetReservedTimeSlot(response.data.timeSlotId);
                            }
                            else {
                                checkOutVm.isMissingDeliveryTimeSlot = true;
                                checkOutVm.ChangeDate();
                                $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                                return;
                            }
                        }

                        vm.showPayment(vm.data);
                    }
                    else {
                        $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                        return;
                    }
                }
                else {
                    vm.common.validateResponse(response);
                    checkOutVm.Close();
                }
            }).finally(function () {
                if (checkOutVm.invalidBasketAmount > 0) {
                    for (var i = 0; i < checkOutVm.invalidProducts.length; i++) {
                        var productname = checkOutVm.invalidProducts[i].description.trim();
                        var isProductNameExistInContainer = checkOutVm.invalidProductsName.filter(function (val) {
                            return val === productname;
                        });
                        if (isProductNameExistInContainer.length === 0) {
                            checkOutVm.invalidProductsName.push(productname);
                        }
                    }
                }
                
            });

        }

        checkOutVm.SetPickupOptionASAP = function () {
            checkOutVm.SelectedPickupOption = checkOutVm.PickupOptions.ASAP;
            checkOutVm.SetPickupCondition();
            checkOutVm.formatedSelectedTime = checkOutVm.selectedHour = vm.formatedSelectedTime = checkOutVm.asapTime;
            checkOutVm.SetInvalidTimeSlot();
        }

        checkOutVm.SetReservedTimeSlot = function (id) {
            checkOutVm.reservedDeliveryTimeSlotId = vm.reservedDeliveryTimeSlotId = id;
        }

        checkOutVm.SetPickupOtptionLater = function () {
            checkOutVm.SelectedPickupOption = checkOutVm.PickupOptions.LATER;
            checkOutVm.SetPickupCondition();

            checkOutVm.DefaultDateAndTime(checkOutVm.storeData);
            checkOutVm.SetInvalidTimeSlot();

        }

        checkOutVm.SetPickupCondition = function () {
            checkOutVm.isASAP = checkOutVm.SelectedPickupOption === checkOutVm.PickupOptions.ASAP;
            checkOutVm.isLater = checkOutVm.SelectedPickupOption === checkOutVm.PickupOptions.LATER;
        }
        checkOutVm.SetPickup = function () {
            checkOutVm.visibility = true;
            checkOutVm.ResetStoreAttribute();
            checkOutVm.OrderOption = vm.OrderClass.Collection;
            vm.OrderOption = vm.OrderClass.Collection;

            checkOutVm.ResetForm();
            checkOutVm.SetOrderOptionCondition();
        }

        checkOutVm.SetDelivery = function () {
            $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: true });
            checkOutVm.visibility = false;
            contentService.GetDeliverySettings()
                .then(function (data) {
                    checkOutVm.ResetStoreAttribute();
                    vm.MinimumDeliveryOrderAmount = data.minimumDeliveryOrderAmount;
                    vm.DeliveryFee = data.deliveryFee;
                    checkOutVm.deliveryTotal = parseFloat(checkOutVm.totalPrice.replace(',', '')) + parseFloat(vm.DeliveryFee);
                    checkOutVm.isDelivery = vm.isDelivery = true;
                    checkOutVm.isAllowDelivery = checkOutVm.deliveryTotal >= vm.MinimumDeliveryOrderAmount;
                    checkOutVm.OrderOption = vm.OrderClass.Delivery;
                    vm.OrderOption = vm.OrderClass.Delivery;

                    checkOutVm.ResetForm();
                    checkOutVm.SetOrderOptionCondition();
                })
                .finally(function () {
                    $rootScope.$broadcast(CHECKOUT_LOADING, { isLoading: false });
                });
        }

        checkOutVm.SetOrderOptionCondition = function () {
            checkOutVm.isPickup = checkOutVm.OrderOption === checkOutVm.OrderClass.Collection;
            checkOutVm.isDelivery = checkOutVm.OrderOption === checkOutVm.OrderClass.Delivery;
        }

        checkOutVm.onAddressFind = function () {
            checkOutVm.customerAddressData = addressService.GetAddressTypeAhead(checkOutVm.customerAddressWorking);
            return checkOutVm.customerAddressData;
        }

        checkOutVm.ResetOnInvalid = function (isValid) {
            if (!isValid) {
                checkOutVm.customerAddress = '';
            }
        }

        checkOutVm.onAddressSelected = function ($item, $model, $label) {
            if (typeof $item === 'undefined') {
                $item = '';
            }
            checkOutVm.customerAddress = $item;
            vm.selectedUserAddress = $item;
            if (vm.isLoggedIn) {
                checkOutVm.customerAddressModel = vm.selectedUserAddressModel = $model;
                checkOutVm.GetStoreByCustomerAddress();
            } else {
                addressService.GetAddressDetails($item)
                   .then(function (data) {
                       checkOutVm.customerAddressModel = vm.selectedUserAddressModel = data;
                       checkOutVm.GetStoreByCustomerAddress();
                   });
            }

        }

        checkOutVm.GetStoreByCustomerAddress = function () {
            checkOutVm.GetStore(checkOutVm.customerAddressModel).finally(function () {
                if (checkOutVm.stores.length == 1) {
                    $scope.store = checkOutVm.stores[0];
                    checkOutVm.selectFirstStore(checkOutVm.stores[0].storeId);
                    checkOutVm.ChangeStore(checkOutVm.stores[0])
                    checkOutVm.ShowInfoWindowMap(checkOutVm.stores[0]);
                }
            });
        }

        checkOutVm.GetStoreByDistrict = function (district) {

            checkOutVm.GetStore(district).finally(function () {
                if (checkOutVm.stores.length == 1) {
                    $scope.store = checkOutVm.stores[0];
                    checkOutVm.selectFirstStore(checkOutVm.stores[0].storeId);
                    checkOutVm.ChangeStore(checkOutVm.stores[0])
                    checkOutVm.ShowInfoWindowMap(checkOutVm.stores[0]);
                }
            });
        }

        checkOutVm.AddProductCancelCheckout = function () {
            checkOutVm.Close();

            /* commented due to uncertain decision
            $location.path("/order");
            $location.url($location.path());
            */
        }

        checkOutVm.RenderGoogleMap = function () {
            var center = new google.maps.LatLng(-36.852443, 174.763721);

            googleMapMarkers = []; //purge markers

            /* Settings */
            // Custom image marker
            // image = "assets/img/custom_icon.png"

            //mapTypeId: google.maps.MapTypeId.ROADMAP,
            //scrollwheel: true,
            //zoomControl: true,
            //zoomControlOptions: {
            //    style: google.maps.ZoomControlStyle.SMALL
            //}

            var mapOptions = {
                zoom: 12,
                center: center,
                mapTypeControl: false,
                streetViewControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE
                }

            };

            map = new google.maps.Map(document.getElementById('map'), mapOptions);

            infowindow = new google.maps.InfoWindow();

            bounds = new google.maps.LatLngBounds();

            checkOutVm.ConstructMapStoreLocation();

            var listenerHandle = google.maps.event.addListener(map, 'bounds_changed', function () {
                map.fitBounds(bounds);
            });

            for (var i = 0; i < mapLocations.length; i++) {

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(mapLocations[i][1], mapLocations[i][2]),
                    map: map,
                    // icon: image
                });

                bounds.extend(marker.position);

                google.maps.event.addListener(marker, "click", (function (marker, i) {
                    return function (e) {
                        e = e || window.event;
                        google.maps.event.removeListener(listenerHandle);
                        infowindow.setContent(mapLocations[i][0]);
                        infowindow.open(map, marker);
                        map.panTo(marker.position);
                        map.setZoom(17);
                        $scope.store = mapLocations[i][3];

                        if (typeof e !== 'undefined' && !e.srcElement) {
                            checkOutVm.ChangeStore(mapLocations[i][3]);
                        }
                    };
                })(marker, i));

                googleMapMarkers.push(marker);
            }

            google.maps.event.addListener(infowindow, "closeclick", function () {
                map.panTo(bounds.getCenter());
                map.fitBounds(bounds);
                checkOutVm.ResetStoreAttribute();
                $scope.store = null;
                $scope.pickup.storeId.$setTouched();
                google.maps.event.removeListener(listenerHandle);
            });

            google.maps.event.addListener(map, "click", function () {
                google.maps.event.removeListener(listenerHandle);
            });

            google.maps.event.addListener(map, "dragstart", function () {
                google.maps.event.removeListener(listenerHandle);
            });

            google.maps.event.addListener(map, "resize", function () {
                map.panTo(bounds.getCenter());
                map.fitBounds(bounds);
            });

            if (mapLocations.length > 0) {
                map.fitBounds(bounds);
            }
        }

        checkOutVm.ShowMapToggle = function () {
            if (map !== null) {
                checkOutVm.SetMapVisibility()
                    .then(function (data) {

                        if (data.isVisble) {
                            checkOutVm.RenderGoogleMap();
                            if ($scope.store) {
                                checkOutVm.ShowInfoWindowMap();
                            } else {
                                google.maps.event.trigger(map, "resize");
                            }
                        }

                    });
            }
        }

        checkOutVm.SetMapVisibility = function () {
            var deferred = $q.defer();
            var mapElement = document.getElementById('map');
            checkOutVm.isShowMap = !checkOutVm.isShowMap;

            $timeout(function () {
                var isVisible = mapElement.clientHeight > 0;
                if (isVisible) {
                    deferred.resolve({ message: "map visible", isVisble: true });
                } else {
                    deferred.reject({ message: "map not visible", isVisble: false });
                }
            }, 600);
            return deferred.promise;
        }

        checkOutVm.ConstructMapStoreLocation = function () {
            var result = [];

            angular.forEach(checkOutVm.stores, function (val) {

                var marker = [];
                var addreesBuilding = val.storeAddress.buildingName.length > 0 ? val.storeAddress.buildingName + ", " : "";
                var addressNumber = val.storeAddress.buildingNumber.length > 0 && val.storeAddress.buildingNumber !== "0" ? val.storeAddress.buildingNumber + " " : "";
                var addressStreet = val.storeAddress.streetName.length > 0 ? val.storeAddress.streetName + ", " : "";
                var addresDistrict = val.storeAddress.district.length > 0 ? val.storeAddress.district + ", " : "";
                var addressTown = val.storeAddress.townCity;

                marker.push('<h5>' + val.storeName + '</h5><p>' + addreesBuilding + addressNumber + addressStreet + addresDistrict + addressTown + '</p>');
                marker.push(val.storeAddress.latitude);
                marker.push(val.storeAddress.longitude);
                marker.push(val);

                result.push(marker);
            });
            mapLocations = result;
        }

        checkOutVm.GetCurrentLoggedInCustomer();

        $scope.$on(CHECKOUT_LOADING, function (event, args) {
            checkOutVm.isLoading = args.isLoading;
        });

        $scope.$on('SHOW_STEP1_MODAL', function (event, args) {
            checkOutVm.showModal = args.showModal;
        });

        $scope.$on('CLOSE_STEP1_MODAL', function (event, args) {
            vm.modalStep1.close();
        });

        var i = 0;
    }

    var controllerId = 'rbShowCheckoutModal.controller';
    app.controller(controllerId, showCheckoutModalController);
    showCheckoutModalController.$inject = ['$scope', '$http', '$q', '$timeout', 'CommonService', '$modal', '$location', '$rootScope', 'OPTIMISATION', 'CartInterfaceService', 'MembershipService', 'StoresService', 'AddressService', 'ContentService', 'GoogleMapService'];
}());