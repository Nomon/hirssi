/**
 * Handles /network command
 */
(function(exports, global) {
  var hirssi = exports;

  hirssi.commands.network = function(command, cb) {
    if(command.args.length < 2) {
      cb(true, null);
      return false;
    }
    if(command.args[1].toUpperCase() == 'ADD') {
      addNetwork(command, cb);
    } else if(command.args[1].toUpperCase() == 'LIST') {
      listNetworks(command, cb);
    } else if(command.args[1].toUpperCase() == 'REMOVE') {
      removeNetwork(command, cb);
    } else {
      if(cb) cb(true,null);
      return false;
    }
  };

  function addNetwork(command, cb) {
    hirssi.socket.emit('network', command, function(err, network) {
      if(err != null) {
        var nw = new hirssi.Network(network);
        hirssi.networks.push(nw);
        cb(null,nw);
        return true;
      } else {
        hirssi.print(err);
        return false;
      }
    });
  }

  function removeNetwork(command, cb) {
    hirssi.socket.emit('network', command, function(err, network) {
      if(err != null) {
        for(var i = hirssi.networks.length;i>0;i--) {
          if(command.args[0].toLowerCase() == hirssi.networks[i].name) {
            hirssi.networks.splice(i,1);
          }
        }
        if(cb) cb(null);
        return true;
      } else {
        hirssi.print(err);
        if(cb) cb(true);
        return false;
      }

    });
  }

  function listNetworks(command, cb) {
    hirssi.print("Networks:");
    for(var i in hirssi.networks) {
      hirssi.print(hirssi.networks[i].name);
    }
    if(cb) cb(null);
  }

})('undefined' != typeof hirssi ? hirssi : module.exports, this);