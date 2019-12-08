(function() {
    'use strict';
    angular.module('tay3lo-admin')
        .controller('LoadingController', LoadingController);

    LoadingController.$inject = ['$scope', '$rootScope', '$location', 'AuthenService', 'LanguageService', 'CategoryInfoService', 'MyStorage', 'CommentService', 'UserService', 'PlaceService', 'CountryService', 'CityService']; //
    function LoadingController($scope, $rootScope, $location, AuthenService, LanguageService, CategoryInfoService, MyStorage, CommentService, UserService, PlaceService, CountryService, CityService) {
        $scope.loadlanguage = false;
        $scope.loadcategory = false;
        $scope.loadComment = false;
        $scope.loadUser = false;
        $scope.loadPlace = false;
        $scope.loadCountry = false;
        $scope.loadCity = false;

        (function initController() {
          // Check permission
          if ($rootScope.currentUserUID === null || $rootScope.currentUserUID === undefined) {
            // move to login page
            $location.path('/dashboard/login');
            return;
          }
          
            // init firebase
            // Load all comment
            var getComment = function(){
              if ($scope.loadUser && $scope.loadPlace) {
                // Comment
                CommentService.InitFirebase(function(changed){
                  $scope.loadComment = true;
                  checkloading(changed);
                });
              }
            }
            // User
            UserService.InitFirebase(function(changed){
              $scope.loadUser = true;
              getComment();
            });
            // Place
            // load all place
            var getPlaces = function(cities) {
              PlaceService.InitFirebaseAll(cities, function(changed){
                  $scope.loadPlace = true;
                  getComment();
              });
            };

            // city
            var getCities = function(country) {
              CityService.InitFirebase(country.key, function(changed) {
                $scope.loadCity = true;
                  if (changed) {
                      $rootScope.$apply(function() {
                          getPlaces(CityService.cities);
                      });
                  } else {
                      getPlaces(CityService.cities);
                  }
              });
            }

            // Country
            var getCountry = function(){
              CountryService.InitFirebase($rootScope.languagekey, function(changedThread) {
                $scope.loadCountry = true;
                  // init
                  if (changedThread) {
                      $rootScope.$apply(function() {
                          getCities(CountryService.countries[0]);
                      });
                  } else {
                      getCities(CountryService.countries[0]);
                  }
              });
            };
            // Language
            LanguageService.InitFirebase(function(changed) {
                $scope.loadlanguage = true;
                getCountry();
            });

            // Category
            CategoryInfoService.InitFirebase(function(changed) {
                $scope.loadcategory = true;
                checkloading(changed);
            });
            // Storage
            MyStorage.InitFirebase();
        })();

        function checkloading(changed) {
            var finished = ($scope.loadlanguage
              && $scope.loadCountry
              && $scope.loadCity
              && $scope.loadcategory
              && $scope.loadComment
              && $scope.loadPlace);
            if (finished) {
                if (changed) {
                    $rootScope.$apply(function() {
                        $location.path('/dashboard/place');
                    });
                }
                else{
                    $location.path('/dashboard/place');
                }
            }
        }

        $scope.$on("$destroy", function handler() {
            // destruction code here
        });
    };
})();
