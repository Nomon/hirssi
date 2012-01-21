var irc = require('irc');
var sys = require('util');
var events = require('events');

var IRCService = function (options) {
  this.pub = options.pub;
  this.sub = options.sub;
  this.manager = options.manager;
  this.username = options.username;
  this.host = options.host;
  this.port = options.port;
  this.channels = options.channels || [];
  this.ircClient = null;
  this.cchannel = 'ircclient:' + this.host + ":" + this.port + ":" + this.username;
  this.channel = 'ircservice:' + this.host + ":" + this.port + ":" + this.username;
  var self = this;
  this.sub.on('message', function (channel, message) {
    if (channel === self.channel) {
      var parts = message.split(':');
      parts = parts.map(function (item) { try { return JSON.parse(decodeURI(item));} catch (e) { return item; } });
      self.emit.apply(self, parts);
    }
  });
  this.sub.subscribe(this.channel);

  this.setStatus(1);
  setInterval(function () {
    self.setStatus(self.status);
  }, 2000);

  this._initListeners();
};

sys.inherits(IRCService, events.EventEmitter);

IRCService.prototype._initListeners = function () {
  var self = this;
  this.on('say', function (target, message) {
    self.ircClient.say(target, message);
  });
};

IRCService.prototype.setStatus = function (status) {
  this.status = status;
  this.pub.publish("ircmanagers", "service_status:"+ this.host + ":" + this.port + ":" + this.username + ":" + status);
};

IRCService.prototype.cmd = function (cmd) {
  cmd = cmd.map(function (item) {
    item = JSON.stringify(item);
    return encodeURI(item);
  });
  this.pub.publish(this.cchannel, cmd.join(":"));
};

IRCService.prototype.open = function (callback) {
  var self = this;
  this.ircClient = new irc.Client(this.host, this.username, { channels : this.channels });
  self._initIrcClientListeners();
  this.ircClient.once('connect', function () {
    callback();
  });
};

IRCService.prototype._initIrcClientListeners = function () {
  var self = this;

  var orgEmit = this.ircClient.emit;

  this.ircClient.on('error', function () {
  });

  this.ircClient.emit = function (type) {
    var args = Array.prototype.slice.call(arguments);
    if (type != "newListener" && type != "raw" && type != "removeListener") {
      self.cmd(args);
    }
    orgEmit.apply(self.ircClient, args);
  };
  
};

exports.IRCService = IRCService;