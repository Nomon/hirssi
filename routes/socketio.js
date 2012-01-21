var clients = {};
var socket = require('socket.io');
var connect = require('connect');
var io = null;
var app = null;
var session = null;
var User = require('../lib/model/user').User;

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

}
/* connect "route" for socket.io initial connections */
exports.connect = function(socket) {

  User.find(socket.handshake.session.userId,function(err,user) {
    var socketClient = {
      user: user,
      session:socket.handshake,
      socketId:socket.id
    };
    clients[socket.id] = socketClient;
  });
}

exports.disconnect = function(socket) {
  delete clients[socket.id];
}