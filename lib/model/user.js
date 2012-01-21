var Network = require('./network').Network;
var schema = require('./schema').schema;


var User = exports.User = schema.define('User', {
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

User.hasMany(Network, {as:'networks', foreignKey: 'networkId'});
