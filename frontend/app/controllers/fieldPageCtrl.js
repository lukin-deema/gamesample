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
		$scope.move = function(dx, dy){
			$scope.userCircle[0].x = $scope.userCircle[0].x + dx;
			$scope.userCircle[0].y = $scope.userCircle[0].y + dy;
			socket.emit('user:move', $scope.userCircle[0], 
				function (user) {
					console.log("emit move: " + JSON.stringify(user));
			});
		}
		socket.on("user:move", function (user) {
			console.log("on move: "+ JSON.stringify(user));
			//$scope.renderUser(user);
			for (var i = 0; i < $scope.userCircle.length; i++) {
				if ($scope.userCircle[i].name == user.user.name){
					break
				}
			}
			$scope.userCircle[i].x = user.user.x;
			$scope.userCircle[i].y = user.user.y;
		})
		socket.on("me:connect", function(users){
			users.forEach(function(user){
				$scope.renderUser(user);
			})
			socket.emit("me:rename", $scope.userCircle[0])
		})
		socket.on("user:connect", function(user){
			$scope.renderUser(user);
		})
		socket.on("user:left",function(user){
			console.log("user:left " + JSON.stringify(user));
			var i = $scope.indexOf(user.user.name);
			$scope.userCircle.splice(i, 1);
		})
		$scope.indexOf = function(usrName){
			for (var i = 0; i < $scope.userCircle.length; i++) {
				if ($scope.userCircle[i].name == usrName) {
					break;
				}
			}
			return i;
		}
		$scope.renderUser = function (user){
			if (!$scope.userCircle.some(function(el){ return el.name == user.name; })){
				$scope.userCircle = $scope.userCircle.concat(user.user);
			}
			var usr = $scope.userCircle.filter(function(el){ 
				return el.name == user.name;
			})
			if (usr.length == 1) {
				var i = $scope.indexOf(usr[0].name);
				$scope.userCircle[i].x = user.user.x;
				$scope.userCircle[i].y = user.user.y;
			}
		}
	}
]);
