var cfg = exports.cfg = require('cfg').createConfig();


cfg.env('development',function(){
  cfg.set('redis_port', 6379);
  cfg.set('redis_host', "localhost");
  cfg.set('github_client_id', "0809ec5494247abbcf3a");
  cfg.set('github_secret', "1b46b8a91af94ac90d4528589aaa7ac7cc7a2801");
  cfg.set('github_callback_url', "http://matti.local:3000/auth/github");
  cfg.set('session_secret', "hirssi kissa koiira jeee jee");
  cfg.enable('debug');

});

cfg.env('production',function(){
  cfg.set('redis_port', 6379);
  cfg.set('redis_host', "localhost");
  cfg.set('github_client_id', "0809ec5494247abbcf3a");
  cfg.set('github_secret', "1b46b8a91af94ac90d4528589aaa7ac7cc7a2801");
  cfg.set('github_callback_url', "http://local.host:3000/auth/github");
  cfg.set('session_secret', "qweoisduiyfabhweqb kusad 8asqe2hbdas jsa dajg");
  cfg.disable('debug');

});
