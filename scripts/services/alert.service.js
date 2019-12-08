(function() {
    'use strict';
    angular.module('tay3lo-admin').factory('AlertService', AlertService);

    AlertService.$inject = []; // jshint
    function AlertService() {
        var vm = this;
        var service = {};
        service.ShowAlert = ShowAlert;
        service.ShowAlertConfirm = ShowAlertConfirm;
        service.ShowDialogInput = ShowDialogInput;
        return service;
        // SHOW ALERT
        function ShowAlert(ev, title, content) {
        };

        // Alert confirm
        function ShowAlertConfirm(ev, title, content, callbackOk, callbackCancel) {
            
        }

        // Dialog input value
        function ShowDialogInput(ev, title, content, placeholder, buttonOk, callbackOk, callbackCancel) {
        };
    };
})();
