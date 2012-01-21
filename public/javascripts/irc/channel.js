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
    this.users = [];
    for(var i in options.users) {
      this.users.push(new hirssi.User(options.users[i]));
    }
  }





})('undefined' != typeof hirssi ? hirssi : module.exports, this);