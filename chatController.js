var clients = {};
var administrators = {};

var adminPassword = "1234";

module.exports = function(io){

	console.log("Chat controller started running");

	io.on('connection', function(socket){
		
		socket.on('disconnect', function(){
			console.log("User disconnected");
			if(findClientName(socket) != null){
				//user is logged in, log him out.
				console.log(`User ${findClientName(socket)} disconnected`);
				io.sockets.emit('chatupdate',`User ${findClientName(socket)} disconnected`)
				delete clients[findClientName(socket)];
			}
		});

		socket.on('sendMessage', function(message){
			if(!checkLogin(socket)) return;
			var name = findClientName(socket);
			socket.broadcast.emit('receivedMessage', `${name}: ${message}`);
			socket.emit('ownMessage', message);
		});
		
		socket.on('login', function(array){
			if(array.length != 2){
				socket.emit('showTemp', 'Usage is "login name"', 2000);
				return;
			}
			if(findClientName(socket) != null){
				socket.emit('showTemp', "You are already logged in", 2000);
				return;
			}
			if(findClientSocket(array[1]) != null){
				socket.emit('showTemp', "User with this name is already logged in!", 2000);
				return;
			}

			clients[array[1]] = socket;
			console.log(`User ${array[1]} has logged in!`);
			socket.emit('showTemp', `Succesfully logged in as ${array[1]}`, 2000);
			io.sockets.emit('chatupdate', `${array[1]} has connected`);
		});

		socket.on('auth', function(array){
			if(!checkLogin(socket)) return;
			if(array.length != 2){
				socket.emit('showTemp', `usage "auth password"`, 2000);
				return;
			}
			if(!adminPassword == array[1]){
				socket.emit('showTemp', 'Incorrect password', 2000);
				return;
			}

			socket.emit('showTemp', 'Logged in as admin', 2000);
			administrators[findClientName(socket)] = 1;
		});

		socket.on('clearall', function(array){
			if(!isAdmin(findClientName(socket))){
				socket.emit('showTemp', "You have to be admin to run that command", 2000);
				return;
			}
			if(array.length != 1){
				socket.emit('showTemp', 'Usage "clear"', 2000);
				return;
			}
			io.sockets.emit('clear');
			io.sockets.emit('chatupdate', "An admin cleared the chat")
		});

		socket.on('clear', function(array){
			if(array.length != 1){
				socket.emit('showTemp', 'Usage "clear"', 2000);
				return;
			}
			socket.emit('clear');
		});

		socket.on('whisper', function(array){
			if(!checkLogin(socket)) return;

			if(array.length <= 2){
				socket.emit('showTemp', `Usage "whisper name text"`, 2000);
				return;
			}

			var message = "";
			for(var i = 2; i < array.length; i++){
				message += array[i];
				message += " ";
			}
			message = message.substr(0, message.length - 1);

			var targetSocket = findClientSocket(array[1]);
			if(targetSocket == null){
				socket.emit('showTemp', "User not found", 2000);
				return;
			}
			
			targetSocket.emit('receivedMessage', `${findClientName(socket)} has whispered "${message}"`);
			socket.emit('ownMessage', ` you whispered "${message}" to ${findClientName(targetSocket)}`);
			
		});

		socket.on('online', function(array){
			if(!checkLogin(socket)) return;

			var message = "";
			for(key in clients){
				if(isAdmin(key)) {
					message += `<span style="color:red">`;
					message += key;
					message += "</span>";
				}else{
					message += key;
				}
				message += ',';
			}
			message = message.substr(0, message.length - 1);

			socket.emit('receivedMessage', `Users online: ${message}`);
		});

		//Example command
		socket.on('Hello', function(array){
			socket.emit('showTemp', "Welcome user", 2000);
		});

		console.log(`User ${socket.id} connected`);
	});


}

function findClientName(socket){
	for(key in clients){
		if(clients[key] == socket){
			return key;
		}
	}
	return null;
}

function findClientSocket(name){
	if(clients[name] != null){
		return clients[name];
	}
}

function isAdmin(name){
	if(administrators[name] == null) return false;
	return true;
}

function checkLogin(socket){
	if(findClientName(socket) == null){
		socket.emit('showTemp', "Please login first.", 2000);
		return null;
	}
	return true;
}