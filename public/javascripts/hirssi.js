(function(exports, global, $) {
  var hirssi = exports;
  hirssi.networks = {};
  hirssi.channels = {};

  $(document).ready(function() {
    hirssi._socket = io.connect();
    hirssi._socket.on('news', function (data) {
      console.log(data);
      hirssi._socket.emit('my other event', { my: 'data' });
    });
  });

  hirssi.send = function(data) {

  }


})('object' === typeof module ? module.exports : (this.hirssi = {}), this, jQuery);