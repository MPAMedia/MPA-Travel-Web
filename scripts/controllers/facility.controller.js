(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('FacilityController', FacilityController);

    FacilityController.$inject = ['$scope', '$rootScope', '$state', 'FacilityService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function FacilityController($scope, $rootScope, $state, FacilityService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.facilities = [];
        // $scope.new_facility = "";
        $scope.new_facility_en = "";
        $scope.new_facility_fr = "";
        $scope.new_facility_it = "";
        $scope.new_facility_nl = "";
        $scope.new_facility_ru = "";
        $scope.new_facility_ar = "";
        $scope.new_facility_swiss_fr = "";
        $scope.new_facility_swiss_it = "";
        $scope.new_facility_swiss_nl = "";
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
            // $scope.new_facility = "";
            $scope.new_facility_en = "";
            $scope.new_facility_fr = "";
            $scope.new_facility_it = "";
            $scope.new_facility_nl = "";
            $scope.new_facility_ru = "";
            $scope.new_facility_ar = "";
            $scope.new_facility_swiss_fr = "";
            $scope.new_facility_swiss_it = "";
            $scope.new_facility_swiss_nl = "";
            $scope.key = null;
        };

        $scope.save = function(){
            if ($scope.new_facility_en === null || $scope.new_facility_en === "") {
                alert('Name cannot be empty!')
                return;
            }
            var params ={};
            params.name_en = $scope.new_facility_en;
            params.name_fr = $scope.new_facility_fr;
            params.name_it = $scope.new_facility_it;
            params.name_nl = $scope.new_facility_nl;
            params.name_ru = $scope.new_facility_ru;
            params.name_ar = $scope.new_facility_ar;
            params.name_swiss_fr = $scope.new_facility_swiss_fr;
            params.name_swiss_it = $scope.new_facility_swiss_it;
            params.name_swiss_nl = $scope.new_facility_swiss_nl;

            FacilityService.AddFacility($scope.key, params);
            // $scope.new_facility = "";
            $scope.new_facility_en = "";
            $scope.new_facility_fr = "";
            $scope.new_facility_it = "";
            $scope.new_facility_nl = "";
            $scope.new_facility_ru = "";
            $scope.new_facility_ar = "";
            $scope.new_facility_swiss_fr = "";
            $scope.new_facility_swiss_it = "";
            $scope.new_facility_swiss_nl = "";
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
