(function () {
    'use strict';

    var app = angular.module('main');

    // declares controller id.
    var controllerId = 'rbRightHandPanel.controller';

    // registers controller.
    app.controller(controllerId, rightHandPanelController);

    // injects dependencies.
    rightHandPanelController.$inject = ['$scope', 'CommonService', 'CartInterfaceService', '$rootScope'];

    // buttons list
    var panelButtons = [
        {
            id: 1,
            cssClass: "tab-cart",
            image: "/Images/icon-cart-selected.svg",
            altImage: "mycart image",
            imageClass: "side-panel-icon-selected"
        },
        {
            id: 2,
            cssClass: "tab-customise-pizza",
            image: "/Images/icon-customise.svg",
            altImage: "customise image",
            imageClass: "side-panel-icon"
        }
    ];


    // angular controller for right hand panel.
    function rightHandPanelController($scope, common, cartInterfaceService, $rootScope) {
        var myCartButton = 1;
        var customiseButton = 2;

        // sets vm scopes
        var vm = this;
        vm.buttons = panelButtons;
        vm.selectedButton = 0;
        vm.toggle = false;
        vm.isLoading = false;
        vm.cartheight = 0;
        vm.overLayheight = 0;
        vm.isEnabled = true;
        vm.CartNoItems = vm.ItemsInCart="/Images/icon-cart.jpg";
        vm.CartHasItems = "/Images/icon-cart-selected.jpg";

        // initialises the controller.
        initialise();

        // controller initialise method.
        function initialise() {
            CartIcon();
            var deferred = common.$q.defer();
            deferred.resolve();
            return deferred.promise;
        }

        function CartIcon() {
            common
           .dataservice
           .getDataFromAPI('onlineorder/api/cart/basket', '')
           .then(function (data) {
               if (data.exceptionMessage || data.status >= 400) {
                   common.validateResponse(data);
               }
               else if (data != null && data.basketItems) {
                   if (data.basketItems.length > 0) {
                       vm.ItemsInCart = vm.CartHasItems;
                   };
               }
               return;
           });
        };

        vm.closeCart = function () {

            if (vm.selectedButton == customiseButton) {
                cartInterfaceService.cancelCustomiseConfiguration();
            } else {
                vm.closePanel();
            }
        };

        // set which button is selected
        vm.selectButton = function (setButtonId) {
            vm.overLayheight = angular.element(document).height();
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            if (setButtonId === myCartButton) {
                cartInterfaceService.carLoading(true);
                common.$q.all(
                        common.fadeAndScroll(scrollPostion, function () { return true }))
                    .then(
                        function () {
                            vm.selectedButton = setButtonId;
                            vm.toggle = true;
                            $rootScope.$broadcast(RELOAD_MYCART);
                        }
                    );
            }
            else {

                vm.selectedButton = setButtonId;
                vm.toggle = true;
            }

        };

        $scope.$on(CART_ITEMS_COUNT, function (event, count) {
            if (count > 0) { vm.ItemsInCart = vm.CartHasItems; } else { vm.ItemsInCart = vm.CartNoItems; }
        });

        $(document).on(START_CUSTOMISE, function () {
            vm.selectButton(customiseButton);
        });

        $(document).on(START_CUSTOMISE_DEAL, function () {
            vm.selectButton(customiseButton);
        });

        $(document).on(START_CUSTOMISE_RELOAD, function () {
            vm.selectButton(customiseButton);
        });

        $(document).on(COMPLETE_CUSTOMISE, function () {
            vm.selectButton(myCartButton);
        });

        $(document).on(CANCEL_CUSTOMISE, function () {
            vm.closePanel();
        });

        $(document).on(COMPLETE_DEAL_ITEM_CUSTOMISE, function () {
            vm.closePanel();
        });

        $(document).on(CART_LOADING, function (event, args) {
            vm.isLoading = args;
        });

        $(document).on(CLOSE_CART, function (event, args) {
            vm.closePanel();
        });

        $(document).on(CLOSE_CART_AND_STAY, function (event, args) {
            vm.closePanelNoScroll();
        });

        $(document).on(ENABLE_CART, function (event, args) {
            vm.isEnabled = true;
        });

        $(document).on(DISABLE_CART, function (event, args) {
            vm.isEnabled = false;
        });

        $(document).on(OPEN_CART, function (event, args) {
            cartInterfaceService.carLoading(true);
            var scrollPostion = common.$window.scrollY || common.$window.pageYOffset;
            common.fadeAndScroll(scrollPostion, function () { return true })
                .then(
                    function () {
                        vm.overLayheight = angular.element(document).height();
                        vm.selectedButton = 1;
                        vm.toggle = true;
                    });
        });

        // return true if selected button same with parameter
        vm.isButtonSelected = function (checkButtonId) {
            return vm.selectedButton === checkButtonId;
        };

        // event for (x) button (closed panel)
        vm.closePanel = function (isDirect) {
            vm.closePanelNoScroll(isDirect);

            common.$q.all(common.revertFadeAndScroll());
        };

        vm.closePanelNoScroll = function (isDirect) {
            if (vm.selectedButton == customiseButton && isDirect) {
                cartInterfaceService.cancelCustomise();

                if (common.$stateParams.dealId !== undefined) {
                    if (common.$stateParams.dealId.length > 0 && common.$stateParams.sectionName === 'deal-detail') {
                        cartInterfaceService.disableCart();
                    }
                }
                return;
            }
            vm.selectedButton = 0;
            vm.toggle = false;
        };
    }

}());