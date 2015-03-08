/* jshint:global moment */
'use strict';

angular.module('vandioApp').controller('AppFormCtrl', ['$scope', 'applicationService', '$mdToast', '$routeParams', '$location', function ($scope, applicationService, $mdToast, $routeParams, $location) {
  $scope.application = {
    company: {},
    appointment: {},
  };

  $scope.submitApplication = function() {
    $scope.application.appointment.useKeybase = $scope.application.appointment.type === 'useKeybase' ? true : false;
    $scope.application.appointment.inPerson = $scope.application.appointment.type === 'inPerson' ? true : false;
    var date = moment.utc($scope.application.appointment.date).valueOf();
    var time = moment.utc($scope.application.appointment.time).valueOf();
    var dateTime = date + time;
    applicationService.update({
      id: $routeParams.id,
      company: $scope.application.company,
      appointment: {
        useKeybase: $scope.application.appointment.useKeybase,
        inPerson: $scope.application.appointment.inPerson,
        coordinator: {
          firstname: $scope.application.appointment.firstname,
          lastname: $scope.application.appointment.lastname,
          phonenumber: $scope.application.appointment.phonenumber,
          email: $scope.application.appointment.email,
        },
        keybase: {},
        date: dateTime
      }
    }).success(function (updateResp) {
      $mdToast.show(
        $mdToast.simple()
          .content(updateResp.message)
          .position('bottom left')
          .hideDelay(3000)
      );
      $location.path('/');
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
