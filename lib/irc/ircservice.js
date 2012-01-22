var irc = require('irc');
var sys = require('util');
var events = require('events');

var IRCService = function (options) {
  this.userId = options.userId;
  this.pub = options.pub;
  this.sub = options.sub;
  this.manager = options.manager;
  this.username = options.username;
  this.network = options.network;
  this.channels = options.channels || [];
  this.ircClient = null;
  this.cchannel = 'ircclient:' + this.network.id + ":" + this.userId;
  this.channel = 'ircservice:' + this.network.id + ":" + this.userId;
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
    self._recordEvent(target, {et: "msg", t: target, f: self.username, m: message});
    self.cmd(['message', self.username, target, message]);
  });

  this.on('join', function (channel) {
    self.ircClient.join(channel, function () {
    });
  });

  this.on('part', function (channel) {
    self.ircClient.part(channel, function () {
    });
  });

  this.on('action', function (channel, text) {
    self.ircClient.action(channel, text);
  });

  this.on('notice', function (target, text) {
    self.ircClient.notice(target, text);
  });

  this.on('whois', function (target) {
    self.ircClient.notice(target, function () {
    });
  });

  this.on('list', function () {
    var args = Array.prototype.slice.call(arguments, 0);
    self.ircClient.notice.apply(self.ircClient, args);
  });
  
  this.on('send', function () {
    var args = Array.prototype.slice.call(arguments, 0);
    self.ircClient.notice.apply(self.ircClient, args);
  });

  this.on('motd', function () {
    self.cmd(['motd', self.ircClient.motd]);
  });

  this.on('channels', function () {
    self.cmd(['channels', self.ircClient.chans]);
  });

  this.on('topic', function (channel) {
    if (chandata == null) {
      self.cmd(['topic', channel, "", ""]);
      return;
    }
    var chandata = self.ircClient.chanData(channel);
    self.cmd(['topic', channel, chandata.topic, chandata.topicBy]);
  });

  this.on('names', function (channel) {
    var chandata = self.ircClient.chanData(channel);
    if (chandata == null) {
      self.cmd(['names', channel, []]);
      return;
    }
    self.cmd(['names', channel, chandata.users]);
  });

};

IRCService.prototype.setStatus = function (status) {
  this.status = status;
  this.pub.publish("ircmanagers", "service_status:" + this.network.id + ":" + this.userId + ":" + status);
};

IRCService.prototype.cmd = function (cmd) {
  cmd = cmd.map(function (item) {
    item = JSON.stringify(item);
    return encodeURIComponent(item);
  });
  this.pub.publish(this.cchannel, cmd.join(":"));
};

IRCService.prototype.open = function (callback) {
  var self = this;
  this.ircClient = new irc.Client(this.network.servers[0].host, this.username, { channels : this.channels });
  self._initIrcClientListeners();
  this.ircClient.once('error', function () {
    if (callback) {
      callback();
      callback = null;
    }
  });
  this.ircClient.once('registered', function () {
    if (callback) {
      callback();
      callback = null;
    }
  });
};

IRCService.prototype._recordEvent = function (key, event) {
  event.d = (new Date()).getTime();
  this.pub.zadd('ircevents:' + key + ":" + this.network.id + ":" + this.userId, event.d, JSON.stringify(event));
};

IRCService.prototype._initIrcClientListeners = function () {
  var self = this;

  var orgEmit = this.ircClient.emit;

  this.ircClient.on('error', function () {
  });

  this.ircClient.on('nick', function (oldNick, newNick, channels) {
    //TODO user event list should be changed to match the new nick
    self._recordEvent(newNick, {et: "nick", o: oldNick, n: newNick});
    var i;
    for (i = 0; i < channels.length; i++) {
      self._recordEvent(channels[i], {et: "nck", o: oldNick, n: newNick});
    }
  });
  
  this.ircClient.on('topic', function (channel, topic, topicBy) {
    self._recordEvent(channel, {et: "tpc", t: topic, b: topicBy});
  });

  this.ircClient.on('kill', function (nick, reason) {
    self._recordEvent(nick, {et: "kll", n: nick, r: reason});
  });

  this.ircClient.on('kick', function (channel, who, by, reason) {
    self._recordEvent(channel, {et: "kik", n: who, b: by, r: reason});
  });

  this.ircClient.on('part', function (channel, who,reason) {
    self._recordEvent(channel, {et: "prt", n: who, r: reason});
  });

  this.ircClient.on('join', function (channel, who) {
    self._recordEvent(channel, {et: "jin", n: who});
  });

  this.ircClient.on('invite', function (channel, from) {
    self._recordEvent(channel, {et: "ivt", c: channel, f: from});
    self._recordEvent(from, {et: "ivt", c: channel, f: from});
  });

  this.ircClient.on('notice', function (from, to, text) {
    var arch = to;
    if (to === self.ircClient.nick) {
      arch = from;
    }
    self._recordEvent(arch, {et: "ntc", t: to, f: from, m: text});
  });

  this.ircClient.on('message', function (from, to, message) {
    var arch = to;
    if (to === self.ircClient.nick) {
      arch = from;
    }
    self._recordEvent(arch, {et: "msg", t: to, f: from, m: message});
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