/**
 * Handles /network command
 */
(function(exports, global) {
  var hirssi = exports;

  hirssi.commands.help = function(command, cb) {
    console.dir(command);
    if(command.args.length < 2) {
      hirssi.print(hirssi.help.help.text);

    } else {
      if(hirssi.help[command.args[1]]) {
        hirssi.print(hirssi.help[command.args[1]].text);
      } else {
        hirssi.print("No help available for "+command.args[1]);
      }
    }
  };



})('undefined' != typeof hirssi ? hirssi : module.exports, this);