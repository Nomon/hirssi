
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , socket = require('socket.io')
  , fs = require('fs')
  , Passport = require('./lib/passport')
  , passport = require('passport');

console.log(path.resolve(__dirname + '../client/'));
var app = module.exports = express.createServer();

/**
 * Since we run HTML5 pushState we want everything not matched by router return index.
 * DEV == reload fire on evert reg, prod = use cached.
 * @param callback
 */
function loadIndex(callback) {
  fs.readFile(__dirname + '/../client/index.html', function(err, res) {
    callback(err, res);
  });
}
// Configuration

app.configure(function(){
  app.set('view engine', 'html');
  app.set('view options',{layout: false});
  app.set('views', __dirname + '/../client/');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
 //) app.use(express.session({ secret: 'asd!!QQddst' }));
  app.use(passport.initialize());
 // app.use(passport.session());
  app.use(express.static(__dirname + '/../client/'));
  app.use(app.router);
});

app.configure('development', function(){
  app.register('.html', require('ejs'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


var auth = new Passport(app);
// Routes
app.get('/*', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});



var io = socket.listen(app);

io.configure(function (){
  io.set('authorization', function (handshakeData, callback) {
    console.log(handshakeData);
    callback(null, true); // error first callback style
  });
});
io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});