var redis = require('redis');
var client = redis.createClient();

module.exports = function User(data) {
  this.data = data || {};
}

User.prototype.load = function(id, callback) {
  var self = this;
  client.hgetall('User:'+id, function(err, res) {
    if(err) {
      return callback(err);
    }
    self.data = res;
    return callback(null, self);
  });
};