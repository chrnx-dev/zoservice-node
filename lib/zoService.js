var http = require("http")
	,	url = require("url")
	,	u = require("underscore")
	,	exceptions = require("./exceptions/zoExceptions")
	,	zoConfig = require('./classes/zoConfig')
	,	zoResponse = require("./classes/zoResponses");
	

/*var handle = {};
handle["/"] = requestHandlers.home;
handle["/index"] = requestHandlers.home;*/

(function ($){
	var zoservice = function(settings){
		
		settings = settings || {};
		var self = {};
		
		self.settings = new zoConfig.config();
		u.extend(self.settings, settings);
		
		self.oRequest = {};
		self.server = {};
		
		self.set = function(setting, value){
			if ( typeof setting === 'undefined' || typeof value === 'undefined'){
				return false;
			}
			self.settings[setting] = value;
			return true;
		};
		
		self.get = function(setting){
			if ( typeof setting === 'undefined'){
				return false;
			}
			
		};
		
		self.process = function(port){
			port = port || self.settings.port || 3000;
			self.server.listen(port);
			if (self.settings.debug){
				console.log('Server running on port: ' + port);
			}
		};
		
				
		self.onRequest = function(req,res){
			self.httpRequest = req;
			self.httpResponse = res;
			req.setEncoding("utf8");
			
			req.addListener("data",self.getRequest);
			req.addListener("end", function() {
				res.writeHead(200, {"Content-Type": "application/json"});
				responser = new zoResponse.response(self.oRequest, self.httpRequest, self.httpResponse, self.settings);
	    		responser.getResponse();
	    		
					
			});
		};
		
		self.getRequest = function(rawPost){
			
			try{
				self.oRequest = JSON.parse(rawPost);
				if (self.settings.debug){
					console.log("Received POST data chunk '"+
						rawPost + "'.");
				}
			} catch (err){
				e = new exceptions.RPC_INVALID_REQUEST;
				eData = e.getError();
				eData.id = null;
				eData.jsonrpc = self.settings.JSON_RPC;
				self.httpResponse.writeHead(404, {"Content-Type": "application/json"});
				self.httpResponse.write(JSON.stringify(eData));
				self.httpResponse.end();
			}
		};
		
		self.server = http.createServer(self.onRequest);
		
		return self;
	};
	
	$.zoservice = zoservice;
}(typeof window === 'undefined' ? exports:window));

/*
var zoService = {
	settings : {},
	
	create: function(settings){
		zoService.settings = new zoConfig.config();
		zoService.run(handle);
	},
	
	
	run: function(handle) {
			function onRequest(request, response) {
				var postData = "";
				var pathname = url.parse(request.url).pathname;
				console.log("Request for " + pathname + " received.");

				request.setEncoding("utf8");

				request.addListener("data", function(postDataChunk) {
					postData += postDataChunk;
					console.log("Received POST data chunk '"+
					postDataChunk + "'.");
				});

				request.addListener("end", function() {
					zoService.route(handle, pathname, response, postData);
				});
			}

			http.createServer(onRequest).listen(8888);
			console.log("Server has started.");
	},

	
	route: function(handle, pathname, response, postData) {
  			response.writeHead(200, {
				    "Content-Type": "application/json",
				    "Expires": "Mon, 26 Jul 1997 05:00:00 GMT",
				    "Cache-Control":"no-cache, must-revalidate"
			});
  			try{
  				if (typeof handle[pathname] === 'function') {
		    		handle[pathname](response, postData);
			  	} else {
			    	throw new exceptions.RPC_NOT_FOUND_DATA();
	  			}
  			}
  			catch(err){
	  			
	  			response.writeHead(404, {
					    "Content-Type": "application/json",
					    "Expires": "Mon, 26 Jul 1997 05:00:00 GMT",
					    "Cache-Control":"no-cache, must-revalidate"
				});
				if ( !(err instanceof exceptions.RPC_INVALID_REQUEST || err instanceof exceptions.RPC_METHOD_NOT_FOUND ||
					err instanceof exceptions.RPC_INVALID_PARAMS || err instanceof exceptions.RPC_CLASS_NOT_FOUND ||
					err instanceof exceptions.RPC_NOT_FOUND_DATA)){
						console.log(err);
						err = new exceptions.RPC_INTERNAL_ERROR
					}
				response.write(JSON.stringify(err));
				response.end();
  			}
  			
	}
};

exports.zoService = zoService;
*/

