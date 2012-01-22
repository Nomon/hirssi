var sys = require('util');
var events = require('events');

var IRCClient = function (options) {
  this.userId = options.userId;
  this.pub = options.pub;
  this.sub = options.sub;
  this.manager = options.manager;
  this.username = options.username;
  this.network = options.network;
  this.channel = 'ircclient:' + this.network.id + ":" + this.userId;
  this.schannel = 'ircservice:' + this.network.id + ":" + this.userId;
  var self = this;
  this.sub.on('message', function (channel, message) {
    if (channel === self.channel) {
      var parts = message.split(':');
      parts = parts.map(function (item) {
        try {
          return JSON.parse(decodeURIComponent(item));
        } catch (e) {
          return item;
        }
      });
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
    return encodeURIComponent(item);
  });
  this.pub.publish(this.schannel, cmd.join(":"));
};

IRCClient.prototype.say = function (target, message) {
  this.cmd(["say", target, message]);
};

IRCClient.prototype.join = function (channel, callback) {
  if (typeof(callback) == 'function') {
    this.once('join' + channel, callback);
  }
  this.cmd(["join", channel]);
};

IRCClient.prototype.part = function (channel, callback) {
  if (typeof(callback) == 'function') {
    this.once('part' + channel, callback);
  }
  this.cmd(["part", channel]);
};

IRCClient.prototype.action = function (channel, message) {
  this.cmd(["action", channel, message]);
};

IRCClient.prototype.notice = function (target, message) {
  this.cmd(["notice", target, message]);
};

IRCClient.prototype.whois = function (target, callback) {
  if (typeof callback === 'function') {
    var callbackWrapper = function(info) {
      if (info.nick == nick) {
        this.removeListener('whois', callbackWrapper);
        return callback.apply(this, arguments);
      }
    };
    this.on('whois', callbackWrapper);
  }

  this.cmd(["whois", target]);
};

IRCClient.prototype.send = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift("send");
  this.cmd(args);
};

IRCClient.prototype.list = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift("list");
  this.cmd(args);
};

IRCClient.prototype.getMOTD = function (callback) {
  if (typeof(callback) == 'function') {
    this.once('motd', callback);
  }
  this.cmd(["motd"]);
};

IRCClient.prototype.getTopic = function (channel, callback) {
  if (typeof callback === 'function') {
    var callbackWrapper = function(chan) {
      if (channel === chan) {
        this.removeListener('topic', callbackWrapper);
        return callback.apply(this, arguments);
      }
    };
    this.on('topic', callbackWrapper);
  }
  this.cmd(["topic", channel]);
};

IRCClient.prototype.getNames = function (channel, callback) {
  if (typeof callback === 'function') {
    var callbackWrapper = function(chan) {
      if (channel === chan) {
        this.removeListener('names', callbackWrapper);
        return callback.apply(this, arguments);
      }
    };
    this.on('names', callbackWrapper);
  }
  this.cmd(["names", channel]);
};

IRCClient.prototype.getEvents = function (target, start, end, callback) {
  this.pub.zrange("ircevents:" + target + ":" + this.network.id + ":" + this.userId, start, end, function (err, data) {
    if (err) {
      return callback(err);
    }
    var result = [];
    var i;
    for (i = 0; i < data.length; i++) {
      result.push(JSON.parse(data[i]));
    }
    callback(null, data);
  });
};

IRCClient.prototype.init = function (callback) {
  this.once('init_response', function () {
    callback();
  });

  this.cmd('init');
};

exports.IRCClient = IRCClient;