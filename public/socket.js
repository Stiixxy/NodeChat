var socket = io('localhost:80');
socket.emit('message', 'Hi i am a client');

socket.on('message', function(message){
    console.log(message);
});