'use strict';

angular.module('vandioApp').controller('createCaseController', ['$scope', 'tagService', '$mdToast', function ($scope, tagService, $mdToast) {
$scope.user = {};
$scope.isDisabled = false;
$scope.noCache = true;

$scope.querySearch = function(searchText){
  var result = [];
  var categories = [{
   id: 'Eaves Dropping',
    value: '_EAVES_DROPPING_'
  }, {
    id: 'Data Modification',
    value: '_DATA_MODIFICATION_'
  }, {
    id: 'IP Spoofing',
    value: '_IP_SPOOFING_'
  }, {
    id: 'Password Based Attack',
    value: '_PASSWORD_BASED_ATTACK_'
  }, {
    id: 'Denial of Service',
    value: '_DENIAL_OF_SERVICE_'
  }, {
    id: 'Man In The Middle',
    value: '_MAN_IN_THE_MIDDLE_'
  }, {
    id: 'Compromised Key Attack',
    value: '_COMPROMISED_KEY_ATTACK_'
  }, {
    id: 'Sniffer Attack',
    value: '_SNIFFER_ATTACK_'
  }, {
    id: 'Application Layer Attack',
    value: '_APPLICATION_LAYER_ATTACK_'
  }, {
    id: 'Undefined',
    value: '_UNDEFINED_'
  }];
  categories.forEach(function(each){
    if(each.id.toLowerCase().indexOf(searchText) != -1 ) {
      result.push(each.id);
    }
  });
  $scope.item = result;
  return result;
}

$scope.loadTags = function() {
  tagService.getTags().success(function (tags) {
    $scope.tags = tags || [];
  }).error(function (error, statusCode) {
    $mdToast.show(
      $mdToast.simple()
        .content(error.message)
        .position('bottom left')
        .hideDelay(3000)
      );
  });
};

$scope.uploadFile = function() {

};

$scope.selectedTags = [];

$scope.selectTag = function(tag) {
  $scope.selectedTag.push(tag);
};

}]);
