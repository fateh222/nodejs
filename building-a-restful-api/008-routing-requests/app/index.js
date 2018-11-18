/*
* Primary file for the API
*
*/


// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all request with a string
var server = http.createServer(function( req, res ){

  // Get the Url and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  var headers = req.headers;

  // Get the payload, if any { using POST method }
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  req.on('end',function(){
    buffer += decoder.end();

    // Check the router for a  matching path for handler. If one is not found, use the notFound handler insteead.
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object send to teh handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the Request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {

      // Use the status code returned from the handler, or set the default status code at 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) == 'object' ? payload : {}

      // convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response:', statusCode, payloadString);
    });
  });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function(){
  console.log("The server is listening on port 3000 now");
});

// Define all the handlers
var handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  callback(406, {'name': 'sample handler'});
}

// Not Found handler
handlers.notFound = function(data, callback) {
  callback(404);
}

// Define the request router
var router = {
  'sample': handlers.sample
}
