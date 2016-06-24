module.exports = function(server){
	var io = require('socket.io').listen(server);
	var users = []; //{id: socketId, info: user without isMe prop}
	io.set("origins", "localhost:*");
	io.sockets.on("connection",function(socket){
		console.log('\tconnection: ' + socket.id);

		// send current users & ask information about connected user 
		io.sockets.sockets[socket.id].emit("me:connect", users); 

		// get information about connected user
		socket.on("me:rename", function(_user, cb){
			_user.info.isMe = undefined;
			var newUser = {id: socket.id, info: _user.info}
			console.log("\tME:RENAME -> " + JSON.stringify(newUser)+ ",\nALL USERS -> " + JSON.stringify(users));
			users.push(newUser);
			cb(newUser.id);
			socket.broadcast.emit("user:connect", newUser);
		})
		socket.on("user:move",function(_user,cb){
			var user = users.find(function(el){ 
				return el.id == _user.id;
			});
			user.info.x = _user.info.x;
			user.info.y = _user.info.y;
			console.log("\tUSER:MOVE -> " + JSON.stringify(user)+ ",\nALL USERS -> " + JSON.stringify(users));
			socket.broadcast.emit("user:move", user);
		})
		socket.on("disconnect", function(){
			var u = users.filter(function(el){
				return el.id == socket.id;
			})[0];
			users.splice(users.indexOf(u), 1);
			console.log('\tDISCONNECT -> '+ JSON.stringify(u) + ",\nALL USERS -> " + JSON.stringify(users));
			socket.broadcast.emit('user:left', u);
		});
		socket.on("error",function(){
			console.error("\tERROR -> ",JSON.stringify(arguments));
			debugger;
		})
	})

	return io;
};

