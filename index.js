var hapi = require("hapi");

var server = new hapi.Server({ debug: { request: ["*"] }});

server.connection({
  host: "0.0.0.0",
  port: process.env.PORT || 3000
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
