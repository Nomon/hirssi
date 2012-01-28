(function(exports, global) {
  var hirssi = exports;
  exports.Network = Network;
  /**
   * Channel namespace.
   *
   * @namespace
   */
  function Network(options) {
    this.name = options.network.name || "default_name";
    this.servers = [];
    for(var i in options.network.servers) {
      this.servers.push(new hirssi.Server(options.network.servers[i]));
    }
  }

  Network.prototype.send = function(command) {
    hirssi.socket.emit('cmd', command);
  }


})('undefined' != typeof hirssi ? hirssi : module.exports, this);