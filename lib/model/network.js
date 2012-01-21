var schema = require('./schema').schema;
var Server = require('./server').Server;
var Channel = require('./channel').Channel;

var Network = exports.Network = schema.define('Network', {
    name:         String
});


Network.hasMany(Server, {as: 'servers',foreignKey: 'serverId'});
Network.hasMany(Channel,{as: 'channels',foreignKey: 'channelId'});





