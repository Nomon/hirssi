(function(exports, global) {
  var hirssi = exports;
  exports.Channel = Channel;
  /**
   * Channel namespace.
   *
   * @namespace
   */
  function Channel(options) {
    this.options = {
        name: "#testi"
      , users: []
    }
    hirssi.util.merge(this.options, options);
    this.socket = hirssi.io.connect('/channel/'+this.options.id);
    this.users = [];
    for(var i in options.users) {
      this.users.push(new hirssi.User(options.users[i]));
    }
  }





})('undefined' != typeof hirssi ? hirssi : module.exports, this);