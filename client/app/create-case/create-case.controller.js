'use strict';

angular.module('vandioApp').controller('createCaseController', ['$scope','$timeout',function ($scope,$timeout) {
$scope.user = {};

	// // $scope.login = function(){
	// // 	userservice.login({username:$scope.user.email,password:$scope.user.password})
	// // 	.success(function(data) {
	// // 		console.log(data);
	// // 	}).error(function (error) {
	// // 		console.log(error);
	// 	});
	// };
$scope.isDisabled = false;
$scope.noCache = true;

$scope.querySearch = function(searchText){
  var result=[];
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
  
  //console.log(categoryNames.indexOf(searchText));
   categories.forEach(function(each){
   	if(each.id.toLowerCase().indexOf(searchText)!= -1 ) result.push(each.id);
   });
  $scope.item = result;
   return result;
}

$scope.loadTags = function() {
    // Use timeout to simulate a 650ms request.
  $scope.tags = [];
  return $timeout(function() {
    $scope.tags = [
      { id: 1, name: 'Lizard Squad'},
      { id: 2, name: 'Lone wolf' },
      { id: 3, name: 'Mobile Device' },
      { id: 4, name: 'foobar1' },
      { id: 5, name: 'foobar2' },
      ];
    }, 650);
}

  $scope.uploadFile = function(){

  }

$scope.selectedTags = [];
	$scope.selecttag = function(tag){
	$scope.selectedTag.push(tag.name);
  }
}]);
