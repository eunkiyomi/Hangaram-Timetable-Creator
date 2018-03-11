import * as finalhandler from 'finalhandler';
import * as http from 'http';
import * as serveStatic from 'serve-static';

// Serve up public/ftp folder
const serve = serveStatic('./');

// Create server
const server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res))
});

// Listen
server.listen(3000);
