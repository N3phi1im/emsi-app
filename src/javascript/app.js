(function() {
  'use strict';
  angular.module('App', ['ui.router', 'ngMaterial'])
    .config(Config);

  function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
    $stateProvider.state('Main', {
      url: '/main',
      templateUrl: 'views/main.html',
      controller: 'mainController as vm'
    }).state('Welcome', {
      url: '/welcome',
      templateUrl: 'views/welcome.html',
      controller: 'welcomeController as vm'
    });
    $urlRouterProvider.otherwise('/welcome');
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);
  }
})();
