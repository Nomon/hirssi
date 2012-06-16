define([
  // Global application context.
  "app",

  // Third-party libraries.
  "backbone",

  /* Views*/
  "modules/login/views"
],

function(app, Backbone, Views) {
  var Login = app.module();

  Login.Router = Backbone.Router.extend({
    "routes": {
      "login": "login",
      "_=_": "postLogin",
      "login2": "login2"
    },
    login2: function() {
      console.log("login2");
    },
    login: function() {
      var login = new Views.Login();
      login.$el.appendTo("#main");
      login.render();
      console.log("login router login");
    },
    postLogin: function() {
      console.log("postLogin");
      app.me = new Login.Model();
      app.me.fetch({
        success: function() {
          console.log("navigating");
          app.router.navigate('');
        },
        error: function(e) {
          console.log(e);
        }
      });
    }
  });
  Login.Model = Backbone.Model.extend({
    url: function() {
      return '/me';
    }
  });
  Login.Collection = Backbone.Model.extend({});
  Login.Views = Views;

  return Login;
});
