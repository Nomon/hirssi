
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'hrssi - HTML5 irssi clone' })
};

exports.session = function(req, res) {
  res.send(req.session);
}