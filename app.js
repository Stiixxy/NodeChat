var port = 80;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var chatController = require('./chatController.js');


//setup template engine
//app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

//start controllers
chatController(io);


//start server
server.listen(port);
console.log(`Web server running on port ${port}`);

