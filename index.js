var hapi = require("hapi");
var fs = require("fs");

var server = new hapi.Server({ debug: { request: ["*"] }});

server.connection({
  host: "0.0.0.0",
  port: process.env.PORT || 3000,
  tls: {
    key: fs.readFileSync("/home/andrey/squirrel-server.tk.key"),
    cert: fs.readFileSync("/home/andrey/squirrel-server.tk.crt")
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
