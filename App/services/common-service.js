(function () {
    'use strict';

    var app = angular.module('rbCommon.service', []);

    // register common service 
    app.service('CommonService', common);

    var scrollPositionY = 0;
    var scrollPositionSet = false;

    // inject common service 
    common.$inject = ['$document', '$window', '$q', '$log', '$routeParams', '$state', '$stateParams', '$location', 'DataService', '$rootScope', '$timeout', '$modal', 'OPTIMISATION'];

    // common service that holds most common services used throughout app
    function common($document, $window, $q, $log, $routeParams, $state, $stateParams, $location, dataservice, $rootScope, $timeout, $modal, OPTIMISATION) {

        common.opened = false;

        var commonDependencies = {
            // common angular dependencies
            $window: $window,
            $q: $q,
            $log: $log,
            $routeParams: $routeParams,
            $location: $location,
            $timeout: $timeout,
            dataservice: dataservice,
            $state: $state,
            $stateParams: $stateParams,
            initiateController: initiateController,
            fadeAndScroll: fadeAndScroll,
            revertFadeAndScroll: revertFadeAndScroll,
            validateSession: validateSession,
            $document: $document
        };

        commonDependencies.scrollScreenUp = function () {
            $('html,body').animate({ scrollTop: 0 }, 1000);
        }

        commonDependencies.displayError = function (message, isReloadPage) {
            $rootScope.$broadcast(ON_ERROR, { message: message, isCloseAndReloadEnable: isReloadPage });
            commonDependencies.scrollScreenUp();
        };

        commonDependencies.displayNotification = function (title, message, isReloadPage) {
            $rootScope.$broadcast(ON_NOTIFY, { title: title, message: message, isCloseAndReloadEnable: isReloadPage });
            commonDependencies.scrollScreenUp();
        };

        commonDependencies.showConfirmation = function (title, message, yes, no) {

            function modalController($scope, $modalInstance) {
                common.opened = true;
                $scope.title = title;

                if (message != '') {
                    $scope.message = message;
                } else {
                    $scope.message = "Are you sure?";
                }

                commonDependencies.scrollScreenUp();

                common.opened = true;

                $scope.close = function () {
                    $scope.no();
                    common.opened = false;
                };

                $scope.no = function () {

                    if (no) {
                        no();
                    }

                    common.opened = false;
                    $modalInstance.close();

                };

                $scope.yes = function () {

                    if (yes) {
                        yes();
                    }

                    common.opened = false;
                    $modalInstance.close();
                };
            }

            modalController.$inject = ['$scope', '$modalInstance'];

            if (!common.opened) {
                $modal.open({
                    templateUrl: function () {
                        if (!OPTIMISATION) {
                            return 'App/components/shared/model-templates/confirmation.html';
                        }
                        return 'partials/confirmation.html';
                    },
                    controller: modalController,
                    backdrop: 'static'
                });
            }
        };

        commonDependencies.validateResponse = function (response) {
            var errorMessage = "Sorry, an error occurred while processing your request";
            if (response != undefined && response != null) {
                if (response.responseMessage) {
                    errorMessage = response.responseMessage;
                }
                else if (response.data && response.data.message) {
                    errorMessage = response.data.message;
                }
                else if (response.exceptionMessage) {
                    errorMessage = response.exceptionMessage;
                }
                else if (response.message) {
                    errorMessage = response.message;
                }
                else if (response.errorMessage) {
                    errorMessage = response.errorMessage;
                }
                else {
                    errorMessage = response.data;
                }
            }

            if (errorMessage == 'Your session has expired, reload now' ||
                errorMessage == 'Invalid token' || 
                errorMessage.indexOf("html") > -1) {
                $window.location.reload();
            } else {
                commonDependencies.displayError(errorMessage, true);
            }
        }

        function initiateController(promises, controllerId) {
            return $q.all(promises).then(function (eventArgs) {
                $log.logInfo(controllerId, 'Activated ' + controllerId + ' controller.');
            });
        }

        function fadeAndScroll(scrollPosition, callback) {
            if (scrollPosition >= 0 && !scrollPositionSet) {
                scrollPositionY = scrollPosition;
                scrollPositionSet = !scrollPositionSet;

            }
            var scroll = { scrollTop: 0 };
            return $.when(window.scrollTo(0, scroll.scrollTop)).done(
                function () {
                    if (callback) (callback());
                    return true;
                });
        }

        function revertFadeAndScroll() {
            var scroll = { scrollTop: scrollPositionY };
            return $.when(window.scrollTo(0, scroll.scrollTop)).done(function () {
                //$('body').css({ 'height': 'auto', 'overflow-y': 'visible' });
                scrollPositionSet = false;
                return true;
            });
        }

        function validateSession() {
            return dataservice.getDataFromAPI('onlineorder/api/order/ValidateSession');
        }

        return commonDependencies;
    }
}());