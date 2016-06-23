module.exports = function(server){
	var io = require('socket.io').listen(server);
	var users = []; //{id: socketId, user: user without isMe prop}
	io.set("origins", "localhost:*");
	io.sockets.on("connection",function(socket){
		console.log('connection: ' + socket.id);

		io.sockets.sockets[socket.id].emit("me:connect", users);

		socket.on("me:rename", function(user){
			user.isMe = undefined;
			console.log("init " + JSON.stringify(user));
			users.push({id: socket.id, user: user});
			socket.broadcast.emit("user:connect", {id: socket.id, user: user});
		})
		socket.on("user:move",function(user,cb){
			var findUser = users.find(function(el){ 
				return el.user.name == user.name;
			});
			findUser.user.x = user.x;
			findUser.user.y = user.y;
			console.log("income user" + JSON.stringify(user)+ ",\tall users" + JSON.stringify(users) + "\tfound user" + JSON.stringify(findUser));
			socket.broadcast.emit("user:move", findUser);
		})
		socket.on("disconnect", function(){
			var u = users.filter(function(el){
				return el.id == socket.id;
			})[0];
			users.splice(users.indexOf(u), 1);
			console.log('disconnected: '+ JSON.stringify(u) + ",\tall users" + JSON.stringify(users));
			socket.broadcast.emit('user:left', u);
		});
		socket.on("error",function(){
			debugger;
		})
	})

	return io;
};

