
/*
 * GET home page.
 */

exports.index = function(req, res){
  if(req.headers['accept'].match(/text\/html/)) {
    console.log("html");
  } else {
    console.log("no html")
  }
  res.render('index.html')
};