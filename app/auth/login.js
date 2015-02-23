(function() {
  'use strict';

  angular.module('app')
    .controller('Login', function($http, $scope, $auth) {
      $scope.isAuthenticated = $auth.isAuthenticated;

      $scope.logout = function() {
        $auth.logout();
      };

      $scope.login = function() {
        $auth.authenticate('twitter');
      };
    });
}());
