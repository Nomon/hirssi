var repl = require('repl');
var jugglingdb = require('jugglingdb');
var schema = require('./lib/model/schema').schema;
var Model = require('./lib/model');
var util = require('util');
var User = Model.User.User;
var Channel = Model.Channel.Channel;
var Network = Model.Network.Channel;
var Server = Model.Server.Server;



var c = function() {
  var args = Array.prototype.slice.apply(arguments);
  var i = 0;
  for(var i in args) {
    con.context["_"+i] = args[i];
    console.log("\n"+util.format("%d: %s\n",i,util.inspect(args[i],2)));
  }
}

var con = repl.start("hirssi> ",null,null,true);
con.context.User = User;
con.context.Channel = Channel;
con.context.Server = Server;
con.context.Network = Network;
con.context.c = c;
