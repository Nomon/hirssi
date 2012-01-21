/**
 * Code related to the footer section. The message sending functionality and channel activity bar.
 */
(function(exports, global, $) {
  var self = this;
  var hirssi = exports;
  hirssi.footer = {};


  /* Bind to load because images can affect DOM positioning if they are slow loaders.*/
  $(window).bind('load',function() {
    var el = $('#footer');
    function positionFooter() {
      el.css({top:($(window).height()-el.height())+"px"});
    }
    positionFooter();
    $(window).scroll(positionFooter).resize(positionFooter);
  });

  hirssi.footer.enterPressed = function(ev) {
    var command = $('#privmsg').val();
    var cmd = {
      raw:command
    };
    $('#privmsg').val("");
    hirssi.router(cmd);
  };

  /* Make sure the footer is always positioned correctly */
  self.el = $('#footer');

  /* Something is typed into footer privmsg box */
  $(document).ready(function() {
    $('#privmsg').bind('keypress', function(e) {
      /* enter */
      if(e.which == 13) {
        hirssi.footer.enterPressed(e);
        e.preventDefault();
      }
    });
  });



})('undefined' != typeof hirssi ? hirssi : module.exports, this, jQuery);