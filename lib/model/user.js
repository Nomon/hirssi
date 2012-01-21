var Schema = require('jugglingdb').Schema;
var s = new Schema('redis', {
  port: 6379,
  host: "localhost"
});

var User = exports.User = s.define('User', {
    name:         String,
    authType:     String,
    authId:       Number
});

exports.createUser = function(metadata, cb) {
  var user = new User({
      name: metadata.login
    , authId: metadata.id
    , authType: metadata.authType
  });
  user.save(function(err) {
    if(err) console.dir(err);
    console.log("User saved");
    cb(err,user);
  });
  return user;
}

