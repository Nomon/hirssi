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
    var username2 = "orktesss";
    var host = "localhost";
    var channels = ["#orktes-test"];
    var port = 6667;

    m.createIrcService({username: username, host: host, port: port, channels: channels}, function () {
      m.createIrcService({username: username2, host: host, port: port, channels: channels}, function () {
        m.getIrcClient({username: username2, host: host, port: port}, function (err, c) {
          c.on('message', function (from, to, message) {
            console.log(from, to, message);
          });
          setTimeout(function () {
            m.getIrcClient({username: username, host: host, port: port}, function (err, c2) {
              c2.say(username2, "KISSA");
            });
          }, 1000);

        });
      });

    });
  }
};

pub.on('connect', connCB);
sub.on('connect', connCB);

