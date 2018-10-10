var express = require('express');
var passport = require('passport');
var passportgithub = require('passport-github2');
var Strategy = require('passport-facebook').Strategy;
var socket = require('socket.io');
var routes = require("./routes/routes.js");
var githubOAuth = require("github-oauth")
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require('./routes/databse.config.js');
const superagent = require("superagent");
const authRoutes = require('./routes/auth-route');
const profileRoutes = require('./routes/profile-route');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
var hashMap1 = require('hashmap');
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.dbURL, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

var path = require('path');

passport.use(new Strategy({
    clientID: 591170154635070,
    clientSecret: '3cdaa9d035bc83fe1e4a7199eda0a0ac',
    callbackURL: 'http://localhost:4000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();



app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())
// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


//app.use(cookieSession({
//  maxAge: 24 * 60 * 60 * 1000,
//  keys: [keys.session.cookieKey]
//}));

app.use(passport.initialize());
app.use(passport.session());

//Modularise the google apis.
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
// set up session cookies

 var map = new hashMap1();

// Define routes.
app.get('/',
  function(req, res) {
   // res.render('login', { user: req.user });
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  app.get('/test',
  function(req, res) {
    res.json({validated:'test'});
  });

app.get('/home',
  function(req, res){
   res.sendFile(path.join(__dirname, './public/rooms.html'));
});


app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/login/facebook' }));
  
app.get('/loadData',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
	  console.log('inside load data');
	  var rooms ={"userName":"subbu",
				  "userId":"35333",
				  "users":[
				  {
					  userId:"884",
					  userName:"rohit"
				  },
				   {
					  userId:"786",
					  userName:"sam"
				  },
				   {
					  userId:"535",
					  userName:"raj"
				  },
				   {
					  userId:"886",
					  userName:"sandip"
				  },
				   {
					  userId:"564",
					  userName:"rajeswar"
				  },
				   {
					  userId:"45",
					  userName:"phani"
				  }
				  ],
				  
				"roomsList": [
			{
			  roomId:"75757",
			  value: "Devops",
			  members:[
			  {
			  memberId:"53555",
			  memberName:"Rohit"
			  },
			  {
			  memberId:"53555",
			  memberName:"Ratan"
			  },
			  {
			  memberId:"53555",
			  memberName:"Sam"
			  },
			  {
			  memberId:"3555",
			  memberName:"John"
			  }
			  ]
		  },
		  {			  
			  roomId:"6655",
			  value: "SmartLearning",
			  members:[
			  {
			  memberId:"53555",
			  memberName:"Rohit"
			  },
			  {
			  memberId:"53555",
			  memberName:"Ratan"
			  },
			  {
			  memberId:"53555",
			  memberName:"Sam"
			  },
			  {
			  memberId:"53555",
			  memberName:"John"
			  }
			  ]
		  },
		  {
			  roomId:"1234",
			  value: "Agile",
			  members:[
			  {
			  memberId:"53555",
			  memberName:"Rohit"
			  },
			  {
			  memberId:"53555",
			  memberName:"Ratan"
			  },
			  {
			  memberId:"53555",
			  memberName:"Sam"
			  },
			  {
			  memberId:"53555",
			  memberName:"John"
			  }]
		  }
	  ]};

		//socket start
		
		//socked end
	  res.json(JSON.stringify(rooms));
  });


require('./routes/note.routes.js')(app);
		
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var io = socket(server);
 io.on('connection', (socket) => {

	var user1 = socket.handshake.query.currentUser;
    console.log('made socket connection', socket.id);
	console.log("curentuser.."+ user1);
	map.set(socket.id, user1);
	io.sockets.emit('availableUsers','hi');
	console.log("map size inside socket.."+ map.size);
	
	var subbu_rooms=['Agile','Devops','SmartLearning'];
	 	 
      console.log('map size... ' + map.size);
	  for(var i in subbu_rooms){
			console.log(i + ".." + subbu_rooms[i]);
			socket.join(subbu_rooms[i]);
			//io.sockets.emit('joined message',subbu_rooms);
	  }
		
	//io.sockets.emit('main chat',data);
	//console.log('user joined room #'+room);
	//console.log(socket.rooms);
	
	socket.on('main chat', function(data) {
		console.log('grabbing on server.. ', data);
		var user_who_pinged=map.get(socket.id);
		var room = data.handle;
		var message = data.message;		
		io.sockets.in(room).emit('main chat', data);
	});
	//disconnect
	socket.on('disconnect', function() {
		/*for(var i in subbu_rooms){
			console.log(subbu_rooms);			
			socket.leave(subbu_rooms);
			io.sockets.emit('leave message',subbu_rooms);
		}*/
		map.delete(socket.id);
		io.sockets.emit('availableUsers','hi');	 
	});
	
	var userNames = {};
	
	//store username
	socket.on('setSocketId', function(data) {
		var userName = data.name;
		var socketId = data.userId;
		userNames[userName] = socketId;
	});

    // Handle chat event
    socket.on('one-one chat', function(data){
        console.log(data);
		//var userName = data.handle;
		//var socketId = data.targetUser;
		var room=data.handle + '_' ;
		var targetUser=data.targetUser;
		console.log(room);
		finalroom= room + targetUser;
		//console.log(finalroom);
		var clients = io.sockets.clients();
		/*var sockets = socketio.sockets.sockets;
		for(var socketId in sockets)
		{
			var socket1 = sockets[socketId]; //loop through and do whatever with each connected socket
			socket1.join(data.handle_data_targetUser);
		//...
		}*/
		if(socket.rooms[finalroom]){
		 // in the room
		  console.log('existing');
		  io.to(finalroom).emit('one-one chat', data);
		}else{
		// not in the room
			console.log('new room');
			socket.join(finalroom);
		}       
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});




