(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$scope', '$rootScope', '$state', 'CategoryInfoService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function CategoryController($scope, $rootScope, $state, CategoryInfoService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.categories = [];
        // $scope.new_category = "";
        $scope.new_category_en = "";
        $scope.new_category_fr = "";
        $scope.new_category_it = "";
        $scope.new_category_nl = "";
        $scope.new_category_ru = "";
        $scope.new_category_ar = "";
        $scope.new_category_swiss_fr = "";
        $scope.new_category_swiss_it = "";
        $scope.new_category_swiss_nl = "";
        // $scope.new_price_unit = "";
        $scope.new_price_unit_en = "";
        $scope.new_price_unit_fr = "";
        $scope.new_price_unit_it = "";
        $scope.new_price_unit_nl = "";
        $scope.new_price_unit_ru = "";
        $scope.new_price_unit_ar = "";
        $scope.new_price_unit_swiss_fr = "";
        $scope.new_price_unit_swiss_it = "";
        $scope.new_price_unit_swiss_nl = "";
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
            // $scope.new_category = "";
            $scope.new_category_en = "";
            $scope.new_category_fr = "";
            $scope.new_category_it = "";
            $scope.new_category_nl = "";
            $scope.new_category_ru = "";
            $scope.new_category_ar = "";
            $scope.new_category_swiss_fr = "";
            $scope.new_category_swiss_it = "";
            $scope.new_category_swiss_nl = "";
            // $scope.new_price_unit = "";
            $scope.new_price_unit_en = "";
            $scope.new_price_unit_fr = "";
            $scope.new_price_unit_it = "";
            $scope.new_price_unit_nl = "";
            $scope.new_price_unit_ru = "";
            $scope.new_price_unit_ar = "";
            $scope.new_price_unit_swiss_fr = "";
            $scope.new_price_unit_swiss_it = "";
            $scope.new_price_unit_swiss_nl = "";
            $scope.key = null;
        };

        $scope.save = function(){
            if (!$scope.new_category_en || $scope.new_category_en === "") {
                alert('Name cannot be empty!')
                return;
            }
            var cat={},prc={};
            cat.name_en = $scope.new_category_en;
            cat.name_fr = $scope.new_category_fr;
            cat.name_it = $scope.new_category_it;
            cat.name_nl = $scope.new_category_nl;
            cat.name_ru = $scope.new_category_ru;
            cat.name_ar = $scope.new_category_ar;
            cat.name_swiss_fr = $scope.new_category_swiss_fr;
            cat.name_swiss_it = $scope.new_category_swiss_it;
            cat.name_swiss_nl = $scope.new_category_swiss_nl;

            prc.priceUnit_en = $scope.new_price_unit_en;
            prc.priceUnit_fr = $scope.new_price_unit_fr;
            prc.priceUnit_it = $scope.new_price_unit_it;
            prc.priceUnit_nl = $scope.new_price_unit_nl;
            prc.priceUnit_ru = $scope.new_price_unit_ru;
            prc.priceUnit_ar = $scope.new_price_unit_ar;
            prc.priceUnit_swiss_fr = $scope.new_price_unit_swiss_fr;
            prc.priceUnit_swiss_it = $scope.new_price_unit_swiss_it;
            prc.priceUnit_swiss_nl = $scope.new_price_unit_swiss_nl;
            CategoryInfoService.AddCategoryInfo($scope.key,cat,prc,null);
            // $scope.new_category = "";
            $scope.new_category_en = "";
            $scope.new_category_fr = "";
            $scope.new_category_it = "";
            $scope.new_category_nl = "";
            $scope.new_category_ru = "";
            $scope.new_category_ar = "";
            $scope.new_category_swiss_fr = "";
            $scope.new_category_swiss_it = "";
            $scope.new_category_swiss_nl = "";
            // $scope.new_price_unit = "";
            $scope.new_price_unit_en = "";
            $scope.new_price_unit_fr = "";
            $scope.new_price_unit_it = "";
            $scope.new_price_unit_nl = "";
            $scope.new_price_unit_ru = "";
            $scope.new_price_unit_ar = "";
            $scope.new_price_unit_swiss_fr = "";
            $scope.new_price_unit_swiss_it = "";
            $scope.new_price_unit_swiss_nl = "";
            $scope.key = null;
            $('#myModal').modal('hide');
        };

        $scope.edit = function(index){
            var item = $scope.categories[index];
            // $scope.new_category = "";
            $scope.new_category_en = item.val().name_en;
            $scope.new_category_fr = item.val().name_fr;
            $scope.new_category_it = item.val().name_it;
            $scope.new_category_nl = item.val().name_nl;
            $scope.new_category_ru = item.val().name_ru;
            $scope.new_category_ar = item.val().name_ar;
            $scope.new_category_swiss_fr = item.val().name_swiss_fr;
            $scope.new_category_swiss_it = item.val().name_swiss_it;
            $scope.new_category_swiss_nl = item.val().name_swiss_nl;
            // $scope.new_price_unit = "";
            $scope.new_price_unit_en = item.val().priceUnit_en;
            $scope.new_price_unit_fr = item.val().priceUnit_fr;
            $scope.new_price_unit_it = item.val().priceUnit_it;
            $scope.new_price_unit_nl = item.val().priceUnit_nl;
            $scope.new_price_unit_ru = item.val().priceUnit_ru;
            $scope.new_price_unit_ar = item.val().priceUnit_ar;
            $scope.new_price_unit_swiss_fr = item.val().priceUnit_swiss_fr;
            $scope.new_price_unit_swiss_it = item.val().priceUnit_swiss_it;
            $scope.new_price_unit_swiss_nl = item.val().priceUnit_swiss_nl;
            // $scope.new_category = item.val().name;
            // $scope.new_price_unit = item.val().priceUnit;
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
