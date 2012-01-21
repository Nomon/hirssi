(function(exports, global) {
  var hirssi = exports;


  /**
   * cmdrouter figures if what you typed should be forwarded to server or is there and handle for it ?
   */
  hirssi.router = function(command, cb) {
    // TODO: remove

    // It is a command not a message

    if(command.raw.charAt(0) == '/') {
      /* do we have a local handler for this command */

      if(hirssi.commands[command.cmd]) {
        console.log("Matching internal command!");
        return hirssi.commands[command.cmd](command, cb);
      } else {
        // Send to server.
        console.log("server command");
      }
    } else {
      console.log("channel message");
    }
  }

})('undefined' != typeof hirssi ? hirssi : module.exports, this);