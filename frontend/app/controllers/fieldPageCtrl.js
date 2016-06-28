angular.module('myApp.controllers').controller('fieldPageCtrl',
	['$scope', '$state', '$stateParams', 'socket', 
	function($scope, $state, $stateParams, socket) {
		if (!$stateParams.userCircle) {
			$state.go('app');
			return; 
		}
		$scope.width = 300;
		$scope.height = 400;
		$scope.userCircle = [{info:{ fill: "", name:"", isMe: true, r:10, x:30, y:30 }}];
		if (!$scope.userCircle[0]) { debugger; }
		$scope.userCircle[0].info.fill = $stateParams.userCircle.fill;
		$scope.userCircle[0].info.name = $stateParams.userCircle.name;
		$scope.hint = "move buttons ASWD"
		$scope.keys = {
			A : function(name, code) { $scope.move(-10, 0); },
			S : function(name, code) { $scope.move(0, +10); },
			W : function(name, code) { $scope.move(0, -10); },
			D : function(name, code) { $scope.move(+10, 0); }
		};
		// $scope.back = function(){
		// 	socket.emit("user:leave", $scope.userCircle[0])
		// 	$state.go("app");
		// }
		$scope.move = function(dx, dy){
			if (!$scope.userCircle[0]) { debugger; }
			if (!$scope.userCircle[0].id){
				debugger;
				return;
			}
			if ($scope.userCircle[0].info.x + dx < $scope.userCircle[0].info.r ||
					$scope.userCircle[0].info.x + dx > $scope.width - $scope.userCircle[0].info.r ||
					$scope.userCircle[0].info.y + dy < $scope.userCircle[0].info.r ||
					$scope.userCircle[0].info.y + dy > $scope.height - $scope.userCircle[0].info.r) {
				return;
			}
			$scope.userCircle[0].info.x = $scope.userCircle[0].info.x + dx;
			$scope.userCircle[0].info.y = $scope.userCircle[0].info.y + dy;
			socket.emit('user:move', $scope.userCircle[0]);
		}
		socket.on("user:move", function (_user) {
			for (var i = 0; i < $scope.userCircle.length; i++) {
				if ($scope.userCircle[i].id == _user.id){
					break;
				}
			}
			if (!$scope.userCircle[i]) { debugger; }
			$scope.userCircle[i].info.x = _user.info.x;
			$scope.userCircle[i].info.y = _user.info.y;
		})
		socket.on("me:connect", function(_socketId, _users){
			$scope.userCircle[0].id = _socketId;
			_users.forEach(function(_user){
				$scope.renderUser(_user);
			})
			socket.emit("me:rename", $scope.userCircle[0])
		})
		socket.on("user:connect", function(_user){

			$scope.renderUser(_user);
		})
		socket.on("user:left",function(_user){
			var i = $scope.indexOf(_user.id);
			$scope.userCircle.splice(i, 1);
		})
		$scope.indexOf = function(id){
			for (var i = 0; i < $scope.userCircle.length; i++) {
				if ($scope.userCircle[i].id == id) {
					break;
				}
			}
			return i;
		}
		$scope.renderUser = function (_user){
			if (!$scope.userCircle.some(function(el){ return el.id == _user.id; })){
				$scope.userCircle = $scope.userCircle.concat(_user);
			}
			var usr = $scope.userCircle.filter(function(el){ 
				return el.id == _user.id;
			})
			if (usr.length == 1) {
				var i = $scope.indexOf(usr[0].id);
				if (!$scope.userCircle[i]) { debugger; }
				$scope.userCircle[i].info.x = _user.info.x;
				$scope.userCircle[i].info.y = _user.info.y;
			}
		}
		$scope.back = function(){
			window.location = "/";
		}
	}
]);
