(function() {
  'use strict';
  angular.module('tay3lo-admin').factory('PlaceService', PlaceService);

  PlaceService.$inject = ['FacilityService', 'TagService'];

  function PlaceService(FacilityService, TagService) {
    // firebase
    var factory = this;
    factory.loadedAll = false;
    factory.places = {};
    factory.callback = null;
    factory.allRefs = {};
    // init service
    var service = {};
    service.places = factory.places; // list
    service.InitFirebaseAll = InitFirebaseAll;
    service.InitFirebase = InitFirebase;
    service.AddPlace = AddPlace;
    service.RemovePlace = RemovePlace;
    service.DeactivePlace = DeactivePlace;
    service.ChangePriority = ChangePriority;
    return service;

    // -------------------------------- //
    // init 1
    function InitFirebaseAll(cities, onload) {
      if (!factory.loadedAll) {
        var totalFinish = 0;
        var checkFinish = function(){
          totalFinish++;
          if (totalFinish === cities.length) {
            if (onload) {
              onload(true);
            }
            factory.loadedAll = true;
          }
        };
        for (var i = 0; i < cities.length; i++) {
          // init city ref
          var city = cities[i];
          InitPlacesCity(city.key, function(changed){
            checkFinish();
          });
        }
      } else if (onload) {
        onload(false);
      }
    };

    function InitPlacesCity(citykey, finish){
      if (factory.allRefs[citykey]){
        finish(false);
        return;
      }
      var ref = firebase.database().ref('place/' + citykey);
      factory.allRefs[citykey] = ref;
      // onload
      ref.once('value', function(snapshot) {
        finish(true);
      });
      // add
      ref.on('child_added', function(data) {
        if (!factory.places[citykey]){
          factory.places[citykey] = [];
        }
        factory.places[citykey].push(data);
        if (factory.callback) {
          factory.callback();
          factory.callback = null;
        }
      });
      // change
      ref.on('child_changed', function(data) {
        var cityplaces = factory.places[citykey];
        for (var i = 0; i < cityplaces.length; i++) {
          var obj = cityplaces[i];
          if (obj.key === data.key) {
            factory.places[citykey][i] = data;
            break;
          }
        }
        if (factory.callback) {
          factory.callback();
          factory.callback = null;
        }
      });
      // remove
      ref.on('child_removed', function(data) {
        var cityplaces = factory.places[citykey];
        for (var i = 0; i < cityplaces.length; i++) {
          var obj = cityplaces[i];
          if (obj.key === data.key) {
            factory.places[citykey].splice(i, 1);
            break;
          }
        }
        if (factory.callback) {
          factory.callback();
          factory.callback = null;
        }
      });
    }

    // init 2
    function InitFirebase(citykey, onload) {
      InitPlacesCity(citykey, onload);
    };

    // clear
    // function ClearFirebase() {
    //   factory.callback = null;
    //   if (factory.allRefs) {
    //     for (var i = factory.allRefs.length - 1; i >= 0; i--){
    //       var ref = factory.allRefs[i];
    //       ref.off();
    //       ref = null;
    //     }
    //     factory.allRefs = [];
    //     factory.places = [];
    //   }
    // }

    // add - if key == null -> ADD, key != null -> EDIT
    function AddPlace(citykey, key, param, callback) {
      // get ref
      var ref = factory.allRefs[citykey];
      var add = function() {
        // callback
        factory.callback = callback;
        // save
        if (key) {
          ref.child(key).set(param);
        } else {
          ref.push().set(param);
        }
      };
      if (!ref){
        InitPlacesCity(citykey, function(changed){
            add();
        });
      }
      else{
        add();
      }
    }

    // remove
    function RemovePlace(citykey, key, callback) {
      var ref = factory.allRefs[citykey];
      if (key && ref) {
        factory.callback = callback;
        ref.child(key).remove();
      }
    }

    // Active/deactive
    function DeactivePlace(citykey, key, deactive, callback) {
      var ref = factory.allRefs[citykey];
      if (key && ref) {
        factory.callback = callback;
        ref.child(key + '/deactived').set(deactive);
      }
    }

    // change place priority
    function ChangePriority(citykey, key, priority, callback) {
      var ref = factory.allRefs[citykey];
      if (key && ref) {
        factory.callback = callback;
        ref.child(key + '/priority').set(priority);
      }
    }
  };

})();
