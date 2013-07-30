var exceptions = require("../exceptions/zoExceptions");
var u = require("underscore");

(function($){
	var test = function(settings){
		
		settings = settings || {};
		var self = {}
		self.response = {};
		u.extend(self, settings);
		
		
		
		self.aData = function(texto){
			return texto;
		}
		
		self.nFunction = function(a,b,c){
			return 'a is ' + a + ' | b is ' + b + ' | c is ' + c;
		}
		
		self.sData = function(){
			return null;	
		}
		
		return self;
	}
	$.test = test;
}(typeof window === 'undefined' ? exports:window));