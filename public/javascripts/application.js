//Global elements the needs to be loaded once
global.jQuery = require('jquery');
global.bootstrap = require('bootstrap');
global.firebase = require('firebase');
global.moment = require('moment');

//Angular dependencies
var angular = require('angular');
var angularUIBootstrap = require('angular-ui-bootstrap');
var angularRoute = require('angular-route');

var angularfire = require('angularfire');

//Utilities
var moment = require('moment');

var app = angular.module('website', [angularRoute, angularUIBootstrap, angularfire]);

var differenceOptions = [1, 2, 3];
var skinTemperatureOptions = [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83];
var heartRateOptions = [88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102];
var locationOptions = [
  {
    latitude: 42.361824,
    longitude: -71.085577
  },
  {
    latitude: 42.363980,
    longitude: -71.080341
  },
  {
    latitude: 42.357828,
    longitude: -71.095448
  },
  {
    latitude: 42.361824,
    longitude: -71.071501
  },
  {
    latitude: 42.352310,
    longitude: -71.085234
  },
  {
    latitude: 42.361761,
    longitude: -71.082058
  },
  {
    latitude: 42.357638,
    longitude: -71.095276
  },
  {
    latitude: 42.355989,
    longitude: -71.092014
  },
  {
    latitude: 42.358399,
    longitude: -71.072874
  },
  {
    latitude: 42.366263,
    longitude: -71.095448
  }
];

app.controller('MainController', function($scope, $firebaseArray, $uibModal) {

  $scope.showBedDetailModal = function(id) {
    var modalInstance = $uibModal.open({templateUrl: '/views/modals/bed-detail.html', controller: 'BedDetailModalController', resolve: {data: {bedId: id}}});
  };

  $scope.beds = [];

  var list = $firebaseArray(firebase.database().ref());

  list.$loaded().then(function(data) {
    $scope.beds = data;
  }).catch(function(error) {
    console.log("Error:", error);
  });
});

app.controller('ControlController', function($scope, $firebaseArray, $firebaseObject, $interval) {

  $scope.beds = [];

  var list = $firebaseArray(firebase.database().ref());

  list.$loaded().then(function(data) {
    $scope.beds = data;
  }).catch(function(error) {
    console.log("Error:", error);
  });

  $scope.regulate = function() {
    var randomDifference = differenceOptions[Math.floor(Math.random() * differenceOptions.length)];

    list.forEach(function(obj, index) {

      if(obj.skinTemperature && obj.heartRate) {

        var frameSkinTemperature = obj.skinTemperature > 100 ? obj.skinTemperature - randomDifference : obj.skinTemperature + randomDifference;
        var frameHeartRate = obj.heartRate > 100 ? obj.heartRate - randomDifference : obj.heartRate + randomDifference;

        obj.skinTemperature = frameSkinTemperature;
        obj.heartRate = frameHeartRate;
        obj.frames.push({time: firebase.database.ServerValue.TIMESTAMP, skinTemperature: frameSkinTemperature, heartRate: frameHeartRate});

        list.$save(index).then(function(ref) {
          console.log('Saved bed : ' + ref);
        }).catch(function(err) {
          console.log("Error:", err);
        })
      }
    })
  };

  $scope.addBed = function() {
    var randomSkinTemperature = skinTemperatureOptions[Math.floor(Math.random() * skinTemperatureOptions.length)];
    var randomHeartRate = heartRateOptions[Math.floor(Math.random() * heartRateOptions.length)];
    var randomLocation = locationOptions[Math.floor(Math.random() * locationOptions.length)];

    list.$add({label: Math.floor(10000 + Math.random() * 90000), skinTemperature: randomSkinTemperature, heartRate: randomHeartRate, latitude: randomLocation.latitude, longitude: randomLocation.longitude, frames: [{time: firebase.database.ServerValue.TIMESTAMP, skinTemperature: randomSkinTemperature, heartRate: randomHeartRate}]}).then(function(ref) {
      console.log('Added bed: ' + ref)
    }).catch(function(error) {
      console.log("Error:", error);
    });
  };

  $scope.removeBed = function(id) {

    console.log(firebase.database().ref() + id);

    var obj = $firebaseObject(firebase.database().ref() + id);
    obj.$remove().then(function(ref) {
      console.log('Deleted bed: ' + ref);
    }).catch(function(error) {
      console.log("Error:", error);
    });
  };

  $interval(function() {
    $scope.regulate();
  }, 2000);

});

app.controller('BedDetailModalController', function($scope, $uibModalInstance, $firebaseObject, data) {

  $scope.bedId = data.bedId;

  $scope.bed;

  var obj = $firebaseObject(firebase.database().ref($scope.bedId));

  obj.$loaded().then(function(data) {
    $scope.bed = data;
  }).catch(function(error) {
    console.error("Error:", error);
  });

  $scope.hide = function() {
    $uibModalInstance.close('close');
  };

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

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBxSYGKndZ8MqZ-weVhxHDwpKu_PBEz2bI",
    authDomain: "hospital-bed.firebaseapp.com",
    databaseURL: "https://hospital-bed.firebaseio.com",
    projectId: "hospital-bed",
    storageBucket: "",
    messagingSenderId: "846524542991"
  };
  firebase.initializeApp(config);


});
