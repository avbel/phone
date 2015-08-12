/* global SIP */
/* global angular */
"use strict";
var app = angular.module("phone", ["ngStorage"]);
var domain = window.location.hostname;

function initializeSipConnection(scope, localStorage) {
  var config = {
    uri: localStorage.userName + "@" + domain,
    ws_servers: "ws" + ((window.location.protocol === "https:") ? "s" : "") + "://" + domain + ":7443",
    authorizationUser: localStorage.userName,
    password: localStorage.password
  };

   var ua = new SIP.UA(config);
   ua.on("registered", function(){
     scope.$apply(function(){
       scope.ua = ua;
       scope.error = null;
     });
   });
   ua.on("registrationFailed", function(){
     setTimeout(function(){
       if(scope.ua) return;
       scope.$apply(function(){
         scope.ua = null;
         scope.userExists = false;
         scope.showError("Неверные имя пользователя или пароль");
       });
     }, 500);  
   });
   ua.register();
};


app.controller("PhoneCtrl", function ($scope, $localStorage) {
  $scope.userExists = ($localStorage.userName && $localStorage.password);
  $scope.phoneNumber = $localStorage.phoneNumber;

  $scope.register = function (userName, password) {
    $localStorage.userName = userName;
    $localStorage.password = password;
    $scope.userExists = true;
    initializeSipConnection($scope, $localStorage);
  };

  $scope.call = function (phoneNumber) {
    $localStorage.phoneNumber = phoneNumber;
    var options = {
      media: {
        constraints: {
          audio: true,
          video: false
        },
        render: {
          remote: document.getElementById("remoteVideo"),
          local: document.getElementById("localVideo")
        }
      }
    };
    $scope.status = "Соединение ...";
    $scope.session = $scope.ua.invite("sip:" + phoneNumber + "@" + domain, options);
    $scope.session.on("bye", function () {
      $scope.$apply(function () {
        $scope.session = null;
        $scope.status = null;
      });
    });

    $scope.session.on("accepted", function () {
      $scope.$apply(function () {
        $scope.status = "Соединение установлено";
      });
    });

    $scope.session.on("rejected", function () {
      $scope.$apply(function () {
        $scope.session = null;
        $scope.status = "Звонок был отклонён";
      });
    });

  };

  $scope.hangUp = function () {
    if ($scope.session) {
      try{
        $scope.session.bye();
      }
      catch (err) {
        console.error(err);
      }
      $scope.session = null;
      $scope.status = null;
    }
  };

  $scope.showError = function (err) {
    console.error(err);
    $scope.error = err.message || err;
  };

  if ($scope.userExists) {
    initializeSipConnection($scope, $localStorage);
  }
});
