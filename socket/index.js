module.exports = function(server){
	var io = require('socket.io').listen(server);
	var users = [];
	io.set("origins", "localhost:*");
	io.sockets.on("connection",function(socket){
	  console.log('connection');
	  socket.on("move",function(user,cb){
	  	console.log("income user" + JSON.stringify(user));
	  	console.log("all users" + JSON.stringify(users));
	    var findUser = users.find(function(el){ 
	    	return el.name == user.name;
	    });
	    findUser.x = user.x;
	  	findUser.y = user.y;
	  	console.log("found user" + JSON.stringify(findUser));
	  	socket.broadcast.emit("move", findUser);
	  	cb("back from server " + JSON.stringify(findUser));
	  })
	  socket.on("init", function(user){
	  	user.isMe = undefined;
	  	console.log("init " + JSON.stringify(user));
	  	socket.emit("init", users);
	  	users.push(user);
	  })
	  socket.on('disconnect', function(){
	  	console.log(JSON.stringify(arguments));
	    console.log('disconnected');
	  });
	})

	return io;
};

