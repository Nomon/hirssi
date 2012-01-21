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
};

User.prototype.addNetwork = function(network, cb) {
  var self = this;
  this.networks(function(err, networks) {
    if(err) return cb(err,null);
    for(var i in networks) {
      if(networks.name == network.name) {
        return cb("A network with that name already exists");
      }
    }
    network.userId = self.id;
    self.networks.create(network, function(err,net) {
      console.log("Network created for user.");
      if(err) return cb(err);
      cb(err,net);
      net.save(function() {
        console.log("network saved");
      });
    });
  });

};

User.hasMany(Network, {as:'networks', foreignKey: 'networkId'});
