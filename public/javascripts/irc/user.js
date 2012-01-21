(function(exports, global) {
  var hirssi = exports;
  exports.User = User;
  /**
   * Channel namespace.
   *
   * @namespace
   */
  function User(options) {
    this.options = {
        nick: "#testi"
      , channels: []
    }
    hirssi.util.merge(this.options, options);
  }





})('undefined' != typeof hirssi ? hirssi : module.exports, this);