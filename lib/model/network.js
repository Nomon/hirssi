var schema = require('./schema').schema;
var Server = require('./server').Server;

var Network = exports.Network = schema.define('Network', {
    name:         String
});

Network.hasMany(Server, {as:'servers','foreignKey':'serverId'});





