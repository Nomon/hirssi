var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , GithubStrategy = require('passport-github').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , LocalStrategy = require('passport-local')
  , User = require('./model/user');

var user = {id:1,username:'Nomon'};

var Passport = module.exports = function(app) {
  passport.use('facebook', new FacebookStrategy({
      clientID: '443266309031148',
      clientSecret: '22834dca9b5a29fccfd74586a61ec4ce',
      callbackURL: "http://local.host:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, user);
    }
  ));
  passport.use('github', new GithubStrategy({
      clientID: '0809ec5494247abbcf3a',
      clientSecret: '1b46b8a91af94ac90d4528589aaa7ac7cc7a2801',
      callbackURL: "http://local.host:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, user);
    }
  ));
  passport.use('twitter', new TwitterStrategy({
      consumerKey: 'CR1yiJeK8KdZ0k8SldGJw',
      consumerSecret: '1vJezPbJVuQ6Q29OOKSRv9GHVlFhCgiubxbtaWa8cc',
      callbackURL: "http://local.host:3000/auth/twitter/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, user);
    }
  ));

  passport.use(new LocalStrategy({
      usernameField: 'login',
      passwordField: 'password'
    },
    function(username, password, done) {
      user.login(username, password, function(err, user) {
        if(err) {
          return done(err, false);
        }
        else done(null, user);
      });
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
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback',
    passport.authenticate('github', { successRedirect: '/',
      failureRedirect: '/login' }));
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
      failureRedirect: '/login' }));

};
