(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CityController', CityController);

    CityController.$inject = ['$scope', '$rootScope', '$state', 'CountryService', 'CityService', 'MyStorage', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$q']; // jshint
    function CityController($scope, $rootScope, $state, CountryService, CityService, MyStorage, DTOptionsBuilder, DTColumnDefBuilder, $q) {
        $scope.countries = [];
        $scope.cities = [];
        $scope.supported_langs = [
            {"perfix":"_en","display":"En"},
            {"perfix":"_fr","display":"Fr"},
            {"perfix":"_it","display":"It"},
            {"perfix":"_nl","display":"Nl"},
            {"perfix":"_ru","display":"Ru"},
            {"perfix":"_ar","display":"Ar"},
            {"perfix":"_swiss_fr","display":"Fr Swiss"},
            {"perfix":"_swiss_it","display":"It Swiss"},
            {"perfix":"_swiss_nl","display":"Nl Swiss"}
       ];
       $scope.test = "foly";
       $scope.translatable_fields = [
           {"name":"current_city","default":""},
           {"name":"current_video_intro_url","default":""},
           {"name":"current_city_intro","default":""},
           {"name":"current_banner_url","default":null},
           {"name":"current_banner_photo_url","default":null},
           {"name":"file_banner","default":null},
           {"name":"bannerfile","default":null}
        ];
        // angular.forEach($scope.translatable_fields, function (field, fieldKey) { 
            
        //     angular.forEach($scope.supported_langs, function (lang, langKey) { 
        //         $scope[field.name+lang.perfix] = field.default
        //     }); 
        // });  
        $scope.current_city_en = "";
        $scope.current_city_fr = "";
        $scope.current_city_it = "";
        $scope.current_city_nl = "";
        $scope.current_city_ru = "";
        $scope.current_city_ar = "";
        $scope.current_city_swiss_fr = "";
        $scope.current_city_swiss_it = "";
        $scope.current_city_swiss_nl = "";

        $scope.current_apple_purchase_id = "";
        // $scope.current_video_intro_url = "";

        $scope.current_video_intro_url_en = "";
        $scope.current_video_intro_url_fr = "";
        $scope.current_video_intro_url_it = "";
        $scope.current_video_intro_url_nl = "";
        $scope.current_video_intro_url_ru = "";
        $scope.current_video_intro_url_ar = "";
        $scope.current_video_intro_url_swiss_fr = "";
        $scope.current_video_intro_url_swiss_it = "";
        $scope.current_video_intro_url_swiss_nl = "";

        // $scope.current_city_intro = "";

        $scope.current_city_intro_en = "";
        $scope.current_city_intro_fr = "";
        $scope.current_city_intro_it = "";
        $scope.current_city_intro_nl = "";
        $scope.current_city_intro_ru = "";
        $scope.current_city_intro_ar = "";
        $scope.current_city_intro_swiss_fr = "";
        $scope.current_city_intro_swiss_it = "";
        $scope.current_city_intro_swiss_nl = "";

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
        // $scope.current_banner_url = null;

        $scope.current_banner_url_en = null;
        $scope.current_banner_url_fr = null;
        $scope.current_banner_url_it = null;
        $scope.current_banner_url_nl = null;
        $scope.current_banner_url_ru = null;
        $scope.current_banner_url_ar = null;
        $scope.current_banner_url_swiss_fr = null;
        $scope.current_banner_url_swiss_it = null;
        $scope.current_banner_url_swiss_nl = null;

        // $scope.current_banner_photo_url = null;

        $scope.current_banner_photo_url_en = null;
        $scope.current_banner_photo_url_fr = null;
        $scope.current_banner_photo_url_it = null;
        $scope.current_banner_photo_url_nl = null;
        $scope.current_banner_photo_url_ru = null;
        $scope.current_banner_photo_url_ar = null;
        $scope.current_banner_photo_url_swiss_fr = null;
        $scope.current_banner_photo_url_swiss_it = null;
        $scope.current_banner_photo_url_swiss_nl = null;

        // $scope.file_banner = null;
        $scope.file_banner_en = null;
        $scope.file_banner_fr = null;
        $scope.file_banner_it = null;
        $scope.file_banner_nl = null;
        $scope.file_banner_ru = null;
        $scope.file_banner_ar = null;
        $scope.file_banner_swiss_fr = null;
        $scope.file_banner_swiss_it = null;
        $scope.file_banner_swiss_nl = null;

        // $scope.bannerfile = null;
        $scope.bannerfile_en = null;
        $scope.bannerfile_fr = null;
        $scope.bannerfile_it = null;
        $scope.bannerfile_nl = null;
        $scope.bannerfile_ru = null;
        $scope.bannerfile_ar = null;
        $scope.bannerfile_swiss_fr = null;
        $scope.bannerfile_swiss_it = null;
        $scope.bannerfile_swiss_nl = null;

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
            // $scope.current_city = "";
            $scope.current_city_en = "";
            $scope.current_city_fr = "";
            $scope.current_city_it = "";
            $scope.current_city_nl = "";
            $scope.current_city_ru = "";
            $scope.current_city_ar = "";
            $scope.current_city_swiss_fr = "";
            $scope.current_city_swiss_it = "";
            $scope.current_city_swiss_nl = "";

            $scope.current_apple_purchase_id = "";
            // $scope.current_video_intro_url = "";

            $scope.current_video_intro_url_en = "";
            $scope.current_video_intro_url_fr = "";
            $scope.current_video_intro_url_it = "";
            $scope.current_video_intro_url_nl = "";
            $scope.current_video_intro_url_ru = "";
            $scope.current_video_intro_url_ar = "";
            $scope.current_video_intro_url_swiss_fr = "";
            $scope.current_video_intro_url_swiss_it = "";
            $scope.current_video_intro_url_swiss_nl = "";

            // $scope.current_city_intro = "";

            $scope.current_city_intro_en = "";
            $scope.current_city_intro_fr = "";
            $scope.current_city_intro_it = "";
            $scope.current_city_intro_nl = "";
            $scope.current_city_intro_ru = "";
            $scope.current_city_intro_ar = "";
            $scope.current_city_intro_swiss_fr = "";
            $scope.current_city_intro_swiss_it = "";
            $scope.current_city_intro_swiss_nl = "";

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
            // $scope.current_banner_url = null;

            $scope.current_banner_url_en = null;
            $scope.current_banner_url_fr = null;
            $scope.current_banner_url_it = null;
            $scope.current_banner_url_nl = null;
            $scope.current_banner_url_ru = null;
            $scope.current_banner_url_ar = null;
            $scope.current_banner_url_swiss_fr = null;
            $scope.current_banner_url_swiss_it = null;
            $scope.current_banner_url_swiss_nl = null;

            // $scope.current_banner_photo_url = null;

            $scope.current_banner_photo_url_en = null;
            $scope.current_banner_photo_url_fr = null;
            $scope.current_banner_photo_url_it = null;
            $scope.current_banner_photo_url_nl = null;
            $scope.current_banner_photo_url_ru = null;
            $scope.current_banner_photo_url_ar = null;
            $scope.current_banner_photo_url_swiss_fr = null;
            $scope.current_banner_photo_url_swiss_it = null;
            $scope.current_banner_photo_url_swiss_nl = null;

            // $scope.file_banner = null;
            $scope.file_banner_en = null;
            $scope.file_banner_fr = null;
            $scope.file_banner_it = null;
            $scope.file_banner_nl = null;
            $scope.file_banner_ru = null;
            $scope.file_banner_ar = null;
            $scope.file_banner_swiss_fr = null;
            $scope.file_banner_swiss_it = null;
            $scope.file_banner_swiss_nl = null;

            // $scope.bannerfile = null;
            $scope.bannerfile_en = null;
            $scope.bannerfile_fr = null;
            $scope.bannerfile_it = null;
            $scope.bannerfile_nl = null;
            $scope.bannerfile_ru = null;
            $scope.bannerfile_ar = null;
            $scope.bannerfile_swiss_fr = null;
            $scope.bannerfile_swiss_it = null;
            $scope.bannerfile_swiss_nl = null;
            // Hide
            $('#myModal').modal('hide');
        };

        // save or add new city
        $scope.save = function() {
            if (!$scope.current_city_en || $scope.current_city_en === "" || $scope.current_city_en === undefined ||
                $scope.current_city_intro_en === "" || $scope.current_city_intro_en === undefined) {
                alert('Name & intro info cannot be empty!')
                return;
            }
            var purchaseId = $scope.current_apple_purchase_id === undefined ? "" : $scope.current_apple_purchase_id;
            // var videoIntro = $scope.current_video_intro_url === undefined ? "" : $scope.current_video_intro_url;
            var weather = $scope.current_weatherUrl === undefined ? "" : $scope.current_weatherUrl;
            var priority = ($scope.current_priority === undefined || $scope.current_priority === "" || $scope.current_priority === null) ? "0" : $scope.current_priority;
            var tempDeactived = ($scope.current_deactived === undefined || $scope.current_deactived === "" || $scope.current_deactived === null) ? false : $scope.current_deactived;
            // var bannerUrl = $scope.current_banner_url === undefined ? "" : $scope.current_banner_url;
            // var bannerPhoto = $scope.current_banner_photo_url === undefined ? "" : $scope.current_banner_photo_url;
            var param = {
                // name: $scope.current_city,
                name_en: $scope.current_city_en,
                name_fr: $scope.current_city_fr,
                name_it: $scope.current_city_it,
                name_nl: $scope.current_city_nl,
                name_ru: $scope.current_city_ru,
                name_ar: $scope.current_city_ar,
                name_swiss_fr: $scope.current_city_swiss_fr,
                name_swiss_it: $scope.current_city_swiss_it,
                name_swiss_nl: $scope.current_city_swiss_nl,
                
                applePurchaseId: purchaseId,
                // videoIntroUrl: videoIntro,
                videoIntroUrl_en: $scope.current_video_intro_url_en === undefined ? "" : $scope.current_video_intro_url_en ,
                videoIntroUrl_fr: $scope.current_video_intro_url_fr === undefined ? "" : $scope.current_video_intro_url_fr ,
                videoIntroUrl_it: $scope.current_video_intro_url_it === undefined ? "" : $scope.current_video_intro_url_it ,
                videoIntroUrl_nl: $scope.current_video_intro_url_nl === undefined ? "" : $scope.current_video_intro_url_nl ,
                videoIntroUrl_ru: $scope.current_video_intro_url_ru === undefined ? "" : $scope.current_video_intro_url_ru ,
                videoIntroUrl_ar: $scope.current_video_intro_url_ar === undefined ? "" : $scope.current_video_intro_url_ar ,
                videoIntroUrl_swiss_fr: $scope.current_video_intro_url_swiss_fr === undefined ? "" : $scope.current_video_intro_url_swiss_fr,
                videoIntroUrl_swiss_it: $scope.current_video_intro_url_swiss_it === undefined ? "" : $scope.current_video_intro_url_swiss_it,
                videoIntroUrl_swiss_nl: $scope.current_video_intro_url_swiss_nl === undefined ? "" : $scope.current_video_intro_url_swiss_nl,

                // intro: $scope.current_city_intro,
                intro_en: $scope.current_city_intro_en,
                intro_fr: $scope.current_city_intro_fr,
                intro_it: $scope.current_city_intro_it,
                intro_nl: $scope.current_city_intro_nl,
                intro_ru: $scope.current_city_intro_ru,
                intro_ar: $scope.current_city_intro_ar,
                intro_swiss_fr: $scope.current_city_intro_swiss_fr,
                intro_swiss_it: $scope.current_city_intro_swiss_it,
                intro_swiss_nl: $scope.current_city_intro_swiss_nl,
                
                photourl: $scope.current_photo_url,
                latitude: $scope.current_city_latitude,
                longitude: $scope.current_city_longitude,
                zoom: $scope.current_city_zoom,
                weatherUrl: weather,
                priority: priority,
                deactived: tempDeactived,
                // Banner
                // bannerUrl: bannerUrl,
                bannerUrl_en: $scope.current_banner_url_en === undefined ? "" : $scope.current_banner_url_en ,
                bannerUrl_fr: $scope.current_banner_url_fr === undefined ? "" : $scope.current_banner_url_fr ,
                bannerUrl_it: $scope.current_banner_url_it === undefined ? "" : $scope.current_banner_url_it ,
                bannerUrl_nl: $scope.current_banner_url_nl === undefined ? "" : $scope.current_banner_url_nl ,
                bannerUrl_ru: $scope.current_banner_url_ru === undefined ? "" : $scope.current_banner_url_ru ,
                bannerUrl_ar: $scope.current_banner_url_ar === undefined ? "" : $scope.current_banner_url_ar ,
                bannerUrl_swiss_fr: $scope.current_banner_url_swiss_fr === undefined ? "" : $scope.current_banner_url_swiss_fr ,
                bannerUrl_swiss_it: $scope.current_banner_url_swiss_it === undefined ? "" : $scope.current_banner_url_swiss_it ,
                bannerUrl_swiss_nl: $scope.current_banner_url_swiss_nl === undefined ? "" : $scope.current_banner_url_swiss_nl ,
                // bannerPhotoUrl: bannerPhoto
                bannerPhotoUrl_en: $scope.current_banner_photo_url_en === undefined ? "" :$scope.current_banner_photo_url_en ,
                bannerPhotoUrl_fr: $scope.current_banner_photo_url_fr === undefined ? "" :$scope.current_banner_photo_url_fr ,
                bannerPhotoUrl_it: $scope.current_banner_photo_url_it === undefined ? "" :$scope.current_banner_photo_url_it ,
                bannerPhotoUrl_nl: $scope.current_banner_photo_url_nl === undefined ? "" :$scope.current_banner_photo_url_nl ,
                bannerPhotoUrl_ru: $scope.current_banner_photo_url_ru === undefined ? "" :$scope.current_banner_photo_url_ru ,
                bannerPhotoUrl_ar: $scope.current_banner_photo_url_ar === undefined ? "" :$scope.current_banner_photo_url_ar ,
                bannerPhotoUrl_swiss_fr: $scope.current_banner_photo_url_swiss_fr === undefined ? "" : $scope.current_banner_photo_url_swiss_fr ,
                bannerPhotoUrl_swiss_it: $scope.current_banner_photo_url_swiss_it === undefined ? "" : $scope.current_banner_photo_url_swiss_it ,
                bannerPhotoUrl_swiss_nl: $scope.current_banner_photo_url_swiss_nl === undefined ? "" : $scope.current_banner_photo_url_swiss_nl ,
            };
            if ($scope.file_photo ||
                $scope.file_banner_en ||
                $scope.file_banner_fr ||
                $scope.file_banner_it ||
                $scope.file_banner_nl ||
                $scope.file_banner_ru ||
                $scope.file_banner_ar ||
                $scope.file_banner_swiss_fr ||
                $scope.file_banner_swiss_it ||
                $scope.file_banner_swiss_nl 
                ) {
                var $gonnaupload = 0;

                if ($scope.file_photo) $gonnaupload +=1;
                if ($scope.file_banner_en) $gonnaupload +=1;
                if ($scope.file_banner_fr) $gonnaupload +=1;
                if ($scope.file_banner_it) $gonnaupload +=1;
                if ($scope.file_banner_nl) $gonnaupload +=1;
                if ($scope.file_banner_ru) $gonnaupload +=1;
                if ($scope.file_banner_ar) $gonnaupload +=1;
                if ($scope.file_banner_swiss_fr) $gonnaupload +=1;
                if ($scope.file_banner_swiss_it) $gonnaupload +=1;
                if ($scope.file_banner_swiss_nl) $gonnaupload +=1;




                var next = function() {
                        if ($gonnaupload === 0) {
                            CityService.AddCity($scope.key, param);
                            $scope.closeDialog();
                        }
                    }

                // Upload Photo if have
                if ($scope.file_photo) {
                    var deferred = $q.defer();
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_en, $scope.file_photo, function(url) {
                        $rootScope.$apply(function() {
                            deferred.resolve(url);
                        });
                    }, null);
                    deferred.promise.then(
                        function(cityphoto) {
                            // Upload photo done
                            param.photourl = cityphoto;
                            // uploadedFile = true;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                }

                // Upload banner if have
                if ($scope.file_banner_en) {
                    var deferred_file_banner_en = $q.defer();
                    deferred_file_banner_en.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_en = result;
                            // uploadedBanner_en = true;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_en + '/banner', $scope.file_banner_en, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_en.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_fr) {
                    var deferred_file_banner_fr = $q.defer();
                    deferred_file_banner_fr.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_fr = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_fr + '/banner', $scope.file_banner_fr, function(url) {
                        $rootScope.$apply(function() { deferred_file_banner_fr.resolve(url); });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_it) {
                    var deferred_file_banner_it = $q.defer();
                    deferred_file_banner_it.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_it = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_it + '/banner', $scope.file_banner_it, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_it.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_nl) {
                    var deferred_file_banner_nl = $q.defer();
                    deferred_file_banner_nl.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_nl = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_nl + '/banner', $scope.file_banner_nl, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_nl.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_ru) {
                    var deferred_file_banner_ru = $q.defer();
                    deferred_file_banner_ru.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_ru = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_ru + '/banner', $scope.file_banner_ru, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_ru.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_ar) {
                    var deferred_file_banner_ar = $q.defer();
                    deferred_file_banner_ar.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_ar = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_ar + '/banner', $scope.file_banner_ar, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_ar.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_swiss_fr) {
                    var deferred_file_banner_swiss_fr = $q.defer();
                    deferred_file_banner_swiss_fr.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_swiss_fr = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_swiss_fr + '/banner', $scope.file_banner_swiss_fr, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_swiss_fr.resolve(url);
                        });
                    }, null);

                }

                // Upload banner if have
                if ($scope.file_banner_swiss_it) {
                    var deferred_file_banner_swiss_it = $q.defer();
                    deferred_file_banner_swiss_it.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_swiss_it = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_swiss_it + '/banner', $scope.file_banner_swiss_it, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_swiss_it.resolve(url);
                        });
                    }, null);

                }
                // Upload banner if have
                if ($scope.file_banner_swiss_nl) {
                    var deferred_file_banner_swiss_nl = $q.defer();
                    deferred_file_banner_swiss_nl.promise.then(
                        function(result) {
                            // upload banner done
                            param.bannerPhotoUrl_swiss_nl = result;
                            $gonnaupload -=1;
                            next();
                        }
                    );
                    MyStorage.UploadCityPhoto('city/' + $scope.current_city_swiss_nl + '/banner', $scope.file_banner_swiss_nl, function(url) {
                        $rootScope.$apply(function() {
                            deferred_file_banner_swiss_nl.resolve(url);
                        });
                    }, null);

                }

            } else {
                CityService.AddCity($scope.key, param);
                $scope.closeDialog();
            }
        };

        $scope.edit = function(index) {
            var item = $scope.cities[index];
            // $scope.current_city = item.val().name;
            $scope.current_city_en = item.val().name_en;
            $scope.current_city_fr = item.val().name_fr;
            $scope.current_city_it = item.val().name_it;
            $scope.current_city_nl = item.val().name_nl;
            $scope.current_city_ru = item.val().name_ru;
            $scope.current_city_ar = item.val().name_ar;
            $scope.current_city_swiss_fr = item.val().name_swiss_fr;
            $scope.current_city_swiss_it = item.val().name_swiss_it;
            $scope.current_city_swiss_nl = item.val().name_swiss_nl;
            
            $scope.current_apple_purchase_id = item.val().applePurchaseId;
            // $scope.current_video_intro_url = item.val().videoIntroUrl;
            $scope.current_video_intro_url_en = item.val().videoIntroUrl_en;
            $scope.current_video_intro_url_fr = item.val().videoIntroUrl_fr;
            $scope.current_video_intro_url_it = item.val().videoIntroUrl_it;
            $scope.current_video_intro_url_nl = item.val().videoIntroUrl_nl;
            $scope.current_video_intro_url_ru = item.val().videoIntroUrl_ru;
            $scope.current_video_intro_url_ar = item.val().videoIntroUrl_ar;
            $scope.current_video_intro_url_swiss_fr = item.val().videoIntroUrl_swiss_fr;
            $scope.current_video_intro_url_swiss_it = item.val().videoIntroUrl_swiss_it;
            $scope.current_video_intro_url_swiss_nl = item.val().videoIntroUrl_swiss_nl;
            // $scope.current_city_intro = item.val().intro;
            $scope.current_city_intro_en = item.val().intro_en;
            $scope.current_city_intro_fr = item.val().intro_fr;
            $scope.current_city_intro_it = item.val().intro_it;
            $scope.current_city_intro_nl = item.val().intro_nl;
            $scope.current_city_intro_ru = item.val().intro_ru;
            $scope.current_city_intro_ar = item.val().intro_ar;
            $scope.current_city_intro_swiss_fr = item.val().intro_swiss_fr;
            $scope.current_city_intro_swiss_it = item.val().intro_swiss_it;
            $scope.current_city_intro_swiss_nl = item.val().intro_swiss_nl;

            $scope.current_city_latitude = item.val().latitude;
            $scope.current_city_longitude = item.val().longitude;
            $scope.current_city_zoom = item.val().zoom;
            $scope.current_photo_url = item.val().photourl;
            $scope.current_weatherUrl = item.val().weatherUrl;
            $scope.current_priority = item.val().priority;
            $scope.current_deactived = item.val().deactived;
            // $scope.current_banner_photo_url = item.val().bannerPhotoUrl;
            $scope.current_banner_photo_url_en = item.val().bannerPhotoUrl_en;
            $scope.current_banner_photo_url_fr = item.val().bannerPhotoUrl_fr;
            $scope.current_banner_photo_url_it = item.val().bannerPhotoUrl_it;
            $scope.current_banner_photo_url_nl = item.val().bannerPhotoUrl_nl;
            $scope.current_banner_photo_url_ru = item.val().bannerPhotoUrl_ru;
            $scope.current_banner_photo_url_ar = item.val().bannerPhotoUrl_ar;
            $scope.current_banner_photo_url_swiss_fr = item.val().bannerPhotoUrl_swiss_fr;
            $scope.current_banner_photo_url_swiss_it = item.val().bannerPhotoUrl_swiss_it;
            $scope.current_banner_photo_url_swiss_nl = item.val().bannerPhotoUrl_swiss_nl;

            // $scope.current_banner_url = item.val().bannerUrl;
            $scope.current_banner_url_en = item.val().bannerUrl_en;
            $scope.current_banner_url_fr = item.val().bannerUrl_fr;
            $scope.current_banner_url_it = item.val().bannerUrl_it;
            $scope.current_banner_url_nl = item.val().bannerUrl_nl;
            $scope.current_banner_url_ru = item.val().bannerUrl_ru;
            $scope.current_banner_url_ar = item.val().bannerUrl_ar;
            $scope.current_banner_url_swiss_fr = item.val().bannerUrl_swiss_fr;
            $scope.current_banner_url_swiss_it = item.val().bannerUrl_swiss_it;
            $scope.current_banner_url_swiss_nl = item.val().bannerUrl_swiss_nl;

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