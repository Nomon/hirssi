var crypto = require('crypto')
  , sechash = require('sechash');

exports.createHash = function(password, callback) {
  var self = this, saltsum, salt, opts, hash, result = {};


  saltsum = crypto.createHash('sha1');
  saltsum.update(String(Math.random()).substring(0,6));
  salt = saltsum.digest('hex');

  var opts = {
    algorithm: 'sha1',
    iterations: 2000,
    salt: salt
  };

  sechash.strongHash(password, opts, function(err, hash) {
    if(err) {
      return callback(err, null);
    }
    result.hash = hash;
    result.salt = salt;
    return callback(null, result);
  });
};
