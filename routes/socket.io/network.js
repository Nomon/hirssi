exports.run = function(command, cb) {
  switch(command.args[1]) {
    case 'ADD':
      console.log("add network");
      addNetwork(command, cb);
    break;
    case 'REMOVE':
      console.log("remove network");
    break;
    default:
      console.log("unknown args");
      console.dir(command);
    break;
  }
}

function addNetwork(command, cb) {
  var user = command.user;
  var options = {

  }
  for(var i in command.args) {
    if(command.args[i].toLowerCase() == '-nick') {
      if(command.args.length > i+1) {
        options.nick = command.args[i+1]
      }
    } else if(command.args[i].toLowerCase() == '-user') {
      if(command.args.length > i+1) {
        options.user = command.args[i+1]
      }
    } else if(command.args[i].toLowerCase() == '-realname') {
      if(command.args.length > i+1) {
        options.user = command.args[i+1]
      }
    }
  }
  user.addNetwork()
}