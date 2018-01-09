var port = 3000;

var express = require('express');

var app = express();

//setup template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'));

//start server
app.listen(port);
console.log(`Web server running on port: ${port}`);
