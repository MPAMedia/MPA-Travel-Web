(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('FacilityService', FacilityService);

    FacilityService.$inject = [];

    function FacilityService() {
        var factory = this;
        factory.facilities = [];

        var service = {};
        service.facilities = factory.facilities; // list
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddFacility = AddFacility;
        service.RemoveFacility = RemoveFacility;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(onload) {
            if (!factory.ref) {
                // init city ref
                factory.ref = firebase.database().ref('facility');
                // load all data
                factory.ref.once('value', function(snapshot) {
                    if (onload) {
                        onload(true);
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.facilities.push(data);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.facilities.length; i++) {
                        var obj = factory.facilities[i];
                        if (obj.key === data.key) {
                            factory.facilities[i] = data;
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.facilities.length; i++) {
                        var obj = factory.facilities[i];
                        if (obj.key === data.key) {
                            factory.facilities.splice(i, 1);
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
                while (factory.facilities.length > 0) {
                    factory.facilities.pop();
                }
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddFacility(key, name) {
            // get type
            var type = factory.facilities.length + 1;
            factory.facilities.sort(function(a, b){
                return a.val().type - b.val().type;
            });
            if (key) {
                for (var i = 0; i < factory.facilities.length; i++) {
                    var info = factory.facilities[i];
                    if (key && key === info.key) {
                        type = info.val().type;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < factory.facilities.length; i++) {
                    var info = factory.facilities[i];
                    if (info.val().type !== i + 1 && (type === factory.facilities.length + 1)) {
                        type = i + 1;
                    }
                    // check exist before add
                    if (name === info.val().name) {
                        return;
                    }
                }
            }
            // create param
            var param = {
                name: name,
                type: type
            };
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveFacility(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }
    };

})();
