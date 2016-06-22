angular.module('myApp.controllers').controller('fieldPageCtrl',
	['$scope', '$state', '$stateParams', '$http', 
	function($scope, $state, $stateParams, $http) {
		if (!$stateParams.userCircle) {
			$state.go('app');
			return 
		}
		$scope.userCircle = [{ fill: "", name:"", r:10, x:30, y:30 }];
		$scope.userCircle[0].fill = $stateParams.userCircle.fill;
		$scope.userCircle[0].name = $stateParams.userCircle.name;
		$scope.hint = "move buttons ASWD"
		$scope.keys = {
			A : function(name, code) { $scope.move(-10, 0); },
			S : function(name, code) { $scope.move(0, +10); },
			W : function(name, code) { $scope.move(0, -10); },
			D : function(name, code) { $scope.move(+10, 0); }
		};

		$scope.move = function(dx, dy){
			$scope.userCircle[0].x = $scope.userCircle[0].x + dx;
			$scope.userCircle[0].y = $scope.userCircle[0].y + dy;
		}
	}
]);
