(function() {
    'use strict';
    angular.module('tay3lo-admin')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$rootScope', '$location', 'AuthenService']; //
    function MainController($scope, $rootScope, $location, AuthenService) {
        (function initController() {
        })();

        $scope.$on("$destroy", function handler() {
            // destruction code here
        });

        $scope.logout = function() {
            AuthenService.Logout(function() {
                $rootScope.$apply(function() {
                    $location.path('/login');
                });
            });
        };

        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;

        $scope.check = function(x) {

            if (x == $scope.collapseVar)
                $scope.collapseVar = 0;
            else
                $scope.collapseVar = x;
        };

        $scope.multiCheck = function(y) {

            if (y == $scope.multiCollapseVar)
                $scope.multiCollapseVar = 0;
            else
                $scope.multiCollapseVar = y;
        };
    };
})();
