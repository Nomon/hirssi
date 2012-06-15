var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , User = require('./model/user');

var user = {id:1,username:'Nomon'};

var Passport = module.exports = function(app) {
  passport.use(new FacebookStrategy({
      clientID: '443266309031148',
      clientSecret: '22834dca9b5a29fccfd74586a61ec4ce',
      callbackURL: "http://local.host:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, user);
    }
  ));

  passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      done(err, user);
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
      failureRedirect: '/login' }));
};
