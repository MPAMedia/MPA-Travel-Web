(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CountryService', CountryService);

    CountryService.$inject = []; // jshint
    function CountryService() {
        // firebase
        var factory = this;
        factory.countries = [];
        factory.finishLoadData = false;
        factory.onFinishLoadData = null;
        // init service
        var service = {};
        service.countries = factory.countries; // list
        service.InitFirebase = InitFirebase;
        service.AddCountry = AddCountry;
        service.RemoveCountry = RemoveCountry;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(languageKey, finishload) {
            if (!factory.ref && languageKey) {
                factory.finishLoadData = false;
                // init language ref
                factory.ref = firebase.database().ref('country/' + languageKey);

                // finish load data event
                factory.ref.once('value', function(snapshot) {
                    factory.finishLoadData = true;
                    if (finishload) {
                        finishload(true);
                    }
                });

                // add
                factory.ref.on('child_added', function(data) {
                    factory.countries.push(data);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.countries.length; i++) {
                        var obj = factory.countries[i];
                        if (obj.key === data.key) {
                            factory.countries[i] = data;
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.countries.length; i++) {
                        var obj = factory.countries[i];
                        if (obj.key === data.key) {
                            factory.countries.splice(i, 1);
                            break;
                        }
                    }
                });
            }
            else if(factory.ref){
                finishload(false);
            }
        };

        // clear
        // function ClearFirebase() {
        //     if (factory.ref) {
        //         factory.ref.off();
        //         factory.ref = null;
        //         while (factory.countries.length > 0) {
        //             factory.countries.pop();
        //         }
        //     }
        // }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddCountry(key, param) {
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveCountry(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }
    };

})();
