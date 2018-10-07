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
			  value: "devops",
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
			  value: "smart learning",
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
	  res.json(JSON.stringify(rooms));
  });
    //res.render('profile', { user: req.user });
  

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

    console.log('made socket connection', socket.id);
	//var room = socket.handshake['query']['r_var'];

	//socket.join(room);
	//console.log('user joined room #'+room);

	//disconnect
	socket.on('disconnect', function() {
	//	socket.leave(room);
		console.log('user disconnected');
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
        io.sockets.emit('one-one chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

});