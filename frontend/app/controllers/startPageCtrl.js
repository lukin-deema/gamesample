angular.module('myApp.controllers').controller('startPageCtrl',['$scope', '$state','$http', function($scope, $state, $http) {
	
	$scope.name = '';
	$scope.userCircle = [{fill: "green", r:20} ];
	$scope.allCircle = [
		{fill: "red", r:10},
		{fill: "blue", r:10},
		{fill: "black", r:10}]
	$scope.send = function(){
		$state.go("field", { userCircle: 
			{ fill: $scope.userCircle[0].fill, name: $scope.name } 
		});
	}
	$scope.allCircleClick = function(item){
		console.log(item);
		$scope.userCircle[0].fill = item.fill;
		$scope.$apply();
	}

}]);
