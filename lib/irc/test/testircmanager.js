var IRCManager = require('../ircmanager').IRCManager;
var redis = require("redis");

//redis.debug_mode = true;
var pub = redis.createClient();
var sub = redis.createClient();

var con = 0;

var connCB = function () {
  con++;
  if (con == 2) {
    var m = new IRCManager(pub, sub);

    var username = "orktess";
    var host = "localhost";
    var channels = ["#orktes-test"];
    var port = 6667;

    m.createIrcService(username, host, port, channels, function () {
      setTimeout(function () {
        m.getIrcClient(username, host, port, function (err, c) {
          c.say("#orktes-test", "tämä on testiviesti");
          c.on('message', function (from, to, message) {
            c.say("#orktes-test", "KAIKU " + message);
          });
        });
      }, 3000);
    });
  }
};

pub.on('connect', connCB);
sub.on('connect', connCB);

