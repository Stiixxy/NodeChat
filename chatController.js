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
				delete clients[findClientName(socket)];
			}
		});

		socket.on('sendMessage', function(message){
			if(!checkLogin(socket)) return;
			var name = findClientName(socket);
			socket.broadcast.emit('receivedMessage', `${name}: message`);
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