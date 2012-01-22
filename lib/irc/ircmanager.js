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
  this.on('service_status', function (networkId, userId, status) {
    self.serviceStatuses[networkId + ":" + userId] = status;
  });
};

IRCManager.prototype.getIrcClient = function (options, callback) {

  if (this.serviceStatuses[options.network.id + ":" + options.userId] == null
      || this.serviceStatuses[options.network.id + ":" + options.userId] == 0) {
      callback(new Error("Could not found IRCService"));
  } else {
    options.pub = this.pub;
    options.sub = this.sub;
    var c = new IRCClient(options);
    callback(null, c);
  }
};

IRCManager.prototype.createIrcService = function (options, callback) {
  var self = this;
  if (this.serviceStatuses[options.network.id + ":" + options.userId] == null
      || this.serviceStatuses[options.network.id + ":" + options.userId] == 0) {
    options.pub = this.pub;
    options.sub = this.sub;
    var s = new IRCService(options);

    var listener = function (networkId, userId, status) {
      if (options.network.id == networkId && options.userId == userId && status > 0) {
        self.removeListener('service_status', listener);
        callback(null, s);
      }
    };

    self.on('service_status', listener);

    s.open(function () {
    });
  } else {
    callback(new Error("IRCService already open"));
  }
};

exports.IRCManager = IRCManager;