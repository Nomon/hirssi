(function(window, $) {
  $(document).ready(function() {
    var socket = io.connect('http://localhost');
     socket.on('news', function (data) {
       console.log(data);
       socket.emit('my other event', { my: 'data' });
     });
  });
  /* Bind to load because images can affect DOM positioning if they are slow loaders.*/
  $(window).bind('load',function() {
    var fh = 0
      , ft = 0
      , footer = $('#footer');

    function positionFooter() {
      fh = footer.height();
      ft = ($(window).scrollTop()+$(window).height()-fh)+"px";
      footer.css({top:($(window).height()-footer.height())+"px"});
    }

    positionFooter();
    $(window).scroll(positionFooter).resize(positionFooter);
  });

})(window, $);