'use strict';

angular.module('vandioApp').controller('ProfileCtrl', ['$scope', 'applicationService', '$mdToast', function ($scope, applicationService, $mdToast) {
  applicationService.getAll().success(function (applications) {
    $scope.applications = applications;
  }).error(function (error, statusCode) {
    $mdToast.show(
      $mdToast.simple()
        .content(error.message)
        .position('bottom left')
        .hideDelay(3000)
      );
  });

  $scope.accept = function (application) {
    applicationService.approved({
      id: application._id
    }).success(function (approvedResp) {
      $mdToast.show(
        $mdToast.simple()
          .content(approvedResp.message)
          .position('bottom left')
          .hideDelay(3000)
        );
      $scope.applications.splice(application, 1);
    }).error(function (error, statusCode) {
      $mdToast.show(
        $mdToast.simple()
          .content(error.message)
          .position('bottom left')
          .hideDelay(3000)
        );
    });
  };

  // TODO Actually make an API call to deny the application.
  $scope.deny = function ($index) {
    $scope.applications.splice($index, 1);
    $mdToast.show(
      $mdToast.simple()
        .content('Application hidden.')
        .position('bottom left')
        .hideDelay(3000)
      );
  };
}]);
