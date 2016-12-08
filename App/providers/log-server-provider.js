(function () {
    'use strict';

    // register the provider
    var module = angular.module('rbLogServer.provider', []);

    // initialise provider id. This provider is replacing default angular $logProvider
    var providerId = '$log';

    // register provider
    module.provider(providerId, logServerProvider);

    // This is custom provider for angular $log function.
    // Every log will be using JSN log. So it depends on it to whether send it out to Elmah or just print to console or even both.
    // Currently it does both. See appenders in <jsnlog> element in Web.config
    function logServerProvider () {
        // constant of log default source
        var defaultSource = 'RB App';

        this.$get = function () {
            var logProvider = {

                // log trace level
                log: function (msg, source) {
                    source = (typeof source === 'undefined') ? defaultSource : source;

                    var processedMsg = this.processMsg(msg);
                    JL(source).trace(processedMsg);
                },

                // log trace wrapper
                logTrace: function (source, msg, params) {
                    this.log(vsprintf(msg, params), source);
                },

                // log debug level
                debug: function (msg, source) {
                    source = (typeof source === 'undefined') ? defaultSource : source;

                    var processedMsg = this.processMsg(msg);
                    JL(source).debug(processedMsg);
                },

                // log debug wrapper
                logDebug: function (source, msg, params) {
                    this.debug(vsprintf(msg, params), source);
                },

                // log info level
                info: function (msg, source) {
                    source = (typeof source === 'undefined') ? defaultSource : source;

                    var processedMsg = this.processMsg(msg);
                    JL(source).info(processedMsg);
                },

                // log info wrapper
                logInfo: function (source, msg, params) {
                    this.info(vsprintf(msg, params), source);
                },

                // log warn level
                warn: function (msg, source) {
                    source = (typeof source === 'undefined') ? defaultSource : source;

                    var processedMsg = this.processMsg(msg);
                    JL(source).warn(processedMsg);
                },

                // log warn wrapper
                logWarn: function (source, msg, params) {
                    this.warn(vsprintf(msg, params), source);
                },

                // log error level
                error: function (msg, source) {
                    source = (typeof source === 'undefined') ? defaultSource : source;

                    var processedMsg = this.processMsg(msg);
                    JL(source).error(processedMsg);
                },

                // log error wrapper
                logError: function (source, msg, params) {
                    this.error(vsprintf(msg, params), source);
                },

                // check message if it's Error object. return msg.stack if it is
                processMsg: function (msg) {
                    if (typeof (msg) === 'object') {
                        return msg.stack;
                    }

                    return msg;
                },
            };

            return (logProvider);
        };
    }
}());
