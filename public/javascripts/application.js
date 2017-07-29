var app = angular.module('website', []);

//Configurations
app.config(function($locationProvider) {

  //Hashbang for Google SEO
  $locationProvider.html5Mode(true).hashPrefix('!');

});


