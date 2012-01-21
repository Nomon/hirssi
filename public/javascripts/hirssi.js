(function(exports, global, $) {
  var hirssi = exports;
  hirssi.commands = {};
  hirssi.networks = [];
  hirssi.me = {};
  hirssi.window = null;

  $(document).ready(function() {
    hirssi.window = $('#channel');
    hirssi._socket = io.connect();

    hirssi._socket.on('irc', function(data) {
      hirssi.me = new hirssi.User({socket:hirssi.socket, nick:data.nick});
      for(var i in data.networks) {
        hirssi.networks.push(new hirssi.Network(data.networks[i]));
      }
    });
  });

  hirssi.print = function(text) {
    if(hirssi.util.isArray(text)) {
      for(var i in text) {
        var elem = $('<li>'+text[i]+'</li>');
        elem.appendTo(hirssi.window);
      }
    } else {
      var elem = $('<li>'+text+'</li>');
      elem.appendTo(hirssi.window);
    }

  }


})('object' === typeof module ? module.exports : (this.hirssi = {}), this, jQuery);