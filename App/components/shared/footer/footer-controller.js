(function () {
    'use strict';

    var app = angular.module('main');
    var controllerId = 'rbFooter.controller';

    function footerController($scope, $rootscope, $http, $q, common, contentService, subscriptionService) {
        var vm = this;
        vm.emailPattern = /^[^\.].*$/;
        vm.isLoading = false;
        vm.model = {};
        vm.url = '';
        vm.urlAsync = '';
        vm.facebookURL = '';
        vm.instagramURL = '';
        vm.youtubeURL = '';

        function initialise() {
            contentService.GetMailChimpDetails()
                .then(function (data) {
                    vm.model = data;

                    if (vm.model != null) {
                        if (vm.model.length > 0) {
                            angular.forEach(vm.model, function (mailChimpModel, index) {

                                if (mailChimpModel.title === 'Mailchimp_ClientId') {
                                    vm.clientId = mailChimpModel.value;
                                }
                                if (mailChimpModel.title === 'Mailchimp_API_KEY') {
                                    vm.apiKey = mailChimpModel.value;
                                }
                                if (mailChimpModel.title === 'Mailchimp_FormUrl') {
                                    vm.formUrl = mailChimpModel.value;
                                }
                            });

                        }

                    }

                    vm.url = '//' + vm.formUrl + '/subscribe/post?u=' + vm.apiKey + '&' + 'id=' + vm.clientId;
                    vm.urlAsync = '//' + vm.formUrl + '/subscribe/post-json?u=' + vm.apiKey + '&' + 'id=' + vm.clientId + '&c=?';
                    angular.element("#mc-embedded-subscribe-form").attr('action', vm.url);

                });
        }

        vm.goToUri = function (uri, href) {

            var desktopFallback = href,
                mobileFallback = href,
                app = uri;
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                window.location = app;
                window.setTimeout(function () {
                    window.location = mobileFallback;
                }, 25);
                window.addEventListener('pagehide', killPopup);
            } else {
                window.open(desktopFallback, '_blank');
            }

            function killPopup() {
                window.removeEventListener('pagehide', killPopup);
            }
            window.addEventListener('pagehide', killPopup);
        }

        vm.trackAndRedirect = function (href,eventCategory,eventAction,eventLabel) {
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: eventAction,
                eventLabel: eventLabel
            });

            window.open(href, '_self');
        }

        function validateSocialMediaLink() {
            var facebookElement = document.getElementById('fb-page-smlink');
            var instagramElement = document.getElementById('insta-page-smlink');
            var youtubeElement = document.getElementById('youtube-page-smlink');

            var facebookUrl = facebookElement.getAttribute('data-default-href');
            var instagramURL = instagramElement.getAttribute('data-default-href');
            var youtubeURL = youtubeElement.getAttribute('data-default-href');

            var facebookAppUrl = facebookElement.getAttribute('data-app-href');
            var instagramAppURL = instagramElement.getAttribute('data-app-href');
            var youtubeAppURL = youtubeElement.getAttribute('data-app-href');

            var isFacebookAppInstalled = false;
            var isYoutubeAppInstalled = false;
            var isInstagramAppInstalled = false;

            vm.facebookUrl = facebookUrl;
            vm.instagramUrl = instagramURL;
            vm.youtubeUrl = youtubeURL;

            if (mobileAndTabletcheck()) {
                //checking facebook app installed
                $http.post(facebookAppUrl, { target_url: facebookAppUrl }).success(function (response) {
                    isFacebookAppInstalled = (response === 'valid url');
                    if (isFacebookAppInstalled) {
                        vm.facebookUrl = facebookAppUrl;
                    }
                });

                //checking youtube app installed
                $http.post(youtubeAppURL, { target_url: youtubeAppURL }).success(function (response) {
                    isYoutubeAppInstalled = (response === 'valid url');
                    if (isYoutubeAppInstalled) {
                        vm.youtubeUrl = youtubeAppURL;
                    }
                });

                //checking instagram app installed
                $http.post(instagramAppURL, { target_url: instagramAppURL }).success(function (response) {
                    isInstagramAppInstalled = (response === 'valid url');
                    if (isInstagramAppInstalled) {
                        vm.instagramUrl = instagramAppURL;
                    }
                });
            }

        }

        function mobileAndTabletcheck() {
            var check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        }

        vm.SubscribeClick = function (event) {
            //vm.model = {};
            //subscriptionService.Subscribe(vm.urlAsync, vm.model.FNAME, vm.model.LNAME, vm.model.EMAIL);

        }

        $scope.$on('GA_EVENT', function (event) {
            vm.eventTrackingAction = $rootscope.eventTrackingAction;
        })

        initialise();
    }
    app.controller(controllerId, footerController);
    footerController.$inject = ['$scope', '$rootScope', '$http', '$q', 'CommonService', 'ContentService', 'SubscriptionService'];
}());
