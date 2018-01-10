module.exports = function(io){

	console.log("Chat controller started running");

	io.on('connection', function(socket){
		socket.on('disconnect', function(){
			console.log("User disconnected");
		});

		socket.on('sendMessage', function(message){
			socket.broadcast.emit('receivedMessage', message);
		});

		console.log(`User ${socket.id} connected`);
	});


}