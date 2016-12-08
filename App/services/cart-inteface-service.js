(function () {
    'use strict';

    var app = angular.module('rbCartInterface.service', []);

    app.factory('CartInterfaceService', common);

    common.$inject = [];

    function common() {

        var cartInterface = {};

        cartInterface.startCustomise = function (params) {
            $(document).trigger(START_CUSTOMISE, params);
        };

        cartInterface.startCustomiseDeal = function (params) {
            $(document).trigger(START_CUSTOMISE_DEAL, params);
        };

        cartInterface.reloadCustomise = function (params) {
            $(document).trigger(START_CUSTOMISE_RELOAD, params);
        };

        cartInterface.cancelCustomise = function () {
            $(document).trigger(CANCEL_CUSTOMISE);
        };

        cartInterface.completeCustomise = function () {
            $(document).trigger(COMPLETE_CUSTOMISE);
        };

        cartInterface.completeDealItemCustomise = function (params) {
            $(document).trigger(COMPLETE_DEAL_ITEM_CUSTOMISE, params);
        };

        cartInterface.carLoading = function (loading) {
            $(document).trigger(CART_LOADING, loading);
        };

        cartInterface.reloadCart = function (params) {
            $(document).trigger(RELOAD_MYCART, params);
        };

        cartInterface.cancelCustomiseConfiguration = function (params) {
            $(document).trigger(CANCEL_CUSTOMISE_CONFIGURATION, params);
        };

        cartInterface.closeCart = function () {
            $(document).trigger(CLOSE_CART);
        };

        cartInterface.closeCartNoPositionRevert = function () {
            $(document).trigger(CLOSE_CART_AND_STAY);
        };

        cartInterface.disableCart = function () {
            $(document).trigger(DISABLE_CART);
        };

        cartInterface.enableCart = function () {
            $(document).trigger(ENABLE_CART);
        };

        cartInterface.openCart = function () {
            $(document).trigger(OPEN_CART);
        }


        return cartInterface;
    }
}());