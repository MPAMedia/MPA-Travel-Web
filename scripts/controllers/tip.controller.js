(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('TipController', TipController);

    TipController.$inject = ['$scope', '$rootScope', '$state', 'PlaceService', 'CityService', 'CategoryInfoService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function TipController($scope, $rootScope, $state, PlaceService, CityService, CategoryInfoService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.tips = [];
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip').withOption('order', [2, 'desc']);
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(1).notSortable()
        ];
        (function initController() {
            // get tip category key
            var cats = CategoryInfoService.categories.filter(function(c){
              return c.val().type == 11;
            });
            if (cats.length > 0){
              var tipkey = cats[0].key;
              var alltips = [];
              // city
              var cities = {};
              for (var i = 0; i < CityService.cities.length; i++){
                var c = CityService.cities[i];
                cities[c.key] = c.val().name;
              }
              // get tip
              var all = PlaceService.places;
              var citykeys = Object.keys(all);
              for (var i = 0; i < citykeys.length; i++){
                var citykey = citykeys[i];
                var cityplaces = all[citykey];
                var citytips = cityplaces.filter(function(p){
                  for (var j = 0; j < p.val().categories.length; j++){
                    var catkey = p.val().categories[j];
                    if (catkey === tipkey){
                      return true;
                    }
                  }
                  return false;
                });
                // push to all
                for (var j = 0; j < citytips.length; j++){
                  var t = citytips[j];
                  var tip = {
                    city: cities[citykey],
                    name: t.val().name,
                    email: t.val().email,
                    text: t.val().description,
                    createdAt: t.val().createdAt,
                    updatedAt: t.val().updatedAt
                  };
                  alltips.push(tip);
                }
              }
              $scope.tips = alltips;
            }
        })();

        $scope.deleteCommentAtIndex = function(index) {
          if ($scope.current === null || index >= $scope.current.all.length) {
            return
          }
          var r = confirm('Are you sure?');
          if (!r) {
              return;
          }
          var item = $scope.current.all[index];
          CommentService.RemoveComment($scope.current.placekey, item.key, function(result) {
            // reset
            $scope.resetCurrent(result);
          });
        };

        // Active|Deactive Comment
        $scope.deactiveCommentAtIndex = function(index) {
          if ($scope.current === null || index >= $scope.current.all.length) {
            return
          }
          var item = $scope.current.all[index];
          CommentService.DeactiveComment($scope.current.placekey, item.key, !item.isRemoved, function(result) {
            // reset
            $scope.resetCurrent(result);
          });
        };

        $scope.resetCurrent = function(result){
          if (result !== null) {
            $scope.comments[$scope.index] = result;
            $scope.current = result;
          }
          else{
            // null -> close
            $scope.comments.splice($scope.index, 1);
            $scope.closeDialog();
          }
        }

        // add comment
        $scope.reply = function(){
          if ($scope.newComment.length <= 0) {
            return;
          }
          CommentService.AddComment($scope.current.placekey, $scope.newComment, function(result){
            // reset
            $scope.resetCurrent(result);
            $scope.newComment = "";
          });
        }
    }
})();
