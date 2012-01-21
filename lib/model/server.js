var schema = require('./schema').schema;
var Channel = require('./channel').Channel;

var Server = exports.Server = schema.define('Server', {
    name: String,
    host: String,
    port: Number
});



