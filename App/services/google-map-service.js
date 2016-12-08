(function () {
    'use strict';

    var module = angular.module('main');
    var serviceId = "GoogleMapService";

    function LoadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=initMap';
        document.body.appendChild(script);
    }

    function GoogleMapService($window, $q) {
        var deferred = $q.defer();

        function Initialise() {
            if (!window.google || !window.google.maps) {
                $window.initMap = function () {
                    deferred.resolve();
                }

                if ($window.attachEvent) {
                    $window.attachEvent('onload', LoadScript);
                } else {
                    $window.addEventListener('load', LoadScript, false);
                }

                LoadScript();
            }
            return deferred.promise;
        }

        var service = {
            Initialise: Initialise
        }

        return service;
    }

    module.factory(serviceId, GoogleMapService);
    GoogleMapService.$inject = ['$window', '$q'];
}());
