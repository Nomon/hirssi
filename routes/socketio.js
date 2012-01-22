var clients = {};
var socket = require('socket.io');
var connect = require('connect');
var io = exports.io = null;
var app = exports.app = null;
var session = exports.session = null;
var User = require('../lib/model/user').User;

var networkCommand = require('./socket.io/network');

exports.init = function(application, sessionStore) {
  session = sessionStore;
  app = application;
  io = socket.listen(application);
  io.sockets.on('connection', function (socket) {
    exports.connect(socket);
    socket.on('disconnect',function() {
      exports.disconnect(socket);
    });
  });

  /**
   * Authorize the socket.io connection with session id.
   */
  io.configure(function (){
    io.set('authorization', function (handshakeData, callback) {
      if(!handshakeData.headers || !handshakeData.headers.cookie) {
        return callback("Not authorized",false);
      }
      var cookies = connect.utils.parseCookie(handshakeData.headers.cookie);
      sessionStore.load(cookies['connect.sid'], function(err,ses) {
        handshakeData.session = ses;
        callback(err,handshakeData.session);
      });
    });
  });

  io.on('cmd', function(socket, command) {
    command.client = clients[socket.id];
    exports.cmd(command, function(err, response) {
      io.emit('cmdresponse',err, response);
    });
  });

}
/* connect "route" for socket.io initial connections */
exports.connect = function(socket) {
  console.dir(socket.handshake);
  if(!socket.handshake || !socket.handshake.session || !socket.handshake.session.auth) {
    console.log("Not authenticated.");
    console.dir(socket.handshake.session.auth);
    return;
  }
  User.find(socket.handshake.session.auth.userId,function(err,user) {
    var socketClient = {
      user: user,
      session:socket.handshake,
      socketId:socket.id
    };
    clients[socket.id] = socketClient;
    console.log("User connected, lets get a connection");
    /* need to require runtime because controller nmight be null earlier. */
    var irc = require('../lib/controller/irccontroller').controller;
    irc.getClient(user, function(err, client) {
      clients[socket.id].irc = client;
      client.socketId = socket.id;
      setupIrcListeners(client);
    });
  });
}

var setupIrcListeners = function(client) {
  client.on('message', function(socket, data) {
    var socketClient = clients[client.socketId];
    console.log("privmsg ");
    console.dir(arguments);
  });
}

exports.disconnect = function(socket) {
  delete clients[socket.id];
}

exports.cmd = function(command, cb) {
  console.log("Got command");
  console.dir(command);
  switch(command.cmd) {
    case 'network':
      return networkCommand.run(command, cb);
    break;
    default:
      console.log("Unknown command");
      cb("Unknown command",null);
  }
};


