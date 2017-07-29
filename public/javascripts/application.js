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

let skinTemperatureOptions = [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80];
let heartRateOptions = [88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101];

app.controller('MainController', ($scope, $firebaseArray) => {

  $scope.beds = [];

  let list = $firebaseArray(firebase.database().ref());

  list.$loaded().then(beds => {
    $scope.beds = beds;

    console.log($scope.beds);

  }).catch(function(error) {
    console.log("Error:", error);
  });

});

app.controller('ControlController', ($scope, $firebaseArray) => {

  $scope.beds = [];

  let list = $firebaseArray(firebase.database().ref());

  list.$loaded().then(beds => {
    $scope.beds = beds;

    console.log($scope.beds);

  }).catch(function(error) {
    console.log("Error:", error);
  });

  $scope.regulate = (ref) => {
    let randomSkinTemperature = skinTemperatureOptions[Math.floor(Math.random() * skinTemperatureOptions.length)];
    let randomHeartRate = heartRateOptions[Math.floor(Math.random() * heartRateOptions.length)];
  };

  $scope.addBed = () => {
    console.log('test');

    list.$add({label: Math.random().toString(36).substring(7), skinTemperature: 0, heartRate: 0}).then(ref => {
      let id = ref.key();
      console.log("added record with id " + id);
      list.$indexFor(id); // returns location in the array
    });
  };

  // $scope.remove = (bed) => {
  //   $scope.beds.splice()
  // }

});

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
