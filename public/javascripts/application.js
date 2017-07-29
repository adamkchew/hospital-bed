//Global elements the needs to be loaded once
global.jQuery = require('jquery');
global.bootstrap = require('bootstrap');

//Angular dependencies
var angular = require('angular');
var angularRoute = require('angular-route');
var angularfire = require('angularfire');

//Utilities
var moment = require('moment');

var app = angular.module('website', [angularRoute, angularfire]);

//Configurations
app.config(function($locationProvider, $routeProvider) {

  //Hashbang for Google SEO
  $locationProvider.html5Mode(true).hashPrefix('!');

  //Routes
  $routeProvider.when('/', {
    templateUrl: 'views/main.html'
  }).when('/control', {
    templateUrl: 'views/control.html'
  }).otherwise({
    templateUrl: 'views/404.html'
  });

});

