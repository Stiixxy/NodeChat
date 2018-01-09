module.exports = function(io){

	console.log("Chat controller started running");

	io.on('connection', function(socket){
		socket.on('message', function(message){
			console.log(`Received ${message}`);
	
		   
		});
		socket.emit('message', 'We received the message, hello to you to!');
		socket.on('disconnect', function(){
			console.log("User dc");
		});
		console.log(`User ${socket.id} connected`);
	});


}