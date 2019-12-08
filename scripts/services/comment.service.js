(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CommentService', CommentService);

    CommentService.$inject = ['UserService', '$rootScope', 'PlaceService', 'CityService', 'CategoryInfoService']; // jshint
    function CommentService(UserService, $rootScope, PlaceService, CityService, CategoryInfoService) {
        // firebase
        var factory = this;
        /*
        {
          place:
          updated:
          top:
          all:[snap]
        }
        */
        factory.comments = [];
        factory.callback = null;
        factory.callbackOnload = null;
        factory.loaded = false;
        // init service
        var service = {};
        service.comments = factory.comments; // list
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddComment = AddComment;
        service.RemoveComment = RemoveComment;
        service.DeactiveComment = DeactiveComment;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(onload) {
            if (!factory.ref) {
              factory.loaded = false;
            	// init comment ref
                factory.ref = firebase.database().ref('comments');
                // onload
                factory.ref.once('value', function(snapshot) {
                    if (onload) {
                        onload(true);
                    }
                    if (factory.callbackOnload){
                      factory.callbackOnload(true);
                      factory.callbackOnload = null;

                    }
                    factory.loaded = true;
                });
                // add
                factory.ref.on('child_added', function(data) {
                    var placeComment = ParseComment(data);
                    factory.comments.push(placeComment);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.comments.length; i++) {
                        var obj = factory.comments[i];
                        if (obj.placekey === data.key) {
                            var temp = ParseComment(data);
                            factory.comments[i] = temp;
                            if (factory.callback !== null) {
                              factory.callback(temp);
                              factory.callback = null;
                            }
                            break;
                        }
                    }
                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.comments.length; i++) {
                        var obj = factory.comments[i];
                        if (obj.placekey === data.key) {
                            factory.comments.splice(i, 1);
                            if (factory.callback !== null) {
                              factory.callback(null);
                              factory.callback = null;
                            }
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

        function ParseComment(data){
          // find place
          var info = {
            place: "",
            email: "",
            city: ""
          };
          var allPlaces = PlaceService.places;
          var allCities = CityService.cities;
          var citykeys = Object.keys(allPlaces);
          // find city & place
          for (var i = 0; i < citykeys.length; i++){
            var key = citykeys[i];
            var foundPlace = allPlaces[key].filter(function(p){
              return p.key === data.key;
            });
            var foundCity = allCities.filter(function(c){
              return c.key === key;
            });
            if (foundPlace.length > 0){
              info.place = foundPlace[0].val();
              info.city = foundCity.length > 0 ? foundCity[0].val().name : key;
              break;
            }
          }
          var cats = [];
          if (info.place.categories !== null && info.place.categories !== undefined) {
            for (var i = 0; i < info.place.categories.length; i++){
              var x = CategoryInfoService.categoriesKeyMap[info.place.categories[i]];
              cats.push(x);
            }
          }

          var placeComment = {
            placekey: data.key,
            citykey: info.city,
            placename: info.place.name,
            categories: info.place.categories,
            email: info.place.email,
            placetext: info.place.description,
            updated: null,
            top: '',
            categories: cats,
            all: []
          };
          var keys = Object.keys(data.val());
          for(var j = 0; j < keys.length; j++) {
            var snap = data.val()[keys[j]];
            snap.key = keys[j];
            // Get sender name & email
            for(var k = 0; k < UserService.users.length; k++){
              var user = UserService.users[k];
              if (user.key === snap.senderId) {
                snap.sender = user.val().name;
                snap.email = user.val().email;
                break;
              }
            }
            // Time & top comment
            var time = Math.min(snap.updatedAt, snap.createdAt);
            if (placeComment.updated === null || time < placeComment.updated) {
              placeComment.updated = time;
              placeComment.top = snap.text;
              placeComment.topSender = snap.sender;
              placeComment.topEmail = snap.email;
            }
            placeComment.all.push(snap);
          }
          return placeComment;
        }

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                factory.callback = null;
                while(factory.comments.length > 0){
                    factory.comments.pop();
                }
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddComment(place, text, callback) {
            if (place) {
              factory.callback = callback;
              var time = new Date();
              time = time.getTime()/1000;
              var param = {
                senderId: $rootScope.currentUserUID,
                text: text,
                isRemoved: false,
                createdAt: time,
                updatedAt: time
              };
              factory.ref.child(place).push().set(param);
            }
        }

        // remove
        function RemoveComment(place, key, callback) {
          factory.callback = null;
            if (place !== null && key !== null) {
                factory.callback = callback;
                factory.ref.child(place + '/' + key).remove();
            }
        }

        // Active/deactive
        function DeactiveComment(place, key, deactive, callback) {
            if (key) {
                factory.callback = callback;
                factory.ref.child(place + '/' + key + '/isRemoved').set(deactive);
            }
        }
    };

})();
