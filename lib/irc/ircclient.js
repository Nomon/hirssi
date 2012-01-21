var sys = require('util');
var events = require('events');

var IRCClient = function (options) {
  this.userId = options.userId;
  this.pub = options.pub;
  this.sub = options.sub;
  this.manager = options.manager;
  this.username = options.username;
  this.host = options.host;
  this.port = options.port;
  this.channel = 'ircclient:' + this.host + ":" + this.port + ":" + this.userId;
  this.schannel = 'ircservice:' + this.host + ":" + this.port + ":" + this.userId;
  var self = this;
  this.sub.on('message', function (channel, message) {
    if (channel === self.channel) {
      var parts = message.split(':');
      parts = parts.map(function (item) { try { return JSON.parse(decodeURI(item));} catch (e) { return item; } });
      self.emit.apply(self, parts);
    }
  });
  this.sub.subscribe(this.channel);

  this.init = false;

  this._initListeners();
};

sys.inherits(IRCClient, events.EventEmitter);

IRCClient.prototype._initListeners = function () {
  var self = this;

  this.once('init_response', function () {
    self.init = true;
  });
};

IRCClient.prototype.cmd = function (cmd) {
  cmd = cmd.map(function (item) {
    item = JSON.stringify(item);
    return encodeURI(item);
  });
  this.pub.publish(this.schannel, cmd.join(":"));
};

IRCClient.prototype.say = function (target, message) {
  this.cmd(["say", target, message]);
};

IRCClient.prototype.init = function (callback) {
  this.once('init_response', function () {
    callback();
  });

  this.cmd('init');
};

exports.IRCClient = IRCClient;