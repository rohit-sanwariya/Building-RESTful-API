/*
*Primary file for the API
*
*/

//Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;


//The server should respond to all requests with a string
var server = http.createServer(function (req, res) {

    //Get the URl and parse it 
    var parseUrl = url.parse(req.url, true);

    //Get the Path 
    var path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+$/g, '');

    //Get the query string as a Object 
    var queryStringObject = parseUrl.query;


    //Get the HTPP Method
    var method = req.method.toLowerCase();

    //Get the headers as an object 
    var headers = req.headers;

    //Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        //Choose the handler this request should go to. If one is not found, use the notfound handler 
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ?
         router[trimmedPath] : handlers.notfound;

        //Construct the data object to send to the handler 
        var data = { 
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };
//Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload){
            // Use the status code called back by the handler , or default to 200 
statusCode = typeof (statusCode) == 'number' ?
 statusCode : 200 ;

            //Use the payload called back by the handler , or default to an emptyobject 
payload = typeof(payload) == 'object' ?
 payload: {};

//Convert the payload to a string
var payloadString = JSON.stringify(payload);

//Return the response
res.writeHead(statusCode);
res.end(payloadString);

 //Log the request path 
 console.log('Returning this response:',
  statusCode,payloadString);
        });
     });
    });
   

//Start the server, and have it listenan port 3000
server.listen(3000, function () {
    console.log("The server is listening on port 3000 now");
});

//Define the handlers 
var handlers = {};

//Sample handler 
handlers.sample = function (data,callback){ 
    callback(406,{'name' : 'sample handler'});
};

//Not found handler
handlers.notfound = function (data , callback) {
    callback(404);
};

//Define a request router
var router = {
    'sample': handlers.sample
};
