angular.module('myApp.controllers').controller('startPageCtrl',["$scope", function($scope) {
	
	$scope.title = '';
	$scope.userCircle = [{fill: "green", r:20} ];
	$scope.allCircle = [
		{fill: "red", r:10},
		{fill: "blue", r:10},
		{fill: "black", r:10}]
	$scope.send = function(){

		debugger;
	}
	$scope.allCircleClick = function(item){
		console.log(item);
		$scope.userCircle[0].fill = item.fill;
		$scope.$apply();
	}

}]);
