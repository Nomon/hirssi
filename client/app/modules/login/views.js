define([
  "app",

  // Libs
  "backbone"
],
function(app, Backbone) {

  var Views = {};

  Views.Login = Backbone.View.extend({
    template: "app/templates/login",
    events: {

    },
    initialize: function() {

    },
    render:function() {
      var tmpl = app.fetchTemplate(this.template);
      // Set the template contents.
      this.$el.html(tmpl());
    }
  });
  return Views;
});