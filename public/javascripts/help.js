(function(exports, global) {
  var hirssi = exports;
  if(!hirssi.help) {
    hirssi.help = {};
  }

  hirssi.help.network = {
      text: [" NETWORK ADD [-nick <nick>] [-user <user>] [-realname <name>] [-usermode <mode>] <name>",
          " NETWORK REMOVE <network>",
      "",
      "      -nick, -user, -realname: Specify what nick/user/name to use",
      "      -usermode: Specify what usermode to use on this network" ,
      "      -autosendcmd: Command to send after connecting to a server" ,
      "" ,
      " With -autosendcmd argument you can automatically run any commands after connecting to network. This is useful for automatically identifying yourself to NickServ, for example" ,
      "" ,
      " Shows and changes the settings of defined IRC networks." ,
      "" ,
      " See also: CONNECT" ,
      "" ,
      " Irssi commands:" ,
      " network add network list network remove"]
  };
  hirssi.help.help = {
    text: ["Irssi commands:" ,
          "network"]
  }
})('undefined' != typeof hirssi ? hirssi : module.exports, this);