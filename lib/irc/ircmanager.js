var os = require('os');
var sys = require('util');
var events = require('events');
var IRCClient = require('./ircclient').IRCClient;
var IRCService = require('./ircservice').IRCService;

var IRCManager = function (pub, sub) {
  var self = this;
  this.serviceStatuses = {};
  this.pub = pub;
  this.sub = sub;
  this.hostname = os.hostname();
  this.pid = process.pid;
  this.callId = 0;
  this.callbacks = [];
  this.channel = "ircmanager:" + this.hostname + ":" + this.pid;

  this.sub.on('message', function (channel, message) {
    if (channel === self.channel || channel === "ircmanagers" || channel === "ircmanagers:" + this.hostname) {
      var parts = message.split(':');
      self.emit.apply(self, parts);
    }
  });

  this.sub.subscribe("ircmanagers");
  this.sub.subscribe("ircmanagers:" + this.hostname);
  this.sub.subscribe(this.channel);


  this._initListeners();

};

sys.inherits(IRCManager, events.EventEmitter);

IRCManager.prototype._initListeners = function () {
  var self = this;
  this.on('service_status', function (host, port, username, status) {
    self.serviceStatuses[host + ":" + port + ":" + username] = status;
  });
};

IRCManager.prototype.getIrcClient = function (username, host, port, callback) {
  var c = new IRCClient(this.pub, this.sub, this, username, host, port);
  if (this.serviceStatuses[host + ":" + port + ":" + username] == null
      || this.serviceStatuses[host + ":" + port + ":" + username] == 0) {
      callback(new Error("Could not found IRCService"));
  } else {
    callback(null, c);
  }
};

IRCManager.prototype.createIrcService = function (username, host, port, channels, callback) {
  var self = this;
  if (this.serviceStatuses[host + ":" + port + ":" + username] == null
      || this.serviceStatuses[host + ":" + port + ":" + username] == 0) {
    var s = new IRCService(this.pub, this.sub, this, username, host, port, channels);

    var listener = function (host, port, username, status) {
      if (host == host && port == port && username == username && status > 0) {
        callback();
        self.removeListener('service_status', listener);
      }
    };

    self.on('service_status', listener);

    s.open(function () {
    });
  } else {
    callback(new Error("IRCService already oppen"));
  }
};

exports.IRCManager = IRCManager;