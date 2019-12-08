(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$scope', '$rootScope', '$state', 'CategoryInfoService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function CategoryController($scope, $rootScope, $state, CategoryInfoService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.categories = [];
        $scope.new_category = "";
        $scope.new_price_unit = "";
        $scope.key = null;
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];
        (function initController() {
            CategoryInfoService.InitFirebase(function(changed){
                if (changed) {
                    $rootScope.$apply(function(){
                        $scope.categories = CategoryInfoService.categories;
                    });
                }
                else{
                    $scope.categories = CategoryInfoService.categories;
                }
            });
            // autofocus
            $('#myModal').on('shown.bs.modal', function() {
                $('#inputName').focus();
            });
        })();

        $scope.close = function(){
            $scope.new_category = "";
            $scope.new_price_unit = "";
            $scope.key = null;
        };

        $scope.save = function(){
            if (!$scope.new_category || $scope.new_category === "") {
                alert('Name cannot be empty!')
                return;
            }
            CategoryInfoService.AddCategoryInfo($scope.key, $scope.new_category, $scope.new_price_unit, null);
            $scope.new_category = "";
            $scope.new_price_unit = "";
            $scope.key = null;
            $('#myModal').modal('hide');
        };

        $scope.edit = function(index){
            var item = $scope.categories[index];
            $scope.new_category = item.val().name;
            $scope.new_price_unit = item.val().priceUnit;
            $scope.key = item.key;
        }

        $scope.deleteAtIndex = function(index){
            if (index >= 0 && $scope.categories.length > index) {
                var r = confirm('Are you sure?');
                if (!r) {
                    return;
                }
                var item = $scope.categories[index];
                CategoryInfoService.RemoveCategoryInfo(item.key);
            }
        }

        // Change place priority
        $scope.changePriority = function(index) {
            if (index >= $scope.categories.length){
                return;
            }
            let newValue = document.getElementById('inputPriority' + index).value
            // object
            var key = $scope.categories[index].key;
            var val = $scope.categories[index].val();
            if (key && newValue !== val.priority) {
                CategoryInfoService.ChangePriority(key, newValue, function() {
                    // reload
                });
            }
        }
    }
})();
