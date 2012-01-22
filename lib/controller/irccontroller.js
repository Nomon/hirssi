var User = require('../model/user');
var IRCManager = require('../irc/ircmanager').IRCManager;
var cfg = require('../config').cfg;
var redis = require('redis');


var pub = redis.createClient(cfg.get('redis_port'),cfg.get('redis_host'));
var sub = redis.createClient(cfg.get('redis_port'),cfg.get('redis_host'));

var IrcController = exports.IrcController = function() {
  this.manager = new IRCManager(pub, sub);

  var self = this;
  self.loadAllConnections();
}
exports.controller = null;

exports.start = function() {
  exports.controller = new IrcController();
  console.log("Placed");
}



var getIrcConfiguration = function(network, cb) {
  var srvrs = [];
  network.servers(function(err, servers) {
    for(var i in servers) {
      var server = servers[i];
      srvrs.push({id:network.id,port:server.port,host:server.host});
    }
    return cb(err, srvrs);
  });
}

IrcController.prototype.loadAllConnections = function() {
  var connectionConfigurations = [];
  var self = this;
  User.User.all(function(err, users) {
    users.forEach(function(user) {
      user.networks(function(err, networks) {
        networks.forEach(function(network) {
          var networkConfiguration = {
              userId: user.id
            , username: user.name
            , network: {
                id:network.id
              , servers:[]
            }
          };
          getIrcConfiguration(network, function(err, config) {
            networkConfiguration.network.servers = config;
            console.dir(networkConfiguration);
            self.manager.createIrcService(networkConfiguration, function() {
               self.manager.getIrcClient({
                   userId:user.id
                 , username: user.name
                 , network: {
                     id: network.id
                   }
               }, function(err, client) {
                self.setupListeners(client, function(err, client) {
                  console.log("IRC client loaded and done");
                });
               }) ;
            });
          });
        });
      });
    });
  });
};

IrcController.prototype.setupListeners = function(client, cb) {
  client.on('message', function() {

  });
  client.hasListeners = true;
  cb(null, client);
}

IrcController.prototype.getClient = function(user, cb) {
  var self = this;
  user.networks(function(err, networks) {
    if(networks.length == 0) {
      return cb(new Error("User has no networks! can't connect to irc."));
    }
    networks.forEach(function(network) {
      var networkConfiguration = {
          userId: user.id
        , username: user.name
        , network: {
            id:network.id
          , servers:[]
        }
      };
      getIrcConfiguration(network, function(err, config) {
        networkConfiguration.servers = config;
        self.manager.createIrcService(networkConfiguration, function() {
           self.manager.getIrcClient({
               userId:user.id
             , username: user.name
             , network: {
                 id: network.id
               }
           }, function(err, client) {
              cb(err, client);
           });
        });
      });
    });
  });

}