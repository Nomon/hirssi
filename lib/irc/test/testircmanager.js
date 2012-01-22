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


    var userId = 1;
    var userId2 = 2;
    var username = "orktess";
    var username2 = "orktesss";
    var host = "localhost";
    var channels = ["#orktes-test"];
    var port = 6667;

    m.createIrcService({userId: userId, username: username, network: {id: 1, servers:[
          {host: host, port: port}
        ]}, channels: channels}, function () {
          m.createIrcService({userId: userId2, username: username2, network: {id: 1, servers:[
                {host: host, port: port}
              ]}, channels: channels}, function () {
                m.getIrcClient({userId: userId2, username: username2, network: {id: 1}}, function (err, c) {
                      c.on('message', function (from, to, message) {
                        console.log(from, to, message);
                        c.getEvents(from, 0, -1, function (err, messages) {
                          if (err) {
                            console.log(err);
                          }
                          console.log(messages);

                          c.getNames("#orktes-test", function (err, channel, users) {
                            console.log("received names", users);
                          });

                           c.getTopic("#orktes-test", function (err, channel, topic, topicBy) {
                            console.log("received topic", topic, topicBy);
                          });

                          c.getMOTD(function (err, motd) {
                            console.log("received motd", motd);
                          });

                        });

                      });
                      setTimeout(function () {
                        m.getIrcClient({userId: userId, username: username, network: {id: 1}}, function (err, c2) {
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

 

