(function() {
    'use strict';
    angular
        .module('tay3lo-admin')
        .controller('CommentController', CommentController);

    CommentController.$inject = ['$scope', '$rootScope', '$state', 'PlaceService', 'CommentService', 'DTOptionsBuilder', 'DTColumnDefBuilder']; // jshint
    function CommentController($scope, $rootScope, $state, PlaceService, CommentService, DTOptionsBuilder, DTColumnDefBuilder) {
        $scope.comments = [];
        $scope.key = null;
        $scope.index = -1;
        $scope.current = null;
        $scope.newComment = "";
        // datatables options
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip').withOption('order', [3, 'desc']);;
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];
        $scope.dtOptions2 = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip');
        $scope.dtColumnDefs2 = [
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        (function initController() {
            CommentService.InitFirebase(function(changed){
              if (changed){
                $rootScope.$apply(function(){
                  $scope.comments = CommentService.comments;
                });
              }
              else{
                $scope.comments = CommentService.comments;
              }
            });
            // init
            // autofocus
            $('#myModal').on('shown.bs.modal', function() {
                $('#inputName').focus();
            });
        })();

        $scope.closeDialog = function() {
            $scope.key = null;
            $scope.index = -1;
            $scope.current = null;
            $scope.newComment = "";
            $('#myModal').modal('hide');
        };

        $scope.showall = function(index){
          $scope.current = $scope.comments[index];
          $scope.key = $scope.current.place;
          $scope.index = index;
        };

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
