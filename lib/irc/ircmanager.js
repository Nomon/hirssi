var IRCClient = require('./ircclient').IRCClient;
var User = new require('../model/user').User;

var IRCManager = function (redis) {
 this.localClients = {};
 this.redis = redis;
};

IRCManager.prototype.getIrcClientsForUser = function (id, callback) {
  var local, result = [];

  local = this._getLocalClients(id);
  
  this._getRemoteClients(id, function (err, clients) {
    if (err) {
      return callback(err);
    }

    result = local.concat(clients);

    callback(null, clients);
  });
};

IRCManager.prototype._getLocalClients = function (id) {
  var results = [];

  if (this.localClients[id] != null) {
    results = this.localClients[id];
  }

  return results;
};

IRCManager.prototype._getRemoteClients = function (id, callback) {
  this._getUserServerConfig(id, function (err, servers) {
    (function next(i) {
      var server = servers[i];

      redis.on('message', function (channel, message) {
        if (channel === (id + ":ircserver:" + server.host + ":stats")) {
          
        }
      });
      redis.multi()
          .publish(id + ":ircserver:" + server.host, "status")
          .subscribe(id + ":ircserver:" + server.host + ":stats")
          .exec();
    })(0);
  });
};

IRCManager.prototype._getUserServerConfig = function (id, callback) {
  User.find(id, function (err, user) {
    if (err) {
      return callback(err);
    }

    user.ircServers(function (err, servers) {
      if (err) {
        return callback(err);
      }

      callback(null, servers);
    });
  });
};

IRCManager.prototype.createClient = function (id, options, callback) {

};


exports.IRCManager = IRCManager;