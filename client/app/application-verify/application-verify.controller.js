'use strict';

angular.module('vandioApp').controller('ApplicationVerifyCtrl', ['$scope', 'applicationService', '$interval', '$window', '$mdToast', '$routeParams', '$location', function ($scope, applicationService, $interval, $window, $mdToast, $routeParams, $location) {
  var jobId = $window.localStorage.getItem('id');
  var stop = $interval(function () {
    applicationService.status(jobId).success(function (statusResp) {
      if(statusResp.progress === "100") {
        if(stop) {
          $interval.cancel(stop);
        }
        $scope.serverMessage = statusResp.message;
      }
    }).error(function (error, statusCode) {
      $mdToast.show(
        $mdToast.simple()
        .content(error.message)
        .position('bottom left')
        .hideDelay(3000)
      );
    });
  }, 2000);

  $scope.$on('$destroy', function () {
    if(stop) {
      $interval.cancel(stop);
    }
  });

  $scope.verifyAccount = function () {
    var params = {
      id: $routeParams.id,
      message: $scope.userMessage
    };
    applicationService.verify(params).success(function (verifyResp) {
      $mdToast.show(
        $mdToast.simple()
        .content(verifyResp.message)
        .position('bottom left')
        .hideDelay(3000)
      );
      $window.localStorage.setItem('id', null);
      $location.path('/user/login');
    }).error(function (error, statusCode) {
      $mdToast.show(
        $mdToast.simple()
        .content(error.message)
        .position('bottom left')
        .hideDelay(3000)
      );
    });
  };
}]);
