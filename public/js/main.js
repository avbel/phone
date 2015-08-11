/* global SIP */
/* global angular */
"use strict";
var app = angular.module("phone", ["ngStorage"]);
var domain = window.location.hostname;

function initializeSipConnection(scope, localStorage) {
  var config = {
    uri: localStorage.userName + "@" + domain,
    ws_servers: "ws" + ((window.location.protocol === "https:") ? "s" : "") + "://" + domain + ":5065",
    authorizationUser: localStorage.userName,
    password: localStorage.password
  };

  scope.ua = new SIP.UA(config);
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
            remote: document.getElementById('remoteVideo'),
            local: document.getElementById('localVideo')
        }
      }
    };
    $scope.session = $scope.ua.invite("sip:" + phoneNumber +  "@" + domain, options);
	};

	$scope.hangUp = function () {
		if ($scope.session) {
			$scope.session.bye();
			$scope.session = null;
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
