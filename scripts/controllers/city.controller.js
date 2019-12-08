(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CityController', CityController);

    CityController.$inject = ['$scope', '$rootScope', '$state', 'CountryService', 'CityService', 'MyStorage', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$q']; // jshint
    function CityController($scope, $rootScope, $state, CountryService, CityService, MyStorage, DTOptionsBuilder, DTColumnDefBuilder, $q) {
        $scope.countries = [];
        $scope.cities = [];
        $scope.current_city = "";
        $scope.current_apple_purchase_id = "";
        $scope.current_video_intro_url = "";
        $scope.current_city_intro = "";
        $scope.current_photo_url = null;
        $scope.current_priority = "";
        $scope.key = null;
        $scope.index = -1;
        $scope.country_key = null;
        $scope.file_photo = null;
        $scope.photofile = null;
        $scope.current_city_latitude = "";
        $scope.current_city_longitude = "";
        $scope.current_city_zoom = "";
        $scope.current_weatherUrl = "";
        $scope.current_deactived = false;
        // Banner ad
        $scope.current_banner_url = null;
        $scope.current_banner_photo_url = null;
        $scope.file_banner = null;
        $scope.bannerfile = null;

        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        (function initController() {
            // init
            loadCountry($rootScope.languagekey);

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
                        bindCountry();
                    });
                } else {
                    bindCountry();
                }
            });
        }

        function bindCountry() {
            $scope.countries = CountryService.countries;
            if ($scope.countries.length > 0) {
                $scope.country_key = $scope.countries[0].key;
                loadcity();
            }
        }

        $scope.closeDialog = function() {
            $scope.current_city = "";
            $scope.current_apple_purchase_id = "";
            $scope.current_video_intro_url = "";
            $scope.current_city_intro = "";
            $scope.current_city_latitude = "";
            $scope.current_city_longitude = "";
            $scope.current_city_zoom = "";
            $scope.current_weatherUrl = "";
            $scope.current_priority = "";
            $scope.file_photo = null;
            $scope.key = null;
            $scope.index = -1;
            $scope.current_deactived = false;
            // Photo
            $scope.current_photo_url = null;
            $('#inputPhoto').val(null);
            $scope.photofile = null;
            // Banner
            $('#inputBanner').val(null);
            $scope.current_banner_url = null;
            $scope.current_banner_photo_url = null;
            $scope.file_banner = null;
            $scope.bannerfile = null;
            // Hide
            $('#myModal').modal('hide');
        };

        // save or add new city
        $scope.save = function() {
            if (!$scope.current_city || $scope.current_city === "" || $scope.current_city === undefined ||
                $scope.current_city_intro === "" || $scope.current_city_intro === undefined) {
                alert('Name & intro info cannot be empty!')
                return;
            }
            var purchaseId = $scope.current_apple_purchase_id === undefined ? "" : $scope.current_apple_purchase_id;
            var videoIntro = $scope.current_video_intro_url === undefined ? "" : $scope.current_video_intro_url;
            var weather = $scope.current_weatherUrl === undefined ? "" : $scope.current_weatherUrl;
            var priority = ($scope.current_priority === undefined || $scope.current_priority === "" || $scope.current_priority === null) ? "0" : $scope.current_priority;
            var tempDeactived = ($scope.current_deactived === undefined || $scope.current_deactived === "" || $scope.current_deactived === null) ? false : $scope.current_deactived;
            var bannerUrl = $scope.current_banner_url === undefined ? "" : $scope.current_banner_url;
            var bannerPhoto = $scope.current_banner_photo_url === undefined ? "" : $scope.current_banner_photo_url;
            var param = {
                name: $scope.current_city,
                applePurchaseId: purchaseId,
                videoIntroUrl: videoIntro,
                intro: $scope.current_city_intro,
                photourl: $scope.current_photo_url,
                latitude: $scope.current_city_latitude,
                longitude: $scope.current_city_longitude,
                zoom: $scope.current_city_zoom,
                weatherUrl: weather,
                priority: priority,
                deactived: tempDeactived,
                // Banner
                bannerUrl: bannerUrl,
                bannerPhotoUrl: bannerPhoto
            };
            if ($scope.file_photo || $scope.file_banner) {
                // Handle when upload done
                var uploadedFile = false;
                var uploadedBanner = false;
                var next = function() {
                        if (uploadedBanner && uploadedFile) {
                            CityService.AddCity($scope.key, param);
                            $scope.closeDialog();
                        }
                    }
                    // Upload Photo if have
                if ($scope.file_photo) {
                    var deferred = $q.defer();
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city, $scope.file_photo, function(url) {
                        $rootScope.$apply(function() {
                            deferred.resolve(url);
                        });
                    }, null);
                    deferred.promise.then(
                        function(cityphoto) {
                            // Upload photo done
                            param.photourl = cityphoto;
                            uploadedFile = true;
                            next();
                        }
                    );
                } else {
                    uploadedFile = true;
                    next();
                }

                // Upload banner if have
                if ($scope.file_banner) {
                    var deferred = $q.defer();
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city + '/banner', $scope.file_banner, function(url) {
                        $rootScope.$apply(function() {
                            deferred.resolve(url);
                        });
                    }, null);
                    deferred.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl = result;
                            uploadedBanner = true;
                            next();
                        }
                    );
                } else {
                    uploadedBanner = true;
                    next();
                }

            } else {
                CityService.AddCity($scope.key, param);
                $scope.closeDialog();
            }
        };

        $scope.edit = function(index) {
            var item = $scope.cities[index];
            $scope.current_city = item.val().name;
            $scope.current_apple_purchase_id = item.val().applePurchaseId;
            $scope.current_video_intro_url = item.val().videoIntroUrl;
            $scope.current_city_intro = item.val().intro;
            $scope.current_city_latitude = item.val().latitude;
            $scope.current_city_longitude = item.val().longitude;
            $scope.current_city_zoom = item.val().zoom;
            $scope.current_photo_url = item.val().photourl;
            $scope.current_weatherUrl = item.val().weatherUrl;
            $scope.current_priority = item.val().priority;
            $scope.current_deactived = item.val().deactived;
            $scope.current_banner_photo_url = item.val().bannerPhotoUrl;
            $scope.current_banner_url = item.val().bannerUrl;
            $scope.key = item.key;
        }


        $scope.deleteAtIndex = function(index) {
            if (index >= 0 && $scope.cities.length > index) {
                var r = confirm('Are you sure?');
                if (!r) {
                    return;
                }
                var item = $scope.cities[index];
                CityService.RemoveCity(item.key);
            }
        }

        $scope.onchangecountry = function() {
            loadcity();
        }

        function loadcity() {
            if ($scope.country_key) {
                CityService.InitFirebase($scope.country_key, function(changed) {
                    if (changed) {
                        $rootScope.$apply(function() {
                            $scope.cities = CityService.cities;
                        });
                    } else {
                        $scope.cities = CityService.cities;
                    }
                });
            }
        }

        // $scope.handleFileSelect = function(input) {
        //     if (input.files && input.files[0]) {
        //         $scope.current_photo_url = null;
        //         var reader = new FileReader();
        //         reader.onload = function(e) {
        //             $('#photo')
        //                 .attr('src', e.target.result)
        //                 .width(300)
        //                 .height(200);
        //         };
        //         reader.readAsDataURL(input.files[0]);
        //     }
        // }

        // Change place priority
        $scope.changePriority = function(index) {
            if (index >= $scope.cities.length) {
                return;
            }
            let newValue = document.getElementById('inputPriority' + index).value
                // object
            var key = $scope.cities[index].key;
            var val = $scope.cities[index].val();
            if (key && newValue !== val.priority) {
                CityService.ChangePriority(key, newValue, function() {
                    // reload
                });
            }
        }

        // Active|Deactive City
        $scope.deactiveAtIndex = function(index) {
            if (index >= $scope.cities.length) {
                return;
            }
            var key = $scope.cities[index].key;
            if (key) {
                var deavtive = $scope.cities[index].val().deactived;
                CityService.DeactiveCity(key, !deavtive, function() {
                    // reload
                });
            }
        }
    }
})();