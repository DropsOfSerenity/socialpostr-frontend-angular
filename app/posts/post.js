(function(module) {
  'use strict';

  module.controller('Post', function($scope, $http, $location, toastr) {

    var id = $location.search().id;

    if (isEditingPost()) {
      $scope.isEditing = true;
      getPost();
      $scope.save = editPost;
    } else {
      $scope.save = newPost;
    }

    $scope.delete = deletePost;

    $scope.time = new Date();
    $scope.minDate = new Date();
    $scope.opened = false;

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = !$scope.opened;
    };

    function getPost() {
      $http.get('/api/post/' + id).then(function(post) {
        $scope.message = post.data.message;

        var datetime = new Date(post.data.scheduledfor);
        $scope.date = datetime;
        $scope.time = datetime;
      });
    }

    function newPost() {
      var datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.getHours(), $scope.time.getMinutes());
      $http.post('/api/post/tweet', {
          message: $scope.message,
          scheduledfor: datetime
        })
        .then(function() {
          toastr.success('new post created');
        });
    }

    function editPost() {
      var datetime = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.getHours(), $scope.time.getMinutes());
      $http.post('/api/post/update/' + id, {
          message: $scope.message,
          scheduledfor: datetime
        })
        .then(function() {
          toastr.success('post edited successfully');
        });
    }

    function deletePost() {
      $http.post('/api/post/destroy/' + id)
        .then(function() {
          toastr.info('post deleted successfully');
        });
    }

    function isEditingPost() {
      return !!id;
    }
  });

  module.directive('datepickerPopup', function() {
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function(scope, element, attr, controller) {
        controller.$formatters.shift();
      }
    };
  });

}(angular.module('app')));
