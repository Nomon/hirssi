(function(exports, global, $) {
  var hirssi = exports;
  hirssi.networks = [];
  hirssi.me = {};

  $(document).ready(function() {
    hirssi._socket = io.connect();

    hirssi._socket.on('irc', function(data) {
      hirssi.me = new hirssi.User({socket:hirssi.socket, nick:data.nick});
      for(var i in data.networks) {
        hirssi.networks.push(new hirssi.Network(data.networks[i]));
      }
    });
  });



})('object' === typeof module ? module.exports : (this.hirssi = {}), this, jQuery);