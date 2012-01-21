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
  var options = {};
  if(command.args.realname !== undefined) {
    options.realname = command.args.realname;
  }
  if(command.args.user !== undefined) {
    options.user = command.args.user;
  }
  if(command.args.user !== undefined) {
    options.nick = command.args.nick;
  }
  user.addNetwork(options);
}