/* global process */
/* global __dirname */
var hapi = require("hapi");
var fs = require("fs");
var path = require("path");
var config = require(path.join(__dirname, "config.json"));

var server = new hapi.Server({
  debug: { request: ["*"] },
  connections: {
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});

server.connection({
  host: "0.0.0.0",
  port: process.env.PORT || 3000,
  tls: {
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
  }
});

server.route({
  method: "GET",
  path: "/{param*}",
  handler: {
    directory: {
      path: "public",
      lookupCompressed: true
    }
  },
  config: {
    cache: { expiresIn: 24*3600*1000 }
  }
});


server.start(function(){
  console.log("Started");
});
