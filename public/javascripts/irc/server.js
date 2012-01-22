(function(exports, global) {
  var hirssi = exports;
  exports.Server = Server;
  /**
   * Channel namespace.
   *
   * @namespace
   */
  function Server(options) {
    this.name = options.name || "default_name";
    this.host = options.host || "localhost";
    this.port = options.port || 6667;
  }


})('undefined' != typeof hirssi ? hirssi : module.exports, this);