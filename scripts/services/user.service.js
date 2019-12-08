(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('UserService', UserService);

    UserService.$inject = []; // jshint
    function UserService() {
        // firebase
        var factory = this;
        factory.users = [];
        factory.callback = null;
        // init service
        var service = {};
        service.users = factory.users; // list
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.ChangeUserRole = ChangeUserRole;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(onloaded) {
            if (!factory.ref) {
                // init city ref
                factory.ref = firebase.database().ref('users');
                // load all data
                factory.ref.once('value', function(snapshot) {
                    if (onloaded) {
                        onloaded(true);
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.users.push(data);
                    if (factory.callback) {
                        factory.callback(data);
                        factory.callback = null;
                    }
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.users.length; i++) {
                        var obj = factory.users[i];
                        if (obj.key === data.key) {
                            factory.users[i] = data;
                            break;
                        }
                    }
                    if (factory.callback) {
                        factory.callback(data);
                        factory.callback = null;
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.users.length; i++) {
                        var obj = factory.users[i];
                        if (obj.key === data.key) {
                            factory.users.splice(i, 1);
                            break;
                        }
                    }
                    if (factory.callback) {
                        factory.callback(null);
                        factory.callback = null;
                    }
                });
            } else if (onloaded) {
                onloaded(false);
            }
        };

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                while (factory.users.length > 0) {
                    factory.users.pop();
                }
            }
        };

        function ChangeUserRole(key, isadmin, callback){
          if (key !== null) {
            factory.callback = callback;
            factory.ref.child(key + '/isAdmin').set(isadmin);
          }
        }

    };

})();
