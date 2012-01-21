(function(exports, global) {
  var hirssi = exports;
  exports.Network = Network;
  /**
   * Channel namespace.
   *
   * @namespace
   */
  function Network(options) {
    this.options = {
        name: "ircnet"
      , channels: []
    };

    hirssi.util.merge(this.options, options);
    this.socket = hirssi.io.connect('/network/'+this.options.id);
    this.channels = [];
    for(var i in options.channels) {
      this.channels.push(new hirssi.Channel(options.channels[i]));
    }

  }

})('undefined' != typeof hirssi ? hirssi : module.exports, this);