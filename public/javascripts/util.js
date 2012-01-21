(function (exports, global) {

  /**
   * Utilities namespace.
   *
   * @namespace
   */
  var util = exports.util = {};

  /**
   * Merges two objects.
   * Borrowed from socket.io code.
   * @api public
   */
  util.merge = function merge (target, additional, deep, lastseen) {
    var seen = lastseen || []
      , depth = typeof deep == 'undefined' ? 2 : deep
      , prop;
    for (prop in additional) {
      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
        if (typeof target[prop] !== 'object' || !depth) {
          target[prop] = additional[prop];
          seen.push(additional[prop]);
        } else {
          util.merge(target[prop], additional[prop], depth - 1, seen);
        }
      }
    }

    return target;
  };

  /**
   * Checks if the given object is an Array.
   *
   *     hirssi.util.isArray([]); // true
   *     hirssi.util.isArray({}); // false
   *
   * @param Object obj
   * @api public
   */
  util.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

})('undefined' != typeof hirssi ? hirssi : module.exports, this);