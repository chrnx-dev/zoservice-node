/**
 * @author Diego Resendez <diego.resendez@zero-oneit.com>
 */
var exceptions = require("../exceptions/zoExceptions")
	,	u  = require("underscore")
	,	q  = require("q") 
	,	Fs = require('fs');

(function ($){
	var response = function( oRequest,httpRequest, httpResponse, settings){
		
		var self = {};
		
		self.hasError = false;
		self.response = [];

		self.httpRequest = httpRequest || {};
		self.httpResponse = httpResponse || {};
		self.oRequest = oRequest || {};
		self.settings = settings || {};
		
		if (u.isArray(self.oRequest)){
			self.isBatch = true;
		}
		
		self.checkRequest = function(oRequest){
			if 	( typeof(oRequest) != 'object' || (oRequest.jsonrpc == undefined) ||
		    	(oRequest.jsonrpc !== self.settings.JSON_RPC) || (oRequest.method == undefined) ||
		    	(typeof(oRequest.method) != 'string') ||  (oRequest.params == undefined) || 
		    	!(oRequest.params instanceof Array)  || (oRequest.id == undefined) )
		    	 
				return false;
		
			if ( oRequest.params == null )
				oRequest.params = [];
		
			return true;
		};
		
		self.getBatch = function(oRequests){
			var responses = [];
			oRequests.forEach(function(oRequest){
				responses.push(self.exec(oRequest));
			});
			return q.all(responses);
		};
		
		self.getSingle = function(oRequest){
			return self.exec(oRequest);
		};
		
		self.getResponse = function(){
			if (self.isBatch){
				self.getBatch(self.oRequest).then(
					/** all goes well **/
					function(oResponses){
						fResponses =u.filter(oResponses, function(oResponse){
							if (!u.isUndefined(oResponse.result) || !u.isUndefined(oResponse.error)) return oResponse;
						});
						
						if (u.size(fResponses) > 0){
							self.httpResponse.write(JSON.stringify(fResponses));
						}else{
							self.httpResponse.write(' ');
						}	
						self.httpResponse.end();
					}
				);
			} else {
				self.getSingle(self.oRequest).then(
					/** all goes well **/
					function(oResponse){
						console.log(oResponse);
						if (!u.isUndefined(oResponse.result) || !u.isUndefined(oResponse.error) ){
							self.httpResponse.write(JSON.stringify(oResponse));
						}else{
							self.httpResponse.write('');
						}
						
						self.httpResponse.end();
					}
				);
			}
		}
		
		self.namedCall = (function() {
		    var pattern = /function[^(]*\(([^)]*)\)/;
		
		    return function(func) {
		        var args = func.toString().match(pattern)[1].split(/,\s*/);
		
		        return function() {
		            var named_params = arguments[arguments.length - 1];
		            if (typeof named_params === 'object') {
		                var params = [].slice.call(arguments, 0, -1);
		                if (params.length < args.length) {
		                    for (var i = params.length, l = args.length; i < l; i++) {
		                        params.push(named_params[args[i]]);
		                    }
		                    return func.apply(null, params);
		                }
		            }
		            return func.apply(null, arguments);
		        };
		    };
		}());
		
		self.exec = function(oRequest){
			var deferred = q.defer();
			
			var aMethod = oRequest.method.split('.');
			var oMethod = {};
								
			if (aMethod.length == 1){
				oMethod.sClass = self.settings.defaultClass;
				oMethod.sMethod = aMethod[0];
			} else {
				oMethod.sClass = aMethod[0];
				oMethod.sMethod = aMethod[1];
			}
			
			if (self.settings.debug){
					console.log(self.settings.actualPath+ self.settings.responses_dir + oMethod.sClass + '.js');
			}
			
			Fs.exists(self.settings.actualPath+ self.settings.responses_dir + oMethod.sClass + '.js', function(isExists){
				var $responseClass= null;
										
				try{				
					if (!isExists){
						self.hasError = true;
						deferred.resolve(new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass, id:oRequest.id}));
					}else{
						
						$responseClass = require(self.settings.actualPath+ self.settings.responses_dir + oMethod.sClass);
						
						
						if (u.isNull($responseClass) || u.isUndefined(oMethod.sClass)){ 
							self.hasError = true;
							deferred.resolve(new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass, id:oRequest.id}));
						}	
						
						$responseClass = new $responseClass[oMethod.sClass];
						
					}
					
					if (u.isUndefined($responseClass[oMethod.sMethod]) || !u.isFunction($responseClass[oMethod.sMethod]) ){ 
						self.hasError = true;
						deferred.resolve(new exceptions.RPC_METHOD_NOT_FOUND({method: oMethod.sMethod, id:oRequest.id}));
						
					}else{
						if ( u.isArray(oRequest.params) ){
							var fResponse =  $responseClass[oMethod.sMethod].apply(self,oRequest.params);
						} else{
							nResponse = self.namedCall($responseClass[oMethod.sMethod]);
							var fResponse = nResponse(oRequest.params);
						}
						var oResponse =  u.omit(oRequest, ['method','params']);
						u.extend(oResponse, {result: fResponse});
						
						deferred.resolve( oResponse , oRequest);
					}	
					
					
				}catch(err){
					self.hasError = true;
					if (self.settings.debug){
							console.log(err);
						}
					deferred.resolve(new exceptions.RPC_INTERNAL_ERROR({method: oMethod.sMethod, id:oRequest.id}));
				}
				
			});
			
			return deferred.promise;
		};
		
		return self;
	}
	$.response = response;
}(typeof window === 'undefined' ? exports:window));

