angular.module('myApp.controllers').controller('fieldPageCtrl',
	['$scope', '$state', '$stateParams', 'socket', 
	function($scope, $state, $stateParams, socket) {
		if (!$stateParams.userCircle) {
			$state.go('app');
			return 
		}
		$scope.userCircle = [{ fill: "", name:"", isMe: true, r:10, x:30, y:30 }];
		$scope.userCircle[0].fill = $stateParams.userCircle.fill;
		$scope.userCircle[0].name = $stateParams.userCircle.name;
		$scope.hint = "move buttons ASWD"
		$scope.keys = {
			A : function(name, code) { $scope.move(-10, 0); },
			S : function(name, code) { $scope.move(0, +10); },
			W : function(name, code) { $scope.move(0, -10); },
			D : function(name, code) { $scope.move(+10, 0); }
		};
		socket.emit("init", $scope.userCircle[0], function(users){
			$scope.renderUsers(user);
		});
		$scope.move = function(dx, dy){
			$scope.userCircle[0].x = $scope.userCircle[0].x + dx;
			$scope.userCircle[0].y = $scope.userCircle[0].y + dy;
			socket.emit('move', $scope.userCircle[0], 
				function (user) {
					console.log("emit move: " + JSON.stringify(user));
			});
		}
		socket.on("move", function (user) {
			console.log("on move: "+ JSON.stringify(user));
			$scope.renderUsers(user);
		})
		socket.on("init", function(users){
			for (var i = 0; i < users.length; i++) {
				$scope.renderUsers(users[i]);
			}
		})
		$scope.renderUsers = function (user){
			if (!$scope.userCircle.some(function(el){ return el.name == user.name; })){
				$scope.userCircle = $scope.userCircle.concat(user);
			}
			var usr = $scope.userCircle.filter(function(el){ 
				return el.name == user.name;
			})
			if (usr.length == 1) {
				for (var i = 0; i < $scope.userCircle.length; i++) {
					if ($scope.userCircle[i].name == usr[0].name) {
						break;
					}
				}
				$scope.userCircle[i].x = user.x;
				$scope.userCircle[i].y = user.y;
			}
		}
	}
]);
