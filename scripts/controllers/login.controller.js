(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$rootScope', '$state', 'AuthenService']; // jshint
    function LoginController($scope, $rootScope, $state, AuthenService) {
        $scope.rememberMe = true;
        (function initController() {
            $scope.dataLoading = false;
            // reset login status
            AuthenService.ClearCredentials();
        })();

        $scope.login = function() {
            if (!$scope.username || $scope.username === ""
                || !$scope.password || $scope.password === "") {
                alert('Please enter your email & password');
                return;
            }
            $scope.dataLoading = true;
            AuthenService.Login($scope.username, $scope.password, $scope.rememberMe, function(response) {
                if (response.success) {
                    $rootScope.$apply(function() {
                        $scope.dataLoading = false;
                        $state.go('loading');
                    });
                } else {
                    alert('Wrong password or not have permission');
                    //FlashService.Error(response.message);
                    $rootScope.$apply(function() {
                        $scope.dataLoading = false;
                    });
                }
            });
        };
    }
})();
