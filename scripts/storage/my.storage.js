(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('MyStorage', MyStorage);

    MyStorage.$inject = []; // jshint
    function MyStorage() {
        var factory = this;
        // init service
        var service = {};
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.UploadCityPhoto = UploadCityPhoto;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase() {
            if (!factory.ref) {
                // init city ref
                factory.ref = firebase.storage().ref('trid');
            }
        };

        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
            }
        }

        function UploadCityPhoto(cityname, file, success, failure) {
            if (factory.ref && cityname && file) {
                var metadata = {
                    'contentType': file.type
                };
                factory.ref.child('images/' + cityname + '/' + file.name).put(file, metadata).then(function(snapshot) {
                    var url = snapshot.metadata.downloadURLs[0];
                    if (success) {
                        success(url);
                    }
                }).catch(function(error) {
                    console.error('Upload failed:', error);
                    failure();
                });
            }
            else if(failure){
                failure();
            }
        }

    };

})();
