(function () {
    'use strict';

    // angular directive for Edit Group component. 
    var editGroupDirective = function (OPTIMISATION) {
        return {
            // restrict to element use only 
            restrict: 'E',

            // Allow transclusion.
            transclude: true,

            // directive parameters put to this scope
            scope: {
                groupName: '@',
                showContent: '@',
            },

            // template view to use. Currently only return string of the static html view.
            // 
            // Parameters
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            templateUrl: function (element, attr) {
                if (!OPTIMISATION) {
                    return 'App/components/myaccountpage/edit-group/edit-group.html';
                }
                return 'partials/edit-group.html';
            },

            // logic for this directive
            // 
            // Parameters
            // scope: 
            //      scope of this directive. Directive parameters is put here. 
            // element:
            //      element JLite object.
            // attr:
            //      attributes of the element.
            link: function (scope, element, attrs) {

                // hide error message container
                element.find(".modal-error-message").hide();

                // toogle group content event handler
                var toggleContentGroupEvent = function () {
                    $(this).find("span.fa-chevron-down").toggle();
                    $(this).find("span.fa-chevron-up").toggle();
                    $(this).next("div").toggle();
                    $(this).toggleClass("account-item-selected");
                    $(this).find("span.glyphicon-trash").toggle();
                    $(this).parent().find('input[type="text"], input[type="password"]')[0].focus();
                };

                // register toggle show-hide content
                element.find("h3").on('click', toggleContentGroupEvent);

                // trigger click event if show content
                if (scope.showContent === 'true') {
                    element.find("h3").trigger('click');
                }


                // show fields editing mode event handler
                var edittingModeEvent = function () {
                    element.find(".btn-save").show();
                    element.find(".btn-canel-cta").show();
                    element.find(".btn-saved").hide();
                };

                // register input event on editting mode
                element.find(".edit-group input, .edit-group textarea").on('input', edittingModeEvent);


                // show fields saving mode event handler
                var savingModeEvent = function () {
                    //// disable save and cancel button while saving (sending request to api)
                    //element.find(".btn-save").prop('disabled', true);
                    //element.find(".btn-canel-cta").prop('disabled', true);
                };

                //register click event on saving mode
                element.find(".edit-group .btn-save").on('click', savingModeEvent);


                // show fields cancel mode event handler
                var cancelModeEvent = function () {
                    element.find(".btn-save").hide();
                    element.find(".btn-canel-cta").hide();
                    element.find(".btn-saved").show();
                };

                // register click event on saving mode
                element.find(".edit-group .btn-canel-cta").on('click', cancelModeEvent);


                // listen to success edit event
                scope.$on(scope.groupName + '-edit-group-edit-success', function (event, data) {
                    // empty error message
                    element.find(".modal-error-message").text('');
                    element.find(".modal-error-message").hide();

                    // disable and hide save button 
                    element.find(".btn-save").prop('disabled', false);
                    element.find(".btn-save").hide();

                    // disable and hide cancel button 
                    element.find(".btn-canel-cta").prop('disabled', false);
                    element.find(".btn-canel-cta").hide();

                    // show saved button 
                    element.find(".btn-saved").show();
                });


                // listen to failed edit event
                scope.$on(scope.groupName + '-edit-group-edit-fail', function (event, data) {
                    element.find(".modal-error-message").text('');

                    if (data) {
                        // show error message 
                        element.find(".modal-error-message").text(data);
                        element.find(".modal-error-message").show();
                    }

                    // enable and show save button
                    element.find(".btn-save").prop('disabled', false);
                    element.find(".btn-save").show();

                    // enable and show cancel button
                    element.find(".btn-canel-cta").prop('disabled', false);
                    element.find(".btn-canel-cta").show();

                    // hide saved button
                    element.find(".btn-saved").hide();
                });


                scope.submitForm = function () {
                    // emit submit form
                    scope.$emit(scope.groupName + '-edit-group-submit-form', 'submit');
                };

                scope.resetForm = function () {
                     element.find(".modal-error-message").text('');
                    // emit reset form
                    scope.$emit(scope.groupName + '-edit-group-reset-form', 'reset');
                };

                // listen to toggle save button
                scope.$on(scope.groupName + '-edit-group-toggle-save-button', function (event, data) {
                    //// disable/enable save button according to data received
                    element.find(".btn-save").prop('disabled', data.isDisable);
                });
            },

            // This directive's controller
            controller: 'rbEditGroup.controller',

            // The controller alias
            controllerAs: 'editGroup',
        };
    }

    // register the directive
    var app = angular.module('main');
    editGroupDirective.$inject = ["OPTIMISATION"];
    app.directive('rbEditGroup', editGroupDirective);
}());