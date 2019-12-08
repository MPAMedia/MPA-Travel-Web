(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('PlaceController', PlaceController);

    PlaceController.$inject = ['$scope', '$rootScope', '$location', 'CountryService', 'CityService', 'CityCategoryService', 'PlaceService', 'SharedService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function PlaceController($scope, $rootScope, $location, CountryService, CityService, CityCategoryService, PlaceService, SharedService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.countries = [];
        $scope.cities = [];
        $scope.categories = [];
        $scope.cityPlaces = [];
        $scope.currentcity = null;
        $scope.selectedCategory = null;

        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];
        (function initController() {
            // init
            $scope.countries = CountryService.countries;
            loadlistcity(0);
        })();

        function loadlistcity(index) {
            if (index < $scope.countries.length) {
                var country = $scope.countries[index];
                CityService.InitFirebase(country.key, function(changed) {
                    if (changed) {
                        $rootScope.$apply(function() {
                          $scope.cities = CityService.cities;
                            loadPlacesCity(0);
                        });
                    } else {
                      $scope.cities = CityService.cities;
                        loadPlacesCity(0);
                    }
                });
            }
        };

        function changedCity() {
          if ($scope.currentcity) {
              SharedService.selectedCityKey = $scope.currentcity.key;
              loadcategory($scope.currentcity.key);

          }
        };

        function loadPlacesCity(index) {
          if ($scope.cities.length <= 0){
            return;
          }
          // Get selected city
          for (var i = 0; i < $scope.cities.length; i++) {
              var c = $scope.cities[i];
              if (c.key === SharedService.selectedCityKey) {
                  $scope.currentcity = $scope.cities[i];
                  break;
              }
          }
          // Set default selected city
          if (!$scope.currentcity) {
              $scope.currentcity = $scope.cities[0];
          }
          changedCity();
        };

        function loadcategory(city) {
            CityCategoryService.ClearFirebase();
            CityCategoryService.InitFirebase(city, function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parsecategory();
                    });
                } else {
                    parsecategory();
                }
            });
        };

        function parsecategory() {
            // $scope.categories = CityCategoryService.categories;
            while ($scope.categories.length > 0) {
                $scope.categories.pop();
            }
            $scope.categories.push({ key: 'all', name: 'All' });
            $scope.selectedCategory = null
            for (var i = 0; i < CityCategoryService.categories.length; i++) {
                var c = CityCategoryService.categories[i];
                $scope.categories.push({ key: c.key, name: c.val().name });
            }
            if ($scope.categories.length > 0) {
                if (SharedService.selectedCategoryKey) {
                    for (var i = 0; i < $scope.categories.length; i++) {
                        var c = $scope.categories[i];
                        if (SharedService.selectedCategoryKey === c.key) {
                            $scope.selectedCategory = $scope.categories[i];
                            break;
                        }
                    }
                }
                if (!$scope.selectedCategory) {
                    $scope.selectedCategory = $scope.categories[0];
                    SharedService.selectedCategoryKey = $scope.selectedCategory.key;
                }
            }
            loadplaces($scope.currentcity.key);
        };

        // place
        $scope.onchangedcategory = function(selected) {
            SharedService.selectedCategoryKey = $scope.selectedCategory.key;
            parseplace();
        };

        function loadplaces(citykey) {
            PlaceService.InitFirebase(citykey, function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parseplace();
                    });
                } else {
                    parseplace();
                }
            });
        };

        function parseplace() {
            var all = PlaceService.places[$scope.currentcity.key];
            // clear place
            $scope.cityPlaces = [];
            // add
            for (var i = all.length - 1; i >= 0; i--) {
                var p = all[i];
                if ($scope.selectedCategory && $scope.selectedCategory.key !== 'all') {
                    if (p.val().categories.indexOf($scope.selectedCategory.key) >= 0) {
                        $scope.cityPlaces.push(p);
                    }
                } else {
                    $scope.cityPlaces.push(p);
                }
            }
        };


        // UI EVENT
        // changed city
        $scope.onChangedCity = function() {
            changedCity();
        };


        // UPDATR DATA
        $scope.edit = function(index) {
            var obj = $scope.cityPlaces[index];
            SharedService.selectedPlace = obj;
            SharedService.selectedCityKey = $scope.currentcity.key;
            $location.path('dashboard/add-place');
        };

        $scope.deleteatindex = function(index) {
            var key = $scope.cityPlaces[index].key;
            if (key) {
                var r = confirm('Are you sure? The place that deleted can not restore');
                if (!r) {
                    return;
                }
                PlaceService.RemovePlace($scope.currentcity.key, key, function() {
                    parseplace();
                });
            }
        };

        $scope.deactiveAtIndex = function(index) {
            var key = $scope.cityPlaces[index].key;
            if (key) {
                var deavtive = $scope.cityPlaces[index].val().deactived;
                PlaceService.DeactivePlace($scope.currentcity.key, key, !deavtive, function() {
                    // $rootScope.$apply(function(){
                    parseplace();
                    // })
                });
            }
        };

        $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        // Change place priority
        $scope.changePriority = function(index) {
            if (index >= $scope.cityPlaces.length){
                return;
            }
            let newValue = document.getElementById('inputPriority' + index).value
            // object
            var key = $scope.cityPlaces[index].key;
            var val = $scope.cityPlaces[index].val();
            if (key && newValue !== val.priority) {
                PlaceService.ChangePriority($scope.currentcity.key, key, newValue, function() {
                    // $rootScope.$apply(function(){
                    parseplace();
                    // })
                });
            }
        };

    }
})();
