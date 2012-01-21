exports.tokenizeCommand = function(args) {
  var parts = args.split(" ");
  var obj = {};
  obj.name = "";
  obj.args = {}
  obj.subcommand = "";
  obj.param = "";

  obj.name = parts[0].toLowerCase();
  obj.subcommand = parts[1].toLowerCase();
  obj.param = parts[parts.length - 1];
  var arg = null;
  var iq = null; // in quotes.

  for(var i = 2;i<parts.length;i++) {
    var word = parts[i];
    var char = parts[i].charAt(0);

    if(char == "-") {
      arg = word.substr(1).toLowerCase();
    } else if(arg != null && word.length > 0) {
      if(char == "'" || char == '"') {
        iq = char;
        obj.args[arg] = word.substr(1);
        if(word.charAt(word.length-1) == char) {
          obj.args[arg] = obj.args[arg].substr(0,obj.args[arg].length-1);
          arg = null;
          continue;
        }
        obj.args[arg] += " ";
      } else if(iq != null) {
        var ec = word.charAt(word.length-1);

        if(ec == iq) {
          obj.args[arg] += word.substr(0,word.length-1);
          iq = null;
          arg = null;
        }
      } else if(word == "" && arg != null) {
        obj.args[arg] += " ";
      } else if(arg != null) {
        obj.args[arg] = word;
        arg = null;
      }
    } else if(arg != null && word.length == 0)
    {
      obj.args[arg] += " ";
      if(!iq) arg = null;
    }
  }

  return obj;
}