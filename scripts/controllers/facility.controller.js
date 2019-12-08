(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('FacilityController', FacilityController);

    FacilityController.$inject = ['$scope', '$rootScope', '$state', 'FacilityService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function FacilityController($scope, $rootScope, $state, FacilityService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.facilities = [];
        $scope.new_facility = "";
        $scope.key = null;
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        (function initController() {
            FacilityService.InitFirebase(function(changed){
                if (changed) {
                    $rootScope.$apply(function(){
                        $scope.facilities = FacilityService.facilities;
                    });
                }
                else{
                    $scope.facilities = FacilityService.facilities;
                }
            });
            // autofocus
            $('#myModal').on('shown.bs.modal', function() {
                $('#inputName').focus();
            });
        })();

        $scope.close = function(){
            $scope.new_facility = "";
            $scope.key = null;
        };

        $scope.save = function(){
            if ($scope.new_facility === null || $scope.new_facility === "") {
                alert('Name cannot be empty!')
                return;
            }
            FacilityService.AddFacility($scope.key, $scope.new_facility);
            $scope.new_facility = "";
            $scope.key = null;
            $('#myModal').modal('hide');
        };

        $scope.edit = function(index){
            var item = $scope.facilities[index];
            $scope.new_facility = item.val().name;
            $scope.key = item.key;
        }

        $scope.deleteAtIndex = function(index){
            if (index >= 0 && $scope.facilities.length > index) {
                var r = confirm('Are you sure?');
                if (!r) {
                    return;
                }
                var item = $scope.facilities[index];
                FacilityService.RemoveFacility(item.key);
            }
        }
    }
})();
