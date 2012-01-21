var Schema = require('jugglingdb').Schema;
/* All the models use the same schema, lets share it here. */
var schema  = exports.schema = new Schema('redis', {
  port: 6379,
  host: "localhost"
});