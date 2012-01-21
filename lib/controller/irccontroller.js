var User = require('../model/user');
var IRCManager = require('../irc/ircmanager').IRCManager;
var cfg = require('../config').cfg;
var redis = require('redis');


var pub = redis.createClient(cfg.get('redis_port'),cfg.get('redis_host'));
var sub = redis.createClient(cfg.get('redis_port'),cfg.get('redis_host'));

var IrcController = exports.IrcController = function() {
  this.manager = new IRCManager(pub, sub);

  var self = this;
  User.User.all(function(err, users) {
    for(var i in users) {
      (function initConnection(user) {
        user.networks(function(err, networks) {
          for(var a in networks) {
            (function createService(network) {
              console.log("getting config");
              getIrcConfiguration(network, function(err, config) {
                console.log("creating service");
                var cfg = {
                                    userId: user.id
                                  , username: user.name
                                  , network: {
                                      id:network.id
                                    , servers:config
                                  }
                                }
                  console.dir(cfg);
                self.manager.createIrcService(cfg, function() {
                  console.log("getting irc client");
                  self.manager.getIrcClient({
                      userId:user.id
                    , username: user.name
                    , network: {
                        id: network.id
                    }
                  }, function(err, client) {
                    client.on('message', function() {

                    });
                  });
                });
              });
            })(networks[a]);
          }
        });
      })(users[i]);
    }
  });
}

exports.start = function() {
  var controller = new IrcController();
}



var getIrcConfiguration = function(network, cb) {
  var srvrs = [];
  network.servers(function(err, servers) {
    for(var i in servers) {
      var server = servers[i];
      srvrs.push({id:network.networkId,port:server.port,host:server.host});
    }
    return cb(err, srvrs);
  });
}

