angular.module('myApp.controllers').controller('startPageCtrl',['$scope', '$state','$http', function($scope, $state, $http) {
	
	$scope.name = '';
	$scope.userCircle = [{info:{fill: "green", r:20}} ];
	$scope.allCircle = [
		{info:{fill: "green", r:10}},
		{info:{fill: "yellow", r:10}},
		{info:{fill: "red", r:10}},
		{info:{fill: "cyan", r:10}},
		{info:{fill: "gold", r:10}},
		{info:{fill: "grey", r:10}},
		{info:{fill: "lime", r:10}},
		{info:{fill: "olive", r:10}},
		{info:{fill: "blue", r:10}},
		{info:{fill: "black", r:10}}]
	$scope.send = function(){
		$state.go("field", { userCircle: 
			{ fill: $scope.userCircle[0].info.fill, name: $scope.name } 
		});
	}
	$scope.allCircleClick = function(item){
		$scope.userCircle[0].info.fill = item.info.fill;
		$scope.$apply();
	}

}]);
