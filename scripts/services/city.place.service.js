(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CityPlaceService', CityPlaceService);

    CityPlaceService.$inject = [];

    function CityPlaceService() {
        var factory = this;
        factory.cityplaces = [];

        var service = {};
        service.cityplaces = factory.cityplaces; // list
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddCityPlace = AddCityPlace;
        service.RemoveCityPlace = RemoveCityPlace;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(citycategorykey, subcategorykey, onload) {
            if (!factory.ref) {
                // init city ref
                factory.ref = firebase.database().ref('city-place/' + citycategorykey + '/' + subcategorykey);
                // load all data
                factory.ref.once('value', function(snapshot) {
                    if (onload) {
                        onload(true);
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.cityplaces.push(data);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.cityplaces.length; i++) {
                        var obj = factory.cityplaces[i];
                        if (obj.key === data.key) {
                            factory.cityplaces[i] = data;
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.cityplaces.length; i++) {
                        var obj = factory.cityplaces[i];
                        if (obj.key === data.key) {
                            factory.cityplaces.splice(i, 1);
                            break;
                        }
                    }
                });
            } else if (onload) {
                onload();
            }
        };

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                while (factory.cityplaces.length > 0) {
                    factory.cityplaces.pop();
                }
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddCityPlace(key, placekey) {
            // create param
            var param = {
                placekey: placekey
            };
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveCityPlace(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }
    };

})();
