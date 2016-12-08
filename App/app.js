/// <reference path="components/shared/product/product-directive.js" />
// Main configuration file. Sets up AngularJS module and routes and any other config objects

var START_CUSTOMISE = "startcustomise";
var START_CUSTOMISE_RELOAD = "startcustomise_reload";
var START_CUSTOMISE_DEAL = "startcustomise_deal";
var COMPLETE_CUSTOMISE = "completecusomise";
var COMPLETE_DEAL_ITEM_CUSTOMISE = "complete_deal_item_cusomise";
var CANCEL_CUSTOMISE = "cancelcustomise";
var CANCEL_CUSTOMISE_CONFIGURATION = "cancel_customise_configuration";
var CART_LOADING = "cartloading";
var RELOAD_MYCART = "reloadmycart";
var ON_ERROR = "onerror";
var ON_NOTIFY = "onnotify";
var CHECKOUT_LOADING = "checkoutloading";
var CLOSE_CART = "closePanel";
var CLOSE_CART_AND_STAY = "closePanelAndStay";
var DISABLE_CART = "disableCart";
var ENABLE_CART = "enableCart";
var VOUCHER = "voucher";
var CART_ITEMS_COUNT = "CartItemsCount";
var IS_LOGGED_IN_USER = "IsLoggedInUser";
var NEW_PRODUCT_COUNT = "newProductCount";
var OPEN_CART = "OPEN_CART";

(function () {
    'use strict';

    //// Declare module for authentication
    //var authService = angular.module('AuthenticationService', []);

    // Define the main module. All of pages are under 'main' app (see _Layout.html there is something like ng-app="main")
    var appRoot = angular.module('main', [
        'ngRoute',
        'ngGrid',
        'ngResource',
        'ngCookies',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'rbLogServer.provider',
        'rbData.service',
        'rbCommon.service',
        'ngAnimate',
        'rbCartInterface.service',
        'multi-transclude',
        'ui.router',
        'truncate',
        'customtruncate',
        'angular-preload-image',
        'shoppinpal.mobile-menu',
        'ga',
        'ngMessages'
    ]);

    // register route config
    appRoot.config(routeConfig);

    // inject dependencies
    routeConfig.$inject = ['$routeProvider', '$httpProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', "OPTIMISATION"];

    // route configuration
    function routeConfig($routeProvider, $httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, OPTIMISATION) {
        $locationProvider.hashPrefix('!').html5Mode(true);
        $urlRouterProvider
            //.when("/order", "/order/pizzas")// Default view for the order view
            //.otherwise("pagenotfound");
            .when("/order", "/order/pizzas")// Default view for the order view
            .otherwise("pagenotfound");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/root/home'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/root/login',
                controller: 'rbLogin.controller'
            })
            .state('resetpassword', {
                url: '/reset-password/:sessionid?GUID=token',
                templateUrl: '/root/home',
                controller: 'rbResetPassword.controller',
                controllerAs: "resetPasssword"
            })
            .state('placeorder', {
                url: '/placeorder',
                templateUrl: '/root/home',
                controller: 'rbPaymarkContinueController.controller',
                controllerAs: 'paymarkContinue'
            })
            .state('myaccount', {
                url: '/myaccount',
                templateUrl: '/root/myaccount',
                resolve:
                {
                    authentication: ["MembershipService", function(membershipService) { return membershipService.RouteAuthenication('home') }]
                }
            })
            .state('order', {
                url: '/order',
                templateUrl: '/root/order',
            })
            .state('order.section', {
                url: '/:sectionName?dealId',
                views: {
                    'productTabContainer': {
                        templateUrl: function() {
                            if (!OPTIMISATION) {
                                return 'App/components/orderpage/order-menu/order-menu-tab.html';
                            }

                            return 'partials/order-menu-tab.html';
                        },
                        controller: 'rbOrderMenuTab.controller',
                        controllerAs: 'orderMenuTab'
                    }
                }
            })
            .state('order.section.subsection', {
                url: '/:subsection'
            })
            .state('paymentresponse', {
                 url: '/payment/response/:transaction/:receipt/:response',
                 templateUrl: '/root/home',
                 controller: 'rbPaymentResponseController.controller'
             })
            .state('aboutus', {
                url: '/about-us'
            })
            .state('termsandconditions', {
                url: '/terms-and-conditions'
            })
            .state('privacypolicy', {
                url: '/privacy-policy'
            })
            .state('contactus', {
                url: '/contact-us'
            })
            .state('faq', {
                url: '/faq'
            })
            .state('franchising', {
                url: '/franchising'
            })
            .state('error', {
                url: '/pagenotfound',
                templateUrl: '/error/pagenotfound'
            });

        // custom Http interceptor for handling error pages
        $httpProvider.interceptors.push('CustomHttpInterceptor');
    }


    // register root controller 
    appRoot.controller('rbRoot.controller', rootController);

    // inject dependencies
    rootController.$inject = ['$scope', '$route', '$routeParams', '$location', '$anchorScroll', '$modal', "OPTIMISATION", 'MembershipService', '$stateParams', '$rootScope', '$window'];

    // root controller
    function rootController($scope, $route, $routeParams, $location, $anchorScroll, $modal, OPTIMISATION, membershipService, $stateParams, $rootScope, $window) {

        $scope.$on('$routeChangeSuccess', function (e, current, previous) {
            $scope.activeViewPath = $location.path();
            
        });

        $scope.$on('pageLoad', function (e, current, previous) {
            $("body").append('<div class="cart-loading-panel"><i class="fa fa-refresh fa-spin fa-3x" style="color: white;"></i></div>');

        });

        $scope.$on('stopPageLoad', function (e, current, previous) {
            $(".cart-loading-panel").remove();

        });

        $scope.backToTop = function () {
            $("html, body").animate({ scrollTop: 0 }, "slow");
        };
        $rootScope.$on("$stateChangeSuccess", function (event, currentState, previousState) {
            $window.scrollTo(0, 0);
        });
        $scope.$on(ON_ERROR, function (event, args) {


            function modalController($modalScope, $modalInstance) {

                $modalScope.message = args.message;
                $modalScope.isCloseAndReloadEnable = args.isCloseAndReloadEnable;

                $modalScope.close = function () {
                    if ($modalScope.isCloseAndReloadEnable) {
                        $window.location.reload();
                    }
                    $modalInstance.close();
                };

            };
          
            modalController.$inject = ['$scope', '$modalInstance'];

            $modal.open({
                templateUrl: function () {
                    if (!OPTIMISATION) {
                        return 'App/components/shared/model-templates/generic-error.html';
                    }
                    return 'partials/generic-error.html';

                },
                backdrop: 'static',
                controller: modalController
            });
            
        });
        $scope.$on(ON_NOTIFY, function (event, args) {

            function modalController($modalScope, $modalInstance) {

                $modalScope.title = args.title;
                $modalScope.message = args.message;
                $modalScope.isCloseAndReloadEnable = args.isCloseAndReloadEnable;

                $modalScope.close = function () {
                    if ($modalScope.isCloseAndReloadEnable) {
                        $window.location.reload();
                    }
                    $modalInstance.close();
                };

            };

            modalController.$inject = ['$scope', '$modalInstance'];

            $modal.open({
                templateUrl: function () {
                    if (!OPTIMISATION) {
                        return 'App/components/shared/model-templates/notification.html';
                    }
                    return 'partials/notification.html';

                },
                backdrop: 'static',
                controller: modalController
            });

        });
    }

}());
