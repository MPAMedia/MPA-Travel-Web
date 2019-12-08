(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('LanguageService', LanguageService);

    LanguageService.$inject = ['$rootScope', 'CountryService']; // jshint
    function LanguageService($rootScope, CountryService) {
        // firebase
        var factory = this;
        factory.languages = [];
        // init service
        var service = {};
        service.languages = factory.languages; // list
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddLanguageCode = AddLanguageCode;
        service.RemoveLanguageCode = RemoveLanguageCode;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase( /*onAdded, onChanged, onRemoved*/ onloaded) {
            if (!factory.ref) {
                // init language ref
                factory.ref = firebase.database().ref('language_code');
                // loaded
                factory.ref.once('value', function(snapshot) {
                    factory.finishLoadData = true;
                    if (!$rootScope.languagekey) {
                        AddLanguageCode(null, 'en');
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.languages.push(data);
                    $rootScope.languagekey = data.key;
                    if (onloaded && $rootScope.languagekey) {
                        onloaded(true);
                    }
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.languages.length; i++) {
                        var code = factory.languages[i];
                        if (code.key === data.key) {
                            factory.languages[i] = data;
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.languages.length; i++) {
                        var code = factory.languages[i];
                        if (code.key === data.key) {
                            factory.languages.splice(i, 1);
                            break;
                        }
                    }
                });
            } else {
                if (onloaded) {
                    onloaded(false);
                }
            }
        };

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                factory.languages = [];
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddLanguageCode(key, code) {
            var param = { code: code };
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }
        // remove
        function RemoveLanguageCode(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }
    };

})();
