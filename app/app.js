(function() {
  'use strict';

  angular.module('app', [
    'satellizer', 'ui.bootstrap', 'ui.router', 'ngAnimate', 'toastr'])
    .config(function($authProvider, $urlRouterProvider, $stateProvider, toastrConfig) {
      toastrConfig.positionClass = 'toast-bottom-right';
      $authProvider.twitter({
        url: '/api/user/login'
      });

      $stateProvider

      .state('posts', {
        url: '/',
        templateUrl: 'views/myposts.html',
        controller: 'MyPosts'
      })

      .state('post', {
        url: '/post?id',
        templateUrl: 'views/post.html',
        controller: 'Post'
      });

      $urlRouterProvider.otherwise('/');
    });
}());
