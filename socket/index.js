module.exports = function(server, env){
	var io = require('socket.io').listen(server);
	var users = []; //{id: socketId, info: user without isMe prop}
	if (env === 'development') {
		io.set("origins", "localhost:*");
	} else {
		io.set("origins", "https://gamesample.herokuapp.com:*");
	}
	io.sockets.on("connection",function(socket){
		// send current users & ask information about connected user 
		io.sockets.sockets[socket.id].emit("me:connect", socket.id, users); 

		// get information about connected user
		socket.on("me:rename", function(_user){
			if (!_user) { debugger; }
			_user.info.isMe = undefined;
			users.push(_user);
			console.log("connect: " + JSON.stringify(_user));
			socket.broadcast.emit("user:connect", _user);
		})
		socket.on("user:move",function(_user,cb){
			var user = users.find(function(el){ 
				return el.id == _user.id;
			});
			if (!_user) { debugger; }
			if (!user) { debugger; }
			user.info.x = _user.info.x;
			user.info.y = _user.info.y;
			socket.broadcast.emit("user:move", user);
		})
		socket.on("disconnect", function(){
			var u = users.filter(function(el){
				return el.id == socket.id;
			})[0];
			console.log("disconnect: " + JSON.stringify(u));
			users.splice(users.indexOf(u), 1);
			socket.broadcast.emit('user:left', u);
		});
		socket.on("error",function(){
			console.error("\tERROR -> ",arguments[0].message);
			//debugger;
		})
	})

	return io;
};

