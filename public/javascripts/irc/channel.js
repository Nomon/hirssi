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
    }
    hirssi.util.merge(this.options, options);
    this.users = [];
  }





})('undefined' != typeof hirssi ? hirssi : module.exports, this);