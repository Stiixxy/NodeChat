module.exports = function(io){

	console.log("Chat controller started running");

	io.on('connection', function(socket){
		socket.on('disconnect', function(){
			console.log("User disconnected");
		});

		socket.on('sendMessage', function(message){
			socket.broadcast.emit('receivedMessage', message);
		});

		//Example command
		socket.on('Hello', function(array){
			socket.emit('showTemp', "Welcome user", 2000);
		});

		console.log(`User ${socket.id} connected`);
	});


}