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
    }
  });
  Login.Model = Backbone.Model.extend({});
  Login.Collection = Backbone.Model.extend({});
  Login.Views = Views;

  return Login;
});
