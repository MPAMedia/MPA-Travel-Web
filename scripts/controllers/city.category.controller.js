(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CityCategoryController', CityCategoryController);

    CityCategoryController.$inject = ['$scope', '$rootScope', '$state', 'CountryService', 'CityService', 'CityCategoryService', 'CategoryInfoService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function CityCategoryController($scope, $rootScope, $state, CountryService, CityService, CityCategoryService, CategoryInfoService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.countries = [];
        $scope.cities = [];
        $scope.city_categories = [];
        $scope.citykey = null;
        $scope.categoryInfos = [];
        $scope.selected = {};
        $scope.existed = {};
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        (function initController() {
            // init
            $scope.countries = CountryService.countries;
            loadcity(0);
            // load category info
            CategoryInfoService.InitFirebase(function(changed){
                if (changed) {
                    $rootScope.$apply(function() {
                        loadcategoryinfo();
                    });
                }
                else{
                    loadcategoryinfo();
                }
            });
        })();

        function loadcity(index) {
            if (index < $scope.countries.length) {
                var country = $scope.countries[index];
                CityService.InitFirebase(country.key, function(changed) {
                    if (changed) {
                        $rootScope.$apply(function() {
                            parsecity(index, CityService.cities);
                        });
                    } else {
                        parsecity(index, CityService.cities);
                    }
                });
            }
            else if($scope.cities.length > 0){
                // done
                $scope.citykey = $scope.cities[0].key;
                finishgetdata();
            }
        }

        function parsecity(index, response) {
            for (var i = response.length - 1; i >= 0; i--) {
                var city = response[i];
                $scope.cities.push(city);
            }
            loadcity(index + 1);
        }

        // category info
        function loadcategoryinfo(){
            $scope.categoryInfos = CategoryInfoService.categories;
            finishgetdata();
        }

        function clearchecked(){
            for (var i = $scope.categoryInfos.length - 1; i >= 0; i--) {
                $scope.selected[$scope.categoryInfos[i].key] = false;
            }
        }

        function clearexisted(){
            for (var i = $scope.categoryInfos.length - 1; i >= 0; i--) {
                $scope.existed[$scope.categoryInfos[i].key] = false;
            }
        }

        function finishgetdata(){
            if ($scope.citykey && $scope.categoryInfos.length > 0) {
                loadcategory($scope.citykey);
            }
        }

        // load category
        $scope.onChangedCity = function() {
            if ($scope.citykey) {
                loadcategory($scope.citykey);
            }
        }

        function loadcategory(key){
            clearchecked();
            clearexisted();
            CityCategoryService.ClearFirebase();
            CityCategoryService.InitFirebase(key, function(changed){
                if (changed) {
                    $rootScope.$apply(function(){
                        parsecategory();
                    });
                }
                else{
                    parsecategory();
                }
            });
        }

        function parsecategory(){
            $scope.city_categories = CityCategoryService.city_categories;
            for (var i = $scope.city_categories.length - 1; i >= 0; i--) {
                var key = $scope.city_categories[i].val.category_key;
                $scope.existed[key] = true;
                $scope.selected[key] = true;
            }
        }

        $scope.chooseCategory = function(){
            // clearchecked();
        }

        $scope.save = function(){
            for (var i = Object.keys($scope.selected).length - 1; i >= 0; i--) {
                var key = Object.keys($scope.selected)[i];
                if ($scope.selected[key] && !$scope.existed[key]) {
                    CityCategoryService.AddCategory(key);
                    $scope.existed[key] = true;
                    $scope.selected[key] = true;
                }
            }
        }

        $scope.close = function(){
            for (var i = Object.keys($scope.selected).length - 1; i >= 0; i--) {
                var key = Object.keys($scope.selected)[i];
                if ($scope.selected[key] && !$scope.existed[key]) {
                    $scope.selected[key] = false;
                }
            }
        }

        $scope.removekey = function(key){
            var r = confirm('Are you sure?');
            if (!r) {
                return;
            }
            CityCategoryService.RemoveCategory(key);
            $scope.existed[key] = false;
            $scope.selected[key] = false;
        }

        // Change place Order
        $scope.changeCityCatOrder = function(index) {
            if (index >= $scope.city_categories.length){
                return;
            }
            let newValue = document.getElementById('inputOrder' + index).value
            // object
            var citycat = $scope.city_categories[index];
            if (citycat.key && newValue !== citycat.val.order) {
                CityCategoryService.ChangeCityCatOrder(citycat.key, newValue);
            }
        }
    }
})();
