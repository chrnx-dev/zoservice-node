if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['http', 'url', 'underscore','./exceptions/zoExceptions','./classes/zoConfig', './classes/zoResponses'],
function(http, url, _, exceptions, zoConfig, zoResponse){
	return function(settings){

		settings = settings || {};
		var self = {};

		self.settings = new zoConfig.config();
		_.extend(self.settings, settings);

		self.oRequest = {};
		self.server = {};
		self.fromPOST = false;

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

			if ( _.isUndefined(self.settings[setting]) ){
				return false;
			}

			return self.settings[setting];

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
				if (self.fromPOST){
					res.writeHead(200, {"Content-Type": "application/json"});
					responser = new zoResponse.response(self.oRequest, self.httpRequest, self.httpResponse, self.settings);
	    		responser.getResponse();
	    	} else {
	    		res.writeHead(404, {"Content-Type": "text/html"});
	    		res.write('This Methond is not allowed');
	    		res.end();
	    	}


			});
		};

		self.getRequest = function(rawPost){

			try{
				self.oRequest = JSON.parse(rawPost);
				self.fromPOST = true;
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

});


