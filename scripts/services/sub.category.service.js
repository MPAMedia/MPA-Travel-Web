(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('SubCategoryService', SubCategoryService);

    SubCategoryService.$inject = []; // jshint
    function SubCategoryService() {
        // firebase
        var factory = this;
        factory.subcategories = [];
        factory.dictSubcategories = {};
        // init service
        var service = {};
        service.subcategories = factory.subcategories; // list
        service.dictSubcategories = factory.dictSubcategories;
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddSubCategory = AddSubCategory;
        service.RemoveSubCategory = RemoveSubCategory;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(categorykey, onload) {
            if (categorykey) {
                if (!factory.ref) {
                    // init subcategory ref
                    factory.ref = firebase.database().ref('subcategory/' + categorykey);
                    // onload
                    factory.ref.once('value', function(snapshot) {
                        if (onload) {
                            onload(true);
                        }
                    });
                    // add
                    factory.ref.on('child_added', function(data) {
                        factory.subcategories.push(data);
                    });
                    // change
                    factory.ref.on('child_changed', function(data) {
                        for (var i = 0; i < factory.subcategories.length; i++) {
                            var obj = factory.subcategories[i];
                            if (obj.key === data.key) {
                                factory.subcategories[i] = data;
                                break;
                            }
                        }
                    });
                    // remove
                    factory.ref.on('child_removed', function(data) {
                        for (var i = 0; i < factory.subcategories.length; i++) {
                            var obj = factory.subcategories[i];
                            if (obj.key === data.key) {
                                factory.subcategories.splice(i, 1);
                                break;
                            }
                        }
                    });
                } else if (factory.ref && onload) {
                    onload(false);
                }
            }
            else if (categorykey == null){
                // get all subcategory
                if (!factory.ref2) {
                    // init subcategory ref
                    factory.ref2 = firebase.database().ref('subcategory');
                    // onload
                    factory.ref2.once('value', function(snapshot) {
                        if (onload) {
                            onload(true);
                        }
                    });
                    // add
                    factory.ref2.on('child_added', function(data) {
                        factory.dictSubcategories[data.key] = data.val();
                    });
                } else if (factory.ref2 && onload) {
                    onload(false);
                }
            }
        };

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                while (factory.subcategories.length > 0) {
                    factory.subcategories.pop();
                }
            }
            if (factory.ref2) {
                factory.ref2.off();
                factory.ref2 = null;
                factory.dictSubcategories = {};
            }
        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddSubCategory(key, name) {
            // get type
            var type = factory.subcategories.length + 1;
            factory.subcategories.sort(function(a, b) {
                return a.val().type - b.val().type;
            });
            if (key) {
                for (var i = 0; i < factory.subcategories.length; i++) {
                    var info = factory.subcategories[i];
                    if (key && key === info.key) {
                        type = info.val().type;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < factory.subcategories.length; i++) {
                    var info = factory.subcategories[i];
                    if (info.val().type !== i + 1 && (type === factory.subcategories.length + 1)) {
                        type = i + 1;
                    }
                    // check exist before add
                    if (name === info.val().name) {
                        callback(info);
                        return;
                    }
                }
            }
            var param = { name: name};
            if (key) {
                factory.ref.child(key).set(param);
            } else {
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveSubCategory(key) {
            if (key) {
                factory.ref.child(key).remove();
            }
        }
    };

})();
