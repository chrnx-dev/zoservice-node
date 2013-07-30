u  = require("underscore");
(function($){
	var main = function(settings){
		
		settings = settings || {};
		var self = {}
		self.response = {};
		u.extend(self, settings);
		
		
		
		self.helloWorld = function(){
			return 'Hello World!!';
		}
		
		self.doNotification = function(){
			console.log('user do a notification');
		}
		
		self.paramMethod = function (a,b,c){
			return 'a is ' + a + ' | b is ' + b + ' | c is ' + c;
		}
		return self;
	}
	$.main = main;
}(typeof window === 'undefined' ? exports:window));
