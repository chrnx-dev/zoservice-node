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
				getData = self.exec(oRequest);
				if (!u.isUndefined(getData)){
					responses.push(getData);
				}
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
					function(oResponse){
						console.log(oResponse);
						self.httpResponse.write('batch goes well');
						self.httpResponse.end();
					},
					
					/** all goes wrong **/
					function(oResponse){
						console.log(oResponse);
						self.httpResponse.write('batch goes bad');
						self.httpResponse.end();
					}
				);
			} else {
				self.getSingle(self.oRequest).then(
					/** all goes well **/
					function(oResponse){
						console.log(oResponse);
						self.httpResponse.write('single goes well');
						self.httpResponse.end();
					},
					
					/** all goes wrong **/
					function(oResponse){
						console.log(oResponse);
						self.httpResponse.write('single goes bad');
						self.httpResponse.end();
					}
				);
			}
		}
		
		self.exec = function(oRequest){
			var deferred = q.defer();
		
			aMethod = oRequest.method.split('.');
			oMethod = {};
			
			
			if (aMethod.length == 1){
				oMethod.sClass = self.settings.Default_Class;
				oMethod.sMethod = aMethod[0];
			} else {
				oMethod.sClass = aMethod[0];
				oMethod.sMethod = aMethod[1];
			}
			
			Fs.exists(self.settings.actualPath+ self.settings.responses_dir + oMethod.sClass + '.js', function(isExists){
				var $responseClass= null;
				
				
				aMethod = oRequest.method.split('.');
				if (aMethod.length == 1){
					oMethod.sClass = self.settings.Default_Class;
					oMethod.sMethod = aMethod[0];
				} else {
					oMethod.sClass = aMethod[0];
					oMethod.sMethod = aMethod[1];
				}
				
				try{				
					if (!isExists){
						deferred.reject(new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass, id:oRequest.id}));
					}else{
						
						$responseClass = require(self.settings.actualPath+ self.settings.responses_dir + oMethod.sClass);
						
						if (u.isNull($responseClass) || u.isUndefined(oMethod.sClass)) 
							deferred.reject(new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass, id:oRequest.id}));
						
						$responseClass = new $responseClass[oMethod.sClass];
						
					}
					
					if (u.isUndefined($responseClass[oMethod.sMethod])){ 
						deferred.reject(new exceptions.RPC_METHOD_NOT_FOUND({method: oMethod.sMethod, id:oRequest.id}));
						
					}else{
						deferred.resolve($responseClass[oMethod.sMethod](oRequest.params), oRequest);
					}	
					
					
				}catch(err){
					
					deferred.reject(err);
				}
				
			});
			
			return deferred.promise;
		};
		
		return self;
	}
	$.response = response;
}(typeof window === 'undefined' ? exports:window));

