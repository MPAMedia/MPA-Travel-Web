'use strict';
/**
 * @ngdoc overview
 * @name tay3lo-admin
 * @description
 * # tay3lo-admin
 *
 * Main module of the application.
 */
angular
    .module('tay3lo-admin', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'ngCookies',
        'ngRoute',
        'mdr.file',
        'datatables'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: true,
                events: true,
            });
            // run with state
            $urlRouterProvider.otherwise('/login');
            // config
            $stateProvider
                .state('login', {
                    templateUrl: 'pages/login.html',
                    url: '/login',
                    controller: 'LoginController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/login.controller.js']
                            })
                        }
                    }
                })
                .state('loading', {
                    templateUrl: 'pages/dashboard/loading.view.html',
                    url: '/loading',
                    controller: 'LoadingController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/loading.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard', {
                    url: '/dashboard',
                    controller: 'MainController',
                    templateUrl: 'pages/dashboard/main.html',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/main.controller.js', 'scripts/services/language.service.js', 'scripts/services/country.service.js']
                            })
                        },
                    }
                })
                .state('dashboard.place', {
                    templateUrl: 'pages/place.html',
                    url: '/place',
                    controller: 'PlaceController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/place.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.add-place', {
                    templateUrl: 'pages/add_place.html',
                    url: '/add-place',
                    controller: 'AddPlaceController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/add.place.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.city-category', {
                    templateUrl: 'pages/city-category.html',
                    url: '/city-category',
                    controller: 'CityCategoryController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/city.category.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.city', {
                    templateUrl: 'pages/city.html',
                    url: '/city',
                    controller: 'CityController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/city.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.category', {
                    templateUrl: 'pages/category.html',
                    url: '/category',
                    controller: 'CategoryController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/category.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.user', {
                    templateUrl: 'pages/user.html',
                    url: '/user',
                    controller: 'UserController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/user.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.comment', {
                    templateUrl: 'pages/comment.html',
                    url: '/comment',
                    controller: 'CommentController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/comment.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.tip', {
                    templateUrl: 'pages/tip.html',
                    url: '/tip',
                    controller: 'TipController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/tip.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.sub-category', {
                    templateUrl: 'pages/sub-category.html',
                    url: '/sub-category',
                    controller: 'SubCategoryController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/sub.category.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.facility', {
                    templateUrl: 'pages/facility.html',
                    url: '/facility',
                    controller: 'FacilityController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/facility.controller.js']
                            })
                        }
                    }
                })
                .state('dashboard.country', {
                    templateUrl: 'pages/country.html',
                    url: '/country',
                    controller: 'CountryController',
                    resolve: {
                        loadMyFile: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tay3lo-admin',
                                files: ['scripts/controllers/country.controller.js']
                            })
                        }
                    }
                })
        }
    ])
    .run(['$rootScope', '$cookieStore', '$state', '$location',
        function($rootScope, $cookieStore, $state, $location) {
            // CHECK cookie to redirect
            var encodeId = $cookieStore.get('globals');
            if (encodeId === null || encodeId === undefined) {
                if ($location.path() !== '/login') {
                    $location.path('/login');
                }
            } else {
                $rootScope.currentUserUID = Base64.decode(encodeId);
                $location.path('/loading');
            }

            // Change location
            $rootScope.$on('$locationChangeStart', function(event, next, current) {
                // handle something
            });
        }
    ])
    // directive
    .directive("fileread", [function() {
        return {
            scope: {
                fileread: "=",
                photofile: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function(changeEvent) {
                    scope.$apply(function() {
                        scope.fileread = changeEvent.target.files[0];
                        // reader
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            scope.$apply(function() {
                                scope.photofile = e.target.result;
                            });
                        };
                        reader.readAsDataURL(scope.fileread);
                    });
                });
                scope.$watch(scope.fileread, function(file) {
                    // scope.fileread = file;
                    element.val(file);
                });
            }
        }
    }])
    .directive('selectpicker', ['$parse', function($parse) {
        return {
            restrict: 'ACE',
            require: '?ngModel',
            priority: 10,
            compile: function(tElement, tAttrs, transclude) {
                tElement.selectpicker($parse(tAttrs.selectpicker)());
                tElement.selectpicker('refresh');
                return function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                        scope.$evalAsync(function() {
                            if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) element.val(newVal);
                            element.selectpicker('refresh');
                        });
                    });
                    var superRender = ngModel.$render;
                    ngModel.$render = function() {
                        superRender();
                        scope.$evalAsync(function() {
                            element.selectpicker('refresh');
                        });
                    }
                };
            }

        };
    }])
    .directive('myTable', function() {
        return function(scope, element, attrs) {

            // apply DataTable options, use defaults if none specified by user
            var options = {};
            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    "bStateSave": true,
                    "iCookieDuration": 2419200,
                    /* 1 month */
                    "bJQueryUI": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bDestroy": true
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller
            var explicitColumns = [];
            element.find('th').each(function(index, elem) {
                explicitColumns.push($(elem).text());
            });
            if (explicitColumns.length > 0) {
                options["aoColumns"] = explicitColumns;
            } else if (attrs.aoColumns) {
                options["aoColumns"] = scope.$eval(attrs.aoColumns);
            }

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
            }

            if (attrs.fnRowCallback) {
                options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
            }

            // apply the plugin
            var dataTable = element.dataTable(options);



            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function(value) {
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData(scope.$eval(attrs.aaData));
                }
            });
        };
    })
    .directive('myEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.myEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
