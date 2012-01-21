var util = require('../util');

var assert = require('assert');

suite('util.tokenizeCommand', function() {
  test('util.tokenizeCommand should parse command with no arguments', function() {
    var command = util.tokenizeCommand("network add kissa");
    assert.equal("kissa", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network",command.name);
  });

  test('util.tokenizeCommand should parse command with 1 argument', function() {
    var command = util.tokenizeCommand("network add -nick Nomon kissa");

    assert.equal("kissa", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network",command.name);
    assert.equal("Nomon",command.args.nick);
  });
  test('util.tokenizeCommand should parse command with  many argument', function() {
    var command = util.tokenizeCommand("network add -nick Nomon -realname Matti kissa");

    assert.equal("kissa", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network", command.name);
    assert.equal("Nomon", command.args.nick);
    assert.equal("Matti", command.args.realname);
  });
  test('util.tokenizeCommand should convert params to lower case', function() {
    var command = util.tokenizeCommand("NeTwOrK AdD -nIck Nomon -RealNAME MattI KissA");

    assert.equal("KissA", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network", command.name);
    assert.equal("Nomon", command.args.nick);
    assert.equal("MattI", command.args.realname);
  });
  test('util.tokenizeCommand should handle quoted strings as params', function() {
    var command = util.tokenizeCommand("NeTwOrK AdD -nIck Nomon -RealNAME 'MattI Savolainen' KissA");

    assert.equal("KissA", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network", command.name);
    assert.equal("Nomon", command.args.nick);
    assert.equal("MattI Savolainen", command.args.realname);
  });
  test('util.tokenizeCommand should handle spaces in quoted strings', function() {
    var command = util.tokenizeCommand("NeTwOrK AdD -nIck Nomon -RealNAME 'MattI    Savolainen' KissA");

    assert.equal("KissA", command.param);
    assert.equal("add", command.subcommand);
    assert.equal("network", command.name);
    assert.equal("Nomon", command.args.nick);
    assert.equal("MattI    Savolainen", command.args.realname);
  });
});
