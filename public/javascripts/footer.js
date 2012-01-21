/**
 * Code related to the footer section. The message sending functionality and channel activity bar.
 */
(function(exports, global, $) {
  var self = this;
  var footer = exports;


  /* Bind to load because images can affect DOM positioning if they are slow loaders.*/
  $(window).bind('load',function() {
    var el = $('#footer');
    function positionFooter() {
      el.css({top:($(window).height()-el.height())+"px"});
    }
    positionFooter();
    $(window).scroll(positionFooter).resize(positionFooter);
  });

  footer.enterPressed = function(ev) {
    var command = $('#privmsg').val();
    $('#privmsg').val("");
    global.hirssi.send(command);
  };

  /* Make sure the footer is always positioned correctly */
  self.el = $('#footer');

  /* Something is typed into footer privmsg box */
  $(document).ready(function() {
    $('#privmsg').bind('keypress', function(e) {
      /* enter */
      if(e.which == 13) {
        footer.enterPressed(e);
        e.preventDefault();
      }
    });
  });



})('object' === typeof module ? module.exports : (this.footer = {}), this, jQuery);