(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('SubCategoryController', SubCategoryController);

    SubCategoryController.$inject = ['$scope', '$rootScope', '$state', 'CategoryInfoService', 'SubCategoryService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function SubCategoryController($scope, $rootScope, $state, CategoryInfoService, SubCategoryService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.categories = [];
        $scope.categorykey = null;
        $scope.subcategories = [];
        // $scope.new_subcategory = null;
        $scope.new_subcategory_en = null;
        $scope.new_subcategory_fr = null;
        $scope.new_subcategory_it = null;
        $scope.new_subcategory_nl = null;
        $scope.new_subcategory_ru = null;
        $scope.new_subcategory_ar = null;
        $scope.new_subcategory_swiss_fr = null;
        $scope.new_subcategory_swiss_it = null;
        $scope.new_subcategory_swiss_nl = null;
        $scope.key = null;
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
        (function initController() {
            CategoryInfoService.InitFirebase(function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parseCategoryInfo();
                    });
                } else {
                    parseCategoryInfo();
                }
            });
            // autofocus
            $('#myModal').on('shown.bs.modal', function() {
                $('#inputName').focus();
            });
        })();

        function parseCategoryInfo() {
            $scope.categories = CategoryInfoService.categories;
            if ($scope.categories.length > 0) {
                $scope.categorykey = $scope.categories[0].key;
                loadsubcategory();
            }
        }

        $scope.onchangedcategory = function() {
            loadsubcategory();
        }

        function loadsubcategory() {
            // load
            if ($scope.categorykey) {
                SubCategoryService.ClearFirebase();
                SubCategoryService.InitFirebase($scope.categorykey, function(changed) {
                    if (changed) {
                        $rootScope.$apply(function() {
                            $scope.subcategories = SubCategoryService.subcategories;
                        });
                    } else {
                        $scope.subcategories = SubCategoryService.subcategories;
                    }
                });
            }
        }

        // dialog add new
        $scope.close = function() {
            // $scope.new_subcategory = "";
            $scope.new_subcategory_en = "";
            $scope.new_subcategory_fr = "";
            $scope.new_subcategory_it = "";
            $scope.new_subcategory_nl = "";
            $scope.new_subcategory_ru = "";
            $scope.new_subcategory_ar = "";
            $scope.new_subcategory_swiss_fr = "";
            $scope.new_subcategory_swiss_it = "";
            $scope.new_subcategory_swiss_nl = "";
            $scope.key = null;
        };

        $scope.save = function() {
            if (!$scope.new_subcategory_en || $scope.new_subcategory_en === "") {
                alert('Name cannot be empty!')
                return;
            }
            var params ={};
            params.name_en = $scope.new_subcategory_en;
            params.name_fr = $scope.new_subcategory_fr;
            params.name_it = $scope.new_subcategory_it;
            params.name_nl = $scope.new_subcategory_nl;
            params.name_ru = $scope.new_subcategory_ru;
            params.name_ar = $scope.new_subcategory_ar;
            params.name_swiss_fr = $scope.new_subcategory_swiss_fr;
            params.name_swiss_it = $scope.new_subcategory_swiss_it;
            params.name_swiss_nl = $scope.new_subcategory_swiss_nl;

            SubCategoryService.AddSubCategory($scope.key, params);
            $scope.new_subcategory = null;
            $scope.key = null;
            $('#myModal').modal('hide');
        };

        $scope.edit = function(index) {
            var item = $scope.subcategories[index];
            $scope.new_subcategory = item.val().name;
            $scope.key = item.key;
        }

        $scope.deleteAtIndex = function(index) {
            if (index >= 0 && $scope.subcategories.length > index) {
                var r = confirm('Are you sure?');
                if (!r) {
                    return;
                }
                var item = $scope.subcategories[index];
                SubCategoryService.RemoveSubCategory(item.key);
            }
        }
    }
})();
