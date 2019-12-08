(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CityService', CityService);

    CityService.$inject = []; // jshint
    function CityService() {
        // firebase
        var factory = this;
        factory.cities = [];
        factory.loaded = false;
        factory.callbackOnload = null;
        // init service
        var service = {};
        service.cities = factory.cities; // list
        service.InitFirebase = InitFirebase;
        service.AddCity = AddCity;
        service.RemoveCity = RemoveCity;
        service.ChangePriority = ChangePriority;
        service.DeactiveCity = DeactiveCity;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(countryKey, onload) {
            if (!factory.ref) {
              factory.loaded = false;
            	// init city ref
                factory.ref = firebase.database().ref('city/' + countryKey);
                // onload
                factory.ref.once('value', function(snapshot) {
                    if (onload) {
                        onload(true);
                    }
                    if (factory.callbackOnload){
                      factory.callbackOnload(true);
                    }
                    factory.loaded = true;
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.cities.push(data);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.cities.length; i++) {
                        var obj = factory.cities[i];
                        if (obj.key === data.key) {
                            factory.cities[i] = data;
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.cities.length; i++) {
                        var obj = factory.cities[i];
                        if (obj.key === data.key) {
                            factory.cities.splice(i, 1);
                            break;
                        }
                    }
                });
            }
            else if (factory.ref && !factory.loaded){
              factory.callbackOnload = onload;
            }
            else if(factory.loaded && onload){
                onload(false);
            }
        };

        // clear
        // function ClearFirebase() {
        //     if (factory.ref) {
        //         factory.ref.off();
        //         factory.ref = null;
        //         while(factory.cities.length > 0){
        //             factory.cities.pop();
        //         }
        //     }
        // }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddCity(key, param) {
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveCity(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }

        // update priority
        // change place priority
        function ChangePriority(key, priority, callback) {
            if (key) {
                factory.callback = callback;
                factory.ref.child(key + '/priority').set(priority);
            }
        }

        // Active/deactive
        function DeactiveCity(key, deactive, callback) {
            if (key) {
                factory.callback = callback;
                factory.ref.child(key + '/deactived').set(deactive);
            }
        }
    };

})();
