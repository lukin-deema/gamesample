angular.module('myApp.controllers').controller('fieldPageCtrl',
	['$scope', '$state', '$stateParams', 'socket', 
	function($scope, $state, $stateParams, socket) {
		if (!$stateParams.userCircle) {
			$state.go('app');
			return 
		}
		$scope.userCircle = [{info:{ fill: "", name:"", isMe: true, r:10, x:30, y:30 }}];
		$scope.userCircle[0].info.fill = $stateParams.userCircle.fill;
		$scope.userCircle[0].info.name = $stateParams.userCircle.name;
		$scope.hint = "move buttons ASWD"
		$scope.keys = {
			A : function(name, code) { $scope.move(-10, 0); },
			S : function(name, code) { $scope.move(0, +10); },
			W : function(name, code) { $scope.move(0, -10); },
			D : function(name, code) { $scope.move(+10, 0); }
		};
		$scope.move = function(dx, dy){
			$scope.userCircle[0].info.x = $scope.userCircle[0].info.x + dx;
			$scope.userCircle[0].info.y = $scope.userCircle[0].info.y + dy;
			socket.emit('user:move', $scope.userCircle[0]);
		}
		socket.on("user:move", function (_user) {
			console.log("on move: "+ JSON.stringify(_user));
			for (var i = 0; i < $scope.userCircle.length; i++) {
				if ($scope.userCircle[i].id == _user.id){
					break;
				}
			}
			$scope.userCircle[i].info.x = _user.info.x;
			$scope.userCircle[i].info.y = _user.info.y;
		})
		socket.on("me:connect", function(_users){
			_users.forEach(function(_user){
				$scope.renderUser(_user);
			})
			socket.emit("me:rename", $scope.userCircle[0],function(id){
				$scope.userCircle[0].id = id;
			})
		})
		socket.on("user:connect", function(_user){

			$scope.renderUser(_user);
		})
		socket.on("user:left",function(_user){
			console.log("user:left " + JSON.stringify(_user));
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
				$scope.userCircle[i].info.x = _user.info.x;
				$scope.userCircle[i].info.y = _user.info.y;
			}
		}
	}
]);
