var redis = require('redis');
var client = redis.createClient();

function User(data) {
  this.data = data || {};
  this.profile = null;
};

module.exports = User;

User.prototype.load = function(id, callback) {
  var self = this;
  client.hgetall('User:'+id, function(err, res) {
    if(err) {
      return callback(err);
    }
    self.data = res;
    client.hgetall('User:'+id+":profile", function(err, res) {
      if(err) {
        return callback(err);
      }
      self.profile = res;
      return callback(null, self);
    });
  });
};

/**
 * Gets or sets the user profile and saves it to redis.
 * @param data
 * @param callback
 * @return {*}
 */
User.prototype.profile = function(data, callback) {
  var self = this;
  // get profile
  if(typeof data === 'function' && callback === undefined) {
    callback = data;
    if(this.profile != null) {
      return callback(null, this.profile);
    } else {
      client.hgetall('User:'+this.data.id+':profile', function(err, res) {
        self.profile = res;
        return callback(err, res);
      });
    }
  } else {
    this.profile = data;
    client.hmset('User:'+this.data.id+":profile", data, function() {
      return callback(null, self.profile);
    });
  }
}

// Static function to create user.
User.create = function(data, callback) {
  var self = this;
  var user = new User(data);
  client.incr('i:User', function(err, id) {
    user.data.id = id;
    user.save(callback);
  });
};


