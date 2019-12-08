(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CountryController', CountryController);

    CountryController.$inject = ['$scope', '$rootScope', '$state', 'CountryService', 'LanguageService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function CountryController($scope, $rootScope, $state, CountryService, LanguageService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.countries = [];
        $scope.new_country = "";
        $scope.new_currency_unit = "";
        $scope.new_display_unit = "";
        $scope.new_display_symbol = "";
        $scope.key = null;
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
        (function initController() {
            // hardcode: language en
            if ($rootScope.languagekey) {
                loadCountry($rootScope.languagekey);
            } else {
                LanguageService.finishLoadLanguage = function() {
                    loadCountry(LanguageService.languages[0].key);
                };
            }
            // autofocus
            $('#myModal').on('shown.bs.modal', function() {
                $('#inputName').focus();
            });
        })();

        function loadCountry(languagekey) {
            CountryService.InitFirebase(languagekey, function(changedThread) {
                // init
                if (changedThread) {
                    $rootScope.$apply(function() {
                        $scope.countries = CountryService.countries;
                    });
                } else {
                    $scope.countries = CountryService.countries;
                }
            });
        }

        $scope.close = function() {
            clearForm();
        };

        function clearForm() {
            $scope.new_country = "";
            $scope.new_currency_unit = "";
            $scope.new_display_unit = "";
            $scope.new_display_symbol = "";
            $scope.key = null;
        };

        $scope.save = function() {
            if (!$scope.new_country || $scope.new_country === "") {
                alert('Name cannot be empty!')
                return;
            }
            // default value
            if ($scope.new_currency_unit === "") {
                $scope.new_currency_unit = "USD";
            }
            if ($scope.new_display_unit === "") {
                $scope.new_display_unit = "USD";
            }
            if ($scope.new_display_symbol === "") {
                $scope.new_display_symbol = "$";
            }

            // set param
            var param = {
                name: $scope.new_country,
                currencyUnit: $scope.new_currency_unit,
                displayCurrencyUnit: $scope.new_display_unit,
                displayCurrencySymbol: $scope.new_display_symbol
            };
            // save
            CountryService.AddCountry($scope.key, param);
            clearForm();
            $('#myModal').modal('hide');
        };

        $scope.edit = function(index) {
            var item = $scope.countries[index];
            $scope.new_country = item.val().name;
            // Currency -> Default value
            if (item.val().currencyUnit !== null
                && item.val().currencyUnit !== undefined
                && item.val().currencyUnit !== ""){
                $scope.new_currency_unit = item.val().currencyUnit;
            }
            else{
                $scope.new_currency_unit = "USD";
            }
            if (item.val().displayCurrencyUnit !== null
                && item.val().displayCurrencyUnit !== undefined
                && item.val().displayCurrencyUnit !== ""){
                $scope.new_display_unit = item.val().displayCurrencyUnit;
            }
            else{
                $scope.new_display_unit = "USD";
            }
            if (item.val().displayCurrencySymbol !== null
                && item.val().displayCurrencySymbol !== undefined
                && item.val().displayCurrencySymbol !== ""){
                $scope.new_display_symbol = item.val().displayCurrencySymbol;
            }
            else{
                $scope.new_display_symbol = "$";
            }
            $scope.key = item.key;
        }

        $scope.deleteAtIndex = function(index) {
            if (index >= 0 && $scope.countries.length > index) {
                var r = confirm('Are you sure?');
                if (r) {
                    var item = $scope.countries[index];
                    CountryService.RemoveCountry(item.key);
                }
            }
        }

    }
})();
