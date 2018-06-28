var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var index = require('./routes/index');
var socketManager = require('./routes/socketManager');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectionCount = 0;
var agentReference;

io.on("connection", function(socket){
	console.log("new connection "+socket.id);
	connectionCount++;
	console.log("connectionCount "+connectionCount);

	if(connectionCount == 1)	//make him agent
	{
		agentReference = socket;
	}

	socket.on("new_message", function(message, room){
		console.log("message "+message);

		socket.broadcast.to(room).emit('send_messsage_to_room', {
        	message: message
    	});
	});


	socket.on("send_messsage_to_room", function(message){
		console.log("message received "+message);
	});

	socket.on("subscribe", function(room){
		console.log("joining room "+room);
		socket.join(room);
		agentReference.join(room);
	});

});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'client'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.getHomePage);

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
