/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.session && !req.session.irc) {

  }
  res.render('index', { title: 'hrssi - HTML5 irssi clone' })
};

exports.session = function(req, res) {
  res.send(req.session);
}