(function() {
    'use strict';
    angular.module('tay3lo-admin')
        .controller('AddPlaceController', AddPlaceController);

    AddPlaceController.$inject = ['$scope', '$rootScope', '$location', 'PlaceService', 'CountryService', 'CityService', 'CategoryInfoService', 'SubCategoryService', 'CityCategoryService', 'CityPlaceService', 'MyStorage', 'SharedService', 'FacilityService']; //
    function AddPlaceController($scope, $rootScope, $location, PlaceService, CountryService, CityService, CategoryInfoService, SubCategoryService, CityCategoryService, CityPlaceService, MyStorage, SharedService, FacilityService) {
        $scope.photoPicker = {};
        // all
        $scope.cities = [];
        $scope.allCategories = [];
        $scope.cityCategories = [];
        $scope.dictSubcategories = {};
        $scope.selectedCategoriesKey = "";
        $scope.selectedCategories = [];
        $scope.selectedSubCategoriesKey = "";
        // facility
        $scope.facilities = [];
        $scope.facilitieskey = [];
        $scope.paidFacilities = null;
        // city & categories
        $scope.currentCity = null;
        // $scope.citykey = null;
        $scope.loading = false;
        // common require
        $scope.placekey = null;
        $scope.isBanner = false;
        // $scope.name = null;

        $scope.name_en = null;
        $scope.name_fr = null;
        $scope.name_it = null;
        $scope.name_nl = null;
        $scope.name_ru = null;
        $scope.name_ar = null;
        $scope.name_swiss_fr = null;
        $scope.name_swiss_it = null;
        $scope.name_swiss_nl = null;

        $scope.address = null;
        // $scope.description = null;
        $scope.description_en = null;
        $scope.description_fr = null;
        $scope.description_it = null;
        $scope.description_nl = null;
        $scope.description_ru = null;
        $scope.description_ar = null;
        $scope.description_swiss_fr = null;
        $scope.description_swiss_it = null;
        $scope.description_swiss_nl = null;

        $scope.photos = [];
        $scope.newphotos = [];
        $scope.newphotosurl = [];
        // common
        $scope.rate = null;
        // $scope.phonenumber = null;
        $scope.phonenumber_en = null;
        $scope.phonenumber_fr = null;
        $scope.phonenumber_it = null;
        $scope.phonenumber_nl = null;
        $scope.phonenumber_ru = null;
        $scope.phonenumber_ar = null;
        $scope.phonenumber_swiss_fr = null;
        $scope.phonenumber_swiss_it = null;
        $scope.phonenumber_swiss_nl = null;

        $scope.email = null;
        $scope.website = null;
        $scope.facebook = null;
        $scope.twitter = null;
        $scope.fromprice = null;
        $scope.toprice = null;
        $scope.openingtime = null;
        $scope.openingday = null;
        $scope.checkin = null;
        $scope.checkout = null;
        $scope.timespend = null;
        $scope.tags = null;
        $scope.thingstonote = null;

        // location
        $scope.longitude = null;
        $scope.latitude = null;
        // hotel
        $scope.starlevel = null;

        // FOR TOUR ONLY
        $scope.tourLocation = null;
        $scope.tourDuration = null;
        $scope.tourLanguage = null;
        $scope.tourTranspotation = null;
        $scope.tourGroupSize = null;
        $scope.tourBookingUrl = null;

        // For BOOKING Hotel
        $scope.sleepBookingUrl = null;
        $scope.sleepAirbnbUrl = null;
        $scope.sleepHostelWorldUrl = null;

        // TIME UPDATE
        $scope.createdAt = null;
        $scope.updatedAt = null;

        // Comment count
        $scope.commentCount = 0;
        $scope.loved = "";

        // PRIORITY
        $scope.priority = ""
        $scope.deactived = false;

        $scope.addmore = true;

        (function initController() {
            // init - DEFAULT 0 = VN
            $scope.countries = CountryService.countries;
            loadcity(0);
            // load category info
            CategoryInfoService.InitFirebase(function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        loadcategoryinfo();
                    });
                } else {
                    loadcategoryinfo();
                }
            });
            // subcategory
            SubCategoryService.InitFirebase(null, function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parsesubcategory();
                    });
                } else {
                    parsesubcategory();
                }
            });

            // Facility
            FacilityService.InitFirebase(function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parseFacilities();
                    });
                } else {
                    parseFacilities();
                }
            });
        })();

        function parseFacilities() {
            $scope.facilities = FacilityService.facilities;
            $scope.facilitieskey = "";
            $scope.finishGetFacility = true;
            handleFinishGetData();
        }

        function parsesubcategory() {
            var dict = SubCategoryService.dictSubcategories;
            for (var i = Object.keys(dict).length - 1; i >= 0; i--) {
                var catkey = Object.keys(dict)[i];
                var child = dict[catkey];
                var array = [];
                for (var j = Object.keys(child).length - 1; j >= 0; j--) {
                    var subcatkey = Object.keys(child)[j];
                    var subcat = child[subcatkey];
                    var obj = { 
                        key: subcatkey, 
                        // name: subcat.name 
                        name_en: subcat.new_subcategory_en,
                        name_fr: subcat.new_subcategory_fr,
                        name_it: subcat.new_subcategory_it,
                        name_nl: subcat.new_subcategory_nl,
                        name_ru: subcat.new_subcategory_ru,
                        name_ar: subcat.new_subcategory_ar,
                        name_swiss_fr: subcat.new_subcategory_swiss_fr,
                        name_swiss_it: subcat.new_subcategory_swiss_it,
                        name_swiss_nl: subcat.new_subcategory_swiss_nl,
                    };
                    array.push(obj);
                }
                $scope.dictSubcategories[catkey] = array;
            }
            $scope.finishGetSubCategory = true;
            handleFinishGetData();
        }

        $scope.$on("$destroy", function handler() {
            // destruction code here
            SharedService.selectedPlace = null;
            // SharedService.selectedCityKey = null;
        });

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
            } else {
                // done
                if (SharedService.selectedCityKey) {
                    for (var i = 0; i < $scope.cities.length; i++) {
                        var c = $scope.cities[i];
                        if (c.key === SharedService.selectedCityKey) {
                            // $scope.citykey = c.key;
                            $scope.currentCity = $scope.cities[i];
                            break;
                        }
                    }
                }
                if (!$scope.currentCity) {
                    // $scope.citykey = $scope.cities[0].key;
                    $scope.currentCity = $scope.cities[0];
                }
                parseCityCategory();
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
        function loadcategoryinfo() {
            $scope.allCategories = CategoryInfoService.categories;
            parseCityCategory();
        }

        function parseCityCategory() {
            if ($scope.currentCity && $scope.allCategories.length > 0) {
                loadcategoryAndPlace($scope.currentCity.key);
            }
        }

        // load category
        $scope.onChangedCity = function() {
            if ($scope.currentCity) {
                SharedService.selectedCityKey = $scope.currentCity.key;
                loadcategoryAndPlace($scope.currentCity.key);
            }
        }

        function loadcategoryAndPlace(key) {
            //clearexisted();
            CityCategoryService.ClearFirebase();
            CityCategoryService.InitFirebase(key, function(changed) {
                if (changed) {
                    $rootScope.$apply(function() {
                        parsecategory();
                    });
                } else {
                    parsecategory();
                }
            });

            // init place service
            if (PlaceService.citykey !== $scope.currentCity.key) {
                PlaceService.InitFirebase($scope.currentCity.key, function(changed) {
                    // done
                    if (changed) {
                        $rootScope.$apply(function() {
                            $scope.finishLoadCityPlace = true;
                            handleFinishGetData();
                        });
                    } else {
                        $scope.finishLoadCityPlace = true;
                        handleFinishGetData();
                    }
                });
            } else {
                $scope.finishLoadCityPlace = true;
                handleFinishGetData();
            }
        }

        function parsecategory() {
            $scope.cityCategories = CityCategoryService.categories;
            if ($scope.cityCategories.length > 0) {
                if (SharedService.selectedCategoryKey) {
                    var found = false;
                    for (var i = 0; i < $scope.cityCategories.length; i++) {
                        var cat = $scope.cityCategories[i];
                        if (cat.key === SharedService.selectedCategoryKey) {
                            $scope.selectedCategoriesKey = SharedService.selectedCategoryKey;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        $scope.selectedCategoriesKey = $scope.cityCategories[0].key;
                    }
                } else {
                    $scope.selectedCategoriesKey = $scope.cityCategories[0].key;
                }
            }
            $scope.finishGetCategory = true;
            handleFinishGetData();
        }

        function handleFinishGetData() {
            if (!$scope.finishGetCategory || !$scope.finishGetSubCategory || !$scope.finishGetFacility) {
                return;
            }
            // city & categories
            var place = SharedService.selectedPlace;
            if (place) {
                // mode edit
                $scope.addmore = false;
                var data = place.val();
                // filled selected place data
                $scope.selectedCategoriesKey = data.categories;
                $scope.selectedSubCategoriesKey = !data.hasOwnProperty('subcategories') ? null : data.subcategories;
                handleSelectedCategories();
                // common require
                $scope.placekey = place.key;
                $scope.isBanner = !data.hasOwnProperty('isBanner') ? false : data.isBanner;
                $scope.name_en = !data.hasOwnProperty('name_en') ? null : data.name_en;
                $scope.name_fr = !data.hasOwnProperty('name_fr') ? null : data.name_fr;
                $scope.name_it = !data.hasOwnProperty('name_it') ? null : data.name_it;
                $scope.name_nl = !data.hasOwnProperty('name_nl') ? null : data.name_nl;
                $scope.name_ru = !data.hasOwnProperty('name_ru') ? null : data.name_ru;
                $scope.name_ar = !data.hasOwnProperty('name_ar') ? null : data.name_ar;
                $scope.name_swiss_fr = !data.hasOwnProperty('name_swiss_fr') ? null : data.name_swiss_fr;
                $scope.name_swiss_it = !data.hasOwnProperty('name_swiss_it') ? null : data.name_swiss_it;
                $scope.name_swiss_nl = !data.hasOwnProperty('name_swiss_nl') ? null : data.name_swiss_nl;
                $scope.address = !data.hasOwnProperty('address') ? null : data.address;
                // $scope.description = !data.hasOwnProperty('description') ? null : data.description;
                $scope.description_en = !data.hasOwnProperty('description_en') ? null : data.description_en;
                $scope.description_fr = !data.hasOwnProperty('description_fr') ? null : data.description_fr;
                $scope.description_it = !data.hasOwnProperty('description_it') ? null : data.description_it;
                $scope.description_nl = !data.hasOwnProperty('description_nl') ? null : data.description_nl;
                $scope.description_ru = !data.hasOwnProperty('description_ru') ? null : data.description_ru;
                $scope.description_ar = !data.hasOwnProperty('description_ar') ? null : data.description_ar;
                $scope.description_swiss_fr = !data.hasOwnProperty('description_swiss_fr') ? null : data.description_swiss_fr;
                $scope.description_swiss_it = !data.hasOwnProperty('description_swiss_it') ? null : data.description_swiss_it;
                $scope.description_swiss_nl = !data.hasOwnProperty('description_swiss_nl') ? null : data.description_swiss_nl;
                $scope.photos = !data.hasOwnProperty('photos') ? [] : data.photos;
                $scope.newphotos = [];
                $scope.newphotosurl = [];
                // common
                $scope.rate = !data.hasOwnProperty('rate') ? null : data.rate;
                // $scope.phonenumber = !data.hasOwnProperty('phonenumber') ? null : data.phonenumber;
                $scope.phonenumber_en = !data.hasOwnProperty('phonenumber_en') ? null : data.phonenumber_en;
                $scope.phonenumber_fr = !data.hasOwnProperty('phonenumber_fr') ? null : data.phonenumber_fr;
                $scope.phonenumber_it = !data.hasOwnProperty('phonenumber_it') ? null : data.phonenumber_it;
                $scope.phonenumber_nl = !data.hasOwnProperty('phonenumber_nl') ? null : data.phonenumber_nl;
                $scope.phonenumber_ru = !data.hasOwnProperty('phonenumber_ru') ? null : data.phonenumber_ru;
                $scope.phonenumber_ar = !data.hasOwnProperty('phonenumber_ar') ? null : data.phonenumber_ar;
                $scope.phonenumber_swiss_fr = !data.hasOwnProperty('phonenumber_swiss_fr') ? null : data.phonenumber_swiss_fr;
                $scope.phonenumber_swiss_it = !data.hasOwnProperty('phonenumber_swiss_it') ? null : data.phonenumber_swiss_it;
                $scope.phonenumber_swiss_nl = !data.hasOwnProperty('phonenumber_swiss_nl') ? null : data.phonenumber_swiss_nl;
                $scope.email = !data.hasOwnProperty('email') ? null : data.email;
                $scope.website = !data.hasOwnProperty('website') ? null : data.website;
                $scope.facebook = !data.hasOwnProperty('facebook') ? null : data.facebook;
                $scope.twitter = !data.hasOwnProperty('twitter') ? null : data.twitter;
                $scope.fromprice = !data.hasOwnProperty('fromprice') ? null : data.fromprice;
                $scope.toprice = !data.hasOwnProperty('toprice') ? null : data.toprice;
                $scope.openingtime = !data.hasOwnProperty('openingtime') ? null : data.openingtime;
                $scope.openingday = !data.hasOwnProperty('openingday') ? null : data.openingday;
                $scope.checkin = !data.hasOwnProperty('checkin') ? null : data.checkin;
                $scope.checkout = !data.hasOwnProperty('checkout') ? null : data.checkout;
                $scope.timespend = !data.hasOwnProperty('timespend') ? null : data.timespend;
                $scope.tags = !data.hasOwnProperty('tags') ? null : data.tags;
                $scope.thingstonote = !data.hasOwnProperty('thingstonote') ? null : data.thingstonote;
                // location
                $scope.longitude = !data.hasOwnProperty('longitude') ? null : data.longitude;
                $scope.latitude = !data.hasOwnProperty('latitude') ? null : data.latitude;
                // hotel
                $scope.starlevel = !data.hasOwnProperty('starlevel') ? null : data.starlevel;

                // facility
                if (data.hasOwnProperty('facilities')) {
                    $scope.facilitieskey = data.facilities;
                }
                $scope.paidFacilities = !data.hasOwnProperty('paidFacilities') ? null : data.paidFacilities;

                // TOUR INFO
                $scope.tourLocation = !data.hasOwnProperty('tourLocation') ? null : data.tourLocation;
                $scope.tourDuration = !data.hasOwnProperty('tourDuration') ? null : data.tourDuration;
                $scope.tourLanguage = !data.hasOwnProperty('tourLanguage') ? null : data.tourLanguage;
                $scope.tourTranspotation = !data.hasOwnProperty('tourTranspotation') ? null : data.tourTranspotation;
                $scope.tourGroupSize = !data.hasOwnProperty('tourGroupSize') ? null : data.tourGroupSize;
                $scope.tourBookingUrl = !data.hasOwnProperty('tourBookingUrl') ? null : data.tourBookingUrl;

                // For BOOKING Hotel
                $scope.sleepBookingUrl = !data.hasOwnProperty('sleepBookingUrl') ? null : data.sleepBookingUrl;
                $scope.sleepAirbnbUrl = !data.hasOwnProperty('sleepAirbnbUrl') ? null : data.sleepAirbnbUrl;
                $scope.sleepHostelWorldUrl = !data.hasOwnProperty('sleepHostelWorldUrl') ? null : data.sleepHostelWorldUrl;

                // TIME INFO
                $scope.createdAt = !data.hasOwnProperty('createdAt') ? null : data.createdAt;
                $scope.updatedAt = !data.hasOwnProperty('updatedAt') ? null : data.updatedAt;

                // Comment count
                $scope.commentCount = !data.hasOwnProperty('commentCount') ? 0 : data.commentCount;
                $scope.loved = !data.hasOwnProperty('loved') ? "" : data.loved;

                // priority
                $scope.priority = !data.hasOwnProperty('priority') ? "" : data.priority;
                $scope.deactived = !data.hasOwnProperty('deactived') ? false : data.deactived;

            } else {
                if ($scope.finishGetCategory && $scope.finishGetSubCategory) {
                    handleSelectedCategories();
                }
            }
            // done load country-city-category
        }

        $scope.save = function() {
            // check null
            if (
                !$scope.name_en || 
                !$scope.address || 
                !$scope.description_en ||
                !$scope.currentCity || 
                !$scope.selectedCategoriesKey || 
                $scope.selectedCategoriesKey.length <= 0 || 
                !$scope.selectedSubCategoriesKey || 
                $scope.selectedSubCategoriesKey.length <= 0
                ) {
                alert('Please input all required fields');
                return;
            }

            $scope.loading = true;
            // upload photos
            if ($scope.newphotos.length > 0) {
                var cityname = $scope.currentCity.val().name_en;
                // for (var i = 0; i < $scope.cities.length; i++) {
                //     var city = $scope.cities[i];
                //     if (city.key === $scope.citykey) {
                //         cityname = city.val().name;
                //         break;
                //     }
                // }
                var path = 'place/' + cityname + '/' + $scope.name_en;
                $scope.newphotosurl = [];
                for (var i = 0; i < $scope.newphotos.length; i++) {
                    var p = $scope.newphotos[i];
                    MyStorage.UploadCityPhoto(path, p, function(url) {
                        $rootScope.$apply(function() {
                            if ($scope.photos == null) {
                                $scope.photos = [];
                            };
                            $scope.photos.push(url);
                            $scope.newphotosurl.push(url);
                            addplace();
                        });
                    }, function() {
                        alert('upload photo error');
                        $scope.loading = false;
                    });
                }
            } else {
                addplace();
            }
        }

        function addplace() {
            // add place
            if ($scope.newphotosurl.length < $scope.newphotos.length) {
                return;
            }
            var time = (new Date()).getTime() / 1000.0;
            var param = {
                isBanner: $scope.isBanner,
                name_en: $scope.name_en,
                name_fr: $scope.name_fr,
                name_it: $scope.name_it,
                name_nl: $scope.name_nl,
                name_ru: $scope.name_ru,
                name_ar: $scope.name_ar,
                name_swiss_fr: $scope.name_swiss_fr,
                name_swiss_it: $scope.name_swiss_it,
                name_swiss_nl: $scope.name_swiss_nl,
                address: $scope.address,
                // description: $scope.description,
                description_en: $scope.description_en,
                description_fr: $scope.description_fr,
                description_it: $scope.description_it,
                description_nl: $scope.description_nl,
                description_ru: $scope.description_ru,
                description_ar: $scope.description_ar,
                description_swiss_fr: $scope.description_swiss_fr,
                description_swiss_it: $scope.description_swiss_it,
                description_swiss_nl: $scope.description_swiss_nl,
                photos: $scope.photos,
                // common
                rate: $scope.rate,
                // phonenumber: $scope.phonenumber,
                phonenumber_en: $scope.phonenumber_en,
                phonenumber_fr: $scope.phonenumber_fr,
                phonenumber_it: $scope.phonenumber_it,
                phonenumber_nl: $scope.phonenumber_nl,
                phonenumber_ru: $scope.phonenumber_ru,
                phonenumber_ar: $scope.phonenumber_ar,
                phonenumber_swiss_fr: $scope.phonenumber_swiss_fr,
                phonenumber_swiss_it: $scope.phonenumber_swiss_it,
                phonenumber_swiss_nl: $scope.phonenumber_swiss_nl,
                email: $scope.email,
                website: $scope.website,
                facebook: $scope.facebook,
                twitter: $scope.twitter,
                fromprice: $scope.fromprice,
                toprice: $scope.toprice,
                openingtime: $scope.openingtime,
                openingday: $scope.openingday,
                checkin: $scope.checkin,
                checkout: $scope.checkout,
                timespend: $scope.timespend,
                tags: $scope.tags,
                thingstonote: $scope.thingstonote,
                // location
                longitude: $scope.longitude,
                latitude: $scope.latitude,
                // hotel
                starlevel: $scope.starlevel,
                // category
                categories: $scope.selectedCategoriesKey.constructor === Array ? $scope.selectedCategoriesKey : [$scope.selectedCategoriesKey],
                subcategories: $scope.selectedSubCategoriesKey.constructor === Array ? $scope.selectedSubCategoriesKey : [$scope.selectedSubCategoriesKey],
                // paid facilities
                paidFacilities: $scope.paidFacilities,

                // TOUR INFO
                tourLocation: $scope.tourLocation,
                tourDuration: $scope.tourDuration,
                tourLanguage: $scope.tourLanguage,
                tourTranspotation: $scope.tourTranspotation,
                tourGroupSize: $scope.tourGroupSize,
                tourBookingUrl: $scope.tourBookingUrl,

                // Sleep book url
                sleepBookingUrl: $scope.sleepBookingUrl,
                sleepAirbnbUrl: $scope.sleepAirbnbUrl,
                sleepHostelWorldUrl: $scope.sleepHostelWorldUrl,

                // Time Info
                createdAt: $scope.createdAt === null ? time : $scope.createdAt,
                updatedAt: time,

                // Comment count
                commentCount: $scope.commentCount,
                loved: $scope.loved,

                // priority
                priority: $scope.priority,
                deactived: $scope.deactived
            };
            if ($scope.facilitieskey.length > 0) {
                // facilities
                param['facilities'] = $scope.facilitieskey.constructor === Array ? $scope.facilitieskey : [$scope.facilitieskey];
            }

            // COMPARE WITH OLD DATA BEFORE UPDATE
            var checkEditted = true;
            if ($scope.placekey) {
                checkEditted = false;
                var old = SharedService.selectedPlace.val();
                for (var i = 0; i < Object.keys(param).length; i++) {
                    var k = Object.keys(param)[i]
                    var k1 = old[k] != null && old[k] != undefined && old[k].length > 0 ? old[k] : null;
                    var k2 = param[k] != null && param[k] != undefined && param[k].length > 0 ? param[k] : null;
                    if ((k1 === null && k2 !== null && k2.length > 0) ||
                        (k1 !== null && k1.length > 0 && k2 === null) ||
                        (k1 !== null && k2 !== null && k1.length > 0 && k2.length > 0 && !angular.equals(k1, k2))) {
                        // data difference
                        checkEditted = true;
                        break;
                    }
                }
            }
            if (checkEditted) {
                PlaceService.AddPlace($scope.currentCity.key, $scope.placekey, param, function() {
                    $scope.loading = false;
                    if ($scope.addmore) {
                        // clear content
                        clearForm();
                        $scope.photoPicker.clearFiles();
                    } else {
                        $location.path('dashboard/place');
                    }
                });

            } else {
                // come back
                $location.path('dashboard/place');
            }
        }

        $scope.onChangedCategory = function() {
            handleSelectedCategories();
        };

        function handleSelectedCategories() {
            // categories
            if ($scope.selectedCategoriesKey && $scope.selectedCategoriesKey.length > 0) {
                for (var i = 0; i < $scope.cityCategories.length; i++) {
                    var s = $scope.cityCategories[i];
                    // có key mà chưa có object -> push object
                    if ($scope.selectedCategoriesKey.indexOf(s.key) >= 0 && $scope.selectedCategories.indexOf(s) < 0) {
                        $scope.selectedCategories.push(s);
                        // check selected subcategory
                    }
                    // nếu danh sách selected key ko chứa key này
                    else if ($scope.selectedCategoriesKey.indexOf(s.key) < 0) {
                        var index = $scope.selectedCategories.indexOf(s);
                        if (index >= 0) {
                            $scope.selectedCategories.splice(index, 1);
                            // remove selected subcategory coresponse
                            if ($scope.dictSubcategories.hasOwnProperty(s.key)) {
                                var arr = $scope.dictSubcategories[s.key];
                                for (var i = 0; i < arr.length; i++) {
                                    var sub = arr[i];
                                    var index = $scope.selectedSubCategoriesKey.indexOf(sub.key);
                                    if (index > 0) {
                                        if ($scope.selectedSubCategoriesKey.constructor === Array) {
                                            $scope.selectedSubCategoriesKey.splice(index, 1);
                                        } else {
                                            $scope.selectedSubCategoriesKey = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // sub categories
                if ($scope.selectedCategories.length > 0 && (!$scope.selectedSubCategoriesKey || $scope.selectedSubCategoriesKey.length === 0)) {
                    $scope.selectedSubCategoriesKey = $scope.dictSubcategories[$scope.selectedCategories[0].key][0].key;
                }
            } else {
                while ($scope.selectedCategories.length > 0) {
                    $scope.selectedCategories.pop();
                }
            }
        }

        $scope.onChangedSubCategory = function() {

        }

        function clearForm() {
            // common require
            $scope.isBanner = false;
            // $scope.name = null;
            $scope.name_en = null;
            $scope.name_fr = null;
            $scope.name_it = null;
            $scope.name_nl = null;
            $scope.name_ru = null;
            $scope.name_ar = null;
            $scope.name_swiss_fr = null;
            $scope.name_swiss_it = null;
            $scope.name_swiss_nl = null;

            $scope.address = null;
            // $scope.description = null;
            $scope.description_en = null;
            $scope.description_fr = null;
            $scope.description_it = null;
            $scope.description_nl = null;
            $scope.description_ru = null;
            $scope.description_ar = null;
            $scope.description_swiss_fr = null;
            $scope.description_swiss_it = null;
            $scope.description_swiss_nl = null;
            while ($scope.photos.length > 0) {
                $scope.photos.pop();
            }
            while ($scope.newphotos.length > 0) {
                $scope.newphotos.pop();
            }
            while ($scope.newphotosurl.length > 0) {
                $scope.newphotosurl.pop();
            }
            // common
            $scope.rate = null;
            // $scope.phonenumber = null;
            $scope.phonenumber_en = null;
            $scope.phonenumber_fr = null;
            $scope.phonenumber_it = null;
            $scope.phonenumber_nl = null;
            $scope.phonenumber_ru = null;
            $scope.phonenumber_ar = null;
            $scope.phonenumber_swiss_fr = null;
            $scope.phonenumber_swiss_it = null;
            $scope.phonenumber_swiss_nl = null;

            $scope.email = null;
            $scope.website = null;
            $scope.facebook = null;
            $scope.twitter = null;
            $scope.fromprice = null;
            $scope.toprice = null;
            $scope.openingtime = null;
            $scope.openingday = null;
            $scope.checkin = null;
            $scope.checkout = null;
            $scope.timespend = null;
            $scope.tags = null;
            $scope.thingstonote = null;
            // location
            $scope.longitude = null;
            $scope.latitude = null;
            // hotel
            $scope.starlevel = null;
            // facilities
            $scope.paidFacilities = null;
            // TOUR INFO
            $scope.tourLocation = null;
            $scope.tourDuration = null;
            $scope.tourLanguage = null;
            $scope.tourTranspotation = null;
            $scope.tourGroupSize = null;
            $scope.tourBookingUrl = null;

            // Sleep book url
            $scope.sleepBookingUrl = null;
            $scope.sleepAirbnbUrl = null;
            $scope.sleepHostelWorldUrl = null;

            // Comment count
            $scope.commentCount = 0;
            $scope.loved = "";
        }

        $scope.removePhotoAt = function(index) {
            if (index < $scope.photos.length) {
                var r = confirm('Are you sure');
                if (r) {
                    $scope.photos.splice(index, 1);
                }
            }
        }


        $scope.onChangedFacilities = function() {

        }

        $scope.clearFileAtIndex = function(index) {
            $('#fileId_' + $scope.$id + ' .mdr-file-dad-content .preview-' + index).fadeOut('slow', function() {
                $(this).remove();
            })
        };

        // checking display function
        $scope.isEditing = function() {
            return $scope.placekey !== null && $scope.placekey !== undefined;
        };

        $scope.isTourCategory = function() {
            return $scope.selectedCategories.filter((cat) => cat.val().type === 7).length > 0;
            // return checkCategoryByType(7);
        };

        $scope.isSleepCategory = function() {
            return $scope.selectedCategories.filter((cat) => cat.val().type === 1).length > 0;
            // return checkCategoryByType(1);
        };

        $scope.checkCategoryByType = function(type) {
            return $scope.selectedCategories.filter((cat) => cat.val().type === type).length > 0;
        };
    };
})();