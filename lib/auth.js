var everyauth = require('everyauth')
  , User = require('./model/user')
  , config = require('./config').cfg;

exports.initialize = function(express, app) {
  everyauth.helpExpress(app);
  everyauth.debug = true;
  everyauth.github
    .appId(config.get('github_client_id'))
    .appSecret(config.get('github_secret'))
    .myHostname('http://local.host:3000')
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
      var promise = this.Promise();
      githubUserMetadata.authType = "github";
      User.User.all({where: {authType:"github",authId:githubUserMetadata.id}},function(err,du) {
        if(err || du.length == 0) {
          console.log("Found no user creating one");
          var user = User.createUser(githubUserMetadata, function(err, user) {
            promise.fulfill(user);
          });
        } else {
          console.log("Found user, fullfilling promise with");
          console.dir(du);
          promise.fulfill(du[0]);
        }

      });
      return promise;
    })
    .redirectPath('/');
}