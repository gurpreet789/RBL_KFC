/**
  @attributes  ga="'send', 'event', 'test'" ga-on="click|hover|init"
     
      //Init-example
      <div ga="'send', 'pageview', {title: 'Hello world!'}" ga-on="init" />

      //Input focus example
      <input type="text" ga="'send', 'event', 'focus'" ga-on="focus" />

      //Examples of multiple events such as a metric and event
      <a href="#" ga="[['set', 'metric1', 10], ['send', 'event', 'player', 'play', video.id]]"></a>
      
      //Sending an id for videos
      <a href="#" ga="['send', 'event', 'player', 'play', video.id]"></a>
  */

(function () {
    'use strict';

    var app = angular.module('ga', []);
    app.factory('ga', ['$window', function ($window) {

        var ga = function () {
            if (angular.isArray(arguments[0])) {
                for (var i = 0; i < arguments.length; ++i) {
                    ga.apply(this, arguments[i]);
                }
                return;
            }
            if ($window.ga) {
                $window.ga.apply(this, arguments);
            }
        };

        return ga;
    }])
        .run(['$rootScope', '$location', 'ga', function ($rootScope, $location, ga) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                var currentURL = $location.url();
                if (toParams.subsection) {
                    var urlParts = currentURL.split("/");
                    if (urlParts[urlParts.length - 1] != toParams.sectionName) {
                        currentURL = currentURL.replace(urlParts[urlParts.length - 1], toParams.subsection);
                    }
                    else {
                        currentURL = currentURL + '/' + toParams.subsection;
                    }
                    ga('set', 'page', currentURL);
                }
                else {
                    ga('set', 'page', currentURL);
                }
                console.log("url for GA: " + currentURL);
                ga('send', 'pageview');
            });

        }])

        .directive('ga', ['$location', 'ga', function ($location, ga) {
            return {
                restrict: 'A',
                scope: false,
                link: function ($scope, $element, $attrs) {
                    var bindToEvent = $attrs.gaOn || 'click';
                    var onEvent = function () {
                        var command = $attrs.ga;
                        if (command) {
                            if (command[0] === '\'') command = '[' + command + ']';
                            command = $scope.$eval(command);
                            if (command[3] == '') {
                                var qaAction = '';
                                angular.forEach($location.url().split('/'), function (slice) { if (slice != "order" && slice != "") { qaAction += slice + ' ' } });
                                qaAction = qaAction ? qaAction : 'Homepage';
                                command[3] = qaAction;
                            }
                        } else {
                            // auto command
                            var href = $element.attr('href');
                            if (href && href === '#') href = '';
                            var category = $attrs.gaCategory ? $scope.$eval($attrs.gaCategory) :
                                    (href && href[0] !== '#' ? (href.match(/\/\//) ? 'link-out' : 'link-in') : 'button'),
                                action = $attrs.gaAction ? $scope.$eval($attrs.gaAction) :
                                    (href ? href : 'click'),
                                label = $attrs.gaLabel ? $scope.$eval($attrs.gaLabel) :
                                    ($element[0].title || ($element[0].tagName.match(/input/i) ? $element.attr('value') : $element.text())).substr(0, 64),
                                value = $attrs.gaValue ? $scope.$eval($attrs.gaValue) : null;
                            command = ['send', 'event', category, action, label];
                            if (value !== null) command.push(value);
                        }
                        ga.apply(null, command);
                    };

                    if (bindToEvent === 'init') {
                        onEvent();
                    } else {
                        $element.bind(bindToEvent, onEvent);
                    }
                }
            };
        }]);
})();