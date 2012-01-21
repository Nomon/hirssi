
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , stylus = require('stylus')
  , socket = require('socket.io')
  , everyauth = require('everyauth')
  , config = require('./lib/config').cfg
  , redisstore = require('connect-redis')(express)
  , auth = require('./lib/auth')
  , irc = require('./lib/controller/irccontroller');


var app = module.exports = express.createServer();
var sessionStore = new redisstore
// we need to configure the authentiocation routes before express.
auth.initialize(express, app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser());
  app.use(express.session({ secret: config.get("session_secret"),  store: sessionStore}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({force:true, src: __dirname + '/public'}));
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes


app.get('/', routes.index);
app.get('/ses', routes.session);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


/**
 * Initialize socket.io "routes". needs app for listen and session store for user pairing.
 */

routes.io.init(app, sessionStore);

var connections = {};

irc.start();


/*
 * EveryAuth authentication routes.
 */

// Uncomment to see auth capabilities of everyauth
//console.dir(everyauth.facebook.routes); // undefined
//console.dir(everyauth.github.entryPath()); // '/auth/github'
//console.dir(everyauth.github.configurable());