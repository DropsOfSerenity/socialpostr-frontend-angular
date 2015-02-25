(function(module) {
  'use strict';

  var AutoReply = function($scope, $http, toastr) {
    var _this = this;

    $http.get('/api/user/me')
      .then(function(resp) {
        var user = resp.data;
        _this.user = user;
        $scope.message = user.twitterAutoReplyMessage;
        $scope.autoreplyChecked = user.twitterAutoReplyEnabled;
      });

    $scope.editSettings = function() {
      $http.post('/api/user/update/' + _this.user.id, {
        twitterAutoReplyMessage: $scope.message,
        twitterAutoReplyEnabled: $scope.autoreplyChecked
      })
      .then(function () {
        toastr.success('Updated autoreply settings.');
      });
    };
  };

  module.controller('AutoReply', AutoReply);

}(angular.module('app')));
