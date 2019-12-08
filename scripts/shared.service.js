(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('SharedService', SharedService);

    SharedService.$inject = [];//
    function SharedService() {
        // firebase
        var factory = this;
        // init service
        var service = {};

        // place controller
        service.selectedCityKey = null;
        service.selectedPlace = null;
        return service;

        
    };

})();
