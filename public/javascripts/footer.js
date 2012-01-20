/**
 * Code related to the footer section. The message sending functionality and channel activity bar.
 */
(function(exports, global) {
  var self = this;
  var positionFooter = function() {
    this.el.css({
        position: "absolute"
      , top:($(window).scrollTop()+$(window).height()-self.el.height()+"px")
    });
  }
  var Footer = function() {
    self.el = $('#footer');
    $(window).scroll(positionFooter).resize(positionFooter);
  }
  window.Footer = new Footer();
})('object' === typeof module ? module.exports : (this.footer = {}), this);