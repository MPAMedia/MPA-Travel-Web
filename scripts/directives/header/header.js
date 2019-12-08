(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name izzyposWebApp.directive:adminPosHeader
     * @description
     * # adminPosHeader
     */
    angular.module('tay3lo-admin')
        .directive('header', function() {
            return {
                restrict: 'ECA',
                scope: {
                    logout: "&",
                },
                templateUrl: 'scripts/directives/header/header.html',
            }
        });
})();
