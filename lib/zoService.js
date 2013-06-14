var http = require("http")
	,	url = require("url")
	,	u = require("underscore")
	,	exceptions = require("./exceptions/zoExceptions")
	,	zoConfig = require('./classes/zoConfig')
	,	response = require("./classes/zoServer");
	

/*var handle = {};
handle["/"] = requestHandlers.home;
handle["/index"] = requestHandlers.home;*/

(function ($){
	var zoservice = function(settings){
		
		settings = settings || {};
		var self = {};
		
		self.settings = new zoConfig.config();
		u.extend(self.settings, settings);
		
		self.sRequest = '';
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
			req.setEncoding("utf8");
			
			req.addListener("data",self.getRequest);
			req.addListener("end", function() {
				
    			var oRequest = {};
    
				try{
					oRequest = JSON.parse(self.sRequest);
				}catch (ExceptionRequest){
					res.writeHead(404, {"Content-Type": "application/json"});
					res.write(JSON.stringify(ExceptionRequest));
					res.end();
				}
				
				res.writeHead(200, {"Content-Type": "application/json"});
				res.write(JSON.stringify(oRequest));
				res.end();
				
			});
		};
		
		self.getRequest = function(rawPost){
			self.sRequest = rawPost;
			if (self.settings.debug){
				console.log("Received POST data chunk '"+
					rawPost + "'.");
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

