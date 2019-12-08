(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope', '$rootScope', '$state', 'UserService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function UserController($scope, $rootScope, $state, UserService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.users = [];
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            // DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];
        (function initController() {
            $scope.users = UserService.users;
        })();

        $scope.makeAdmin = function(index){
          if (index >= $scope.users.length) {
            return;
          }
          var user = $scope.users[index];
          UserService.ChangeUserRole(user.key, !user.val().isAdmin, function(data){
              if (data !== null){
                // $scope.users[index] = data;
                user.val().isAdmin = !user.val().isAdmin;
              }
          });
        };

    }
})();
