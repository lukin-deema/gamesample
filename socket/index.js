module.exports = function(server){
	var io = require("socket-io").listen(server);
	io.set("origin", "localhost:*");

	io.socket.on("connection", function(){
		socket.on("test", function(text,cb){
			console.log(text);
			socket.broadcast.emit("test", text);
			cb();
		})
	})
}