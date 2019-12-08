(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CategoryInfoService', CategoryInfoService);

        /*
        Category - type
        Sleep = 1
        Eat = 2
        Night Light = 3
        See & Do = 4
        Activity = 5
        Shopping = 6
        Tour = 7
        Transport = 8
        Stories = 9
        City Info = 10
        Tips = 11
        Emergency = 12
        Events = 13
        Drink = 14
        */

    CategoryInfoService.$inject = []; // jshint
    function CategoryInfoService() {
        // firebase
        var factory = this;
        factory.categories = [];
        factory.categoriesKeyMap = {};
        factory.callback = null;
        // init service
        var service = {};
        service.categories = factory.categories; // list
        service.categoriesKeyMap = factory.categoriesKeyMap;
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddCategoryInfo = AddCategoryInfo;
        service.UpdateCount = UpdateCount;
        service.RemoveCategoryInfo = RemoveCategoryInfo;
        service.ChangePriority = ChangePriority;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(onloaded) {
            if (!factory.ref) {
                // init city ref
                factory.ref = firebase.database().ref('category_info');
                // load all data
                factory.ref.once('value', function(snapshot) {
                    if (onloaded) {
                        onloaded(true);
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    factory.categories.push(data);
                    factory.categoriesKeyMap[data.key] = data.val().name;
                    if (factory.callback) {
                        factory.callback(data);
                        factory.callback = null;
                    }
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    factory.categoriesKeyMap[data.key] = data.val().name;
                    for (var i = 0; i < factory.categories.length; i++) {
                        var obj = factory.categories[i];
                        if (obj.key === data.key) {
                            factory.categories[i] = data;
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
                  factory.categoriesKeyMap[data.key] = "";
                    for (var i = 0; i < factory.categories.length; i++) {
                        var obj = factory.categories[i];
                        if (obj.key === data.key) {
                            factory.categories.splice(i, 1);
                            break;
                        }
                    }
                    if (factory.callback) {
                        factory.callback(data);
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
                while (factory.categories.length > 0) {
                    factory.categories.pop();
                }
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddCategoryInfo(key, name, priceUnit, callback) {
            var count = 0;
            // get type
            var type = factory.categories.length + 1;
            factory.categories.sort(function(a, b){
                return a.val().type - b.val().type;
            });
            if (key) {
                for (var i = 0; i < factory.categories.length; i++) {
                    var info = factory.categories[i];
                    if (key && key === info.key) {
                        count = info.val().count;
                        type = info.val().type;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < factory.categories.length; i++) {
                    var info = factory.categories[i];
                    if (info.val().type !== i + 1 && (type === factory.categories.length + 1)) {
                        type = i + 1;
                    }
                    // check exist before add
                    if (name === info.val().name) {
                        callback(info);
                        return;
                    }
                }
            }
            // create param
            var param = {
                name: name,
                type: type,
                count: count,
                priceUnit: priceUnit
            };
            factory.callback = callback;
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        function UpdateCount(data, value) {
            var count = data.val().count + value;
            var param = {
                name: data.val().name,
                type: data.val().type,
                count: count
            };
            factory.ref.child(data.key).set(param);
            factory.callback = null;
        }

        // remove
        function RemoveCategoryInfo(key) {
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
    };

})();
