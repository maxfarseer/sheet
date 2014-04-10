'use strict';


var app = angular.module('angleMineApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
]);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/sheet', {
      templateUrl: 'views/sheet.html',
      controller: 'SheetCtrl',
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.run([
  '$rootScope', 'rest',
  function ($rootScope, rest) {
    $rootScope.rest = rest;
  }
]);
