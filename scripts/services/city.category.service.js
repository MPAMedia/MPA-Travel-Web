(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .factory('CityCategoryService', CityCategoryService);

    CityCategoryService.$inject = ['CategoryInfoService']; // jshint
    function CityCategoryService(CategoryInfoService) {
        // firebase
        var factory = this;
        factory.categories = [];
        factory.city_categories = [];
        // init service
        var service = {};
        service.categories = factory.categories; // list
        service.city_categories = factory.city_categories;
        service.InitFirebase = InitFirebase;
        service.ClearFirebase = ClearFirebase;
        service.AddCategory = AddCategory;
        service.RemoveCategory = RemoveCategory;
        service.CheckExist = CheckExist;
        service.ChangeCityCatOrder = ChangeCityCatOrder;
        return service;

        // -------------------------------- //
        // init
        function InitFirebase(cityKey, onload) {
            if (!factory.ref && cityKey) {
                // init city ref
                factory.ref = firebase.database().ref('category/' + cityKey);
                // load all data
                factory.ref.once('value', function(snapshot) {
                    if (onload) {
                        onload(true);
                    }
                });
                // add
                factory.ref.on('child_added', function(data) {
                    var citycat = {
                      val: data.val(),
                      key: data.key,
                    //   name: data.val().key,
                      name_en: data.val().key,
                      name_fr: data.val().key,
                      name_it: data.val().key,
                      name_nl: data.val().key,
                      name_ru: data.val().key,
                      name_ar: data.val().key,
                      name_swiss_fr: data.val().key,
                      name_swiss_it: data.val().key,
                      name_swiss_nl: data.val().key
                    };
                    for (var i = 0; i < CategoryInfoService.categories.length; i++) {
                        var info = CategoryInfoService.categories[i];
                        if (info.key === data.val().category_key) {
                            factory.categories.push(info);
                            // citycat.name = info.val().name;
                            citycat.name_en = info.val().name_en;
                            citycat.name_fr = info.val().name_fr;
                            citycat.name_it = info.val().name_it;
                            citycat.name_nl = info.val().name_nl;
                            citycat.name_ru = info.val().name_ru;
                            citycat.name_ar = info.val().name_ar;
                            citycat.name_swiss_fr = info.val().name_swiss_fr;
                            citycat.name_swiss_it = info.val().name_swiss_it;
                            citycat.name_swiss_nl = info.val().name_swiss_nl;
                            break;
                        }
                    }
                    factory.city_categories.push(citycat);
                });
                // change
                factory.ref.on('child_changed', function(data) {
                    for (var i = 0; i < factory.city_categories.length; i++) {
                        var obj = factory.city_categories[i];
                        if (obj.key === data.key) {
                          var citycat = {
                            val: data.val(),
                            key: obj.key,
                            // name: obj.name
                            name_en: obj.name_en,
                            name_fr: obj.name_fr,
                            name_it: obj.name_it,
                            name_nl: obj.name_nl,
                            name_ru: obj.name_ru,
                            name_ar: obj.name_ar,
                            name_swiss_fr: obj.name_swiss_fr,
                            name_swiss_it: obj.name_swiss_it,
                            name_swiss_nl: obj.name_swiss_nl
                          };
                          factory.city_categories[i] = citycat;
                            break;
                        }
                    }

                });
                // remove
                factory.ref.on('child_removed', function(data) {
                    for (var i = 0; i < factory.city_categories.length; i++) {
                        var obj = factory.city_categories[i];
                        if (obj.key === data.key) {
                            factory.city_categories.splice(i, 1);
                            // update count
                            for (var i = 0; i < factory.categories.length; i++) {
                                var info = factory.categories[i];
                                if (info.key === data.val().category_key) {
                                    factory.categories.splice(i, 1);
                                    // update count
                                    CategoryInfoService.UpdateCount(info, -1);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                });
            } else if (onload) {
                onload(false);
            }
        }

        // clear
        function ClearFirebase() {
            if (factory.ref) {
                factory.ref.off();
                factory.ref = null;
                while (factory.categories.length > 0) {
                    factory.categories.pop();
                }
                while (factory.city_categories.length > 0) {
                    factory.city_categories.pop();
                }
            }
        }

        // Show | Hide (default)
        function EditCategoryShow(categorykey, show) {
          if (!CheckExist(categorykey)) {
            return;
          }

        }

        // add - if key == null -> ADD, key != null -> EDIT
        function AddCategory(category_key) {
            if (!CheckExist(category_key)) {
                var param = { category_key: category_key };
                factory.ref.push().set(param);
            }
        }

        // remove
        function RemoveCategory(category_key) {
            for (var i = 0; i < factory.city_categories.length; i++) {
                var obj = factory.city_categories[i];
                if (obj.val.category_key === category_key) {
                    factory.ref.child(obj.key).remove();
                    return;
                }
            }
        }

        // check city has an category
        function CheckExist(category_key) {
            for (var i = 0; i < factory.city_categories.length; i++) {
                var obj = factory.city_categories[i];
                if (obj.val.category_key === category_key) {
                    return true;
                }
            }
            return false;
        }


        // update priority
        // change place priority
        function ChangeCityCatOrder(key, order) {
            if (key) {
                factory.ref.child(key + '/order').set(order);
            }
        }
    };

})();
