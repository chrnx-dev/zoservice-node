zoServices [![Build Status](https://travis-ci.org/zerooneit/zoservice-node.png?branch=master)](https://travis-ci.org/zerooneit/zoservice-node)
=============
This Project is as implementation for [JSON RPC v2.0 Spec](http://www.jsonrpc.org/specification) written in Javascript for [node.js](http://nodejs.org/), this helps for implements and usage methods that is in another server, system, programming languages or platform.
This is Helpful for  transport data without implements  modules or program in other languages.

##Install
Install the latest version of _zoServices_ by executing `npm install zoservices` in you shell.

##Changelog

1.0.0
-  Add promises to the project.
-  Adding named variables for response.
-  Fix Result as a correct form JSON RPC object.
-  Fix Error as a correct form JSON RPC object.
-  Multiple Server can be created at the same time.
-  Servers can share the same response classes.


##Usage

To start using this project just need add _zoServices_ by adding `require('zoservices');` to your project.

###Server Options
`Server.port` - Modify the port where server listen the request, by default the value of this options is _3000_.
`Server.defaultClass` - Define the main class when try to response a method, by default the value is _main_.
`Server.responses_dir` - Define where server needs to look for the classes to responses, by default _/responses/_.

To set a config you will need the `set` method and to retrieve a value from server you will need to use `get`.

###Response Classes
To start using Response classes you must create `main` class into the `responses` folder that you defined or the default settings.

####Example of main class
```javascript
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
```
With this class server can response to the methods `helloWorld` and `paramMethod` and have a notification method `doNotification`.

###Making a Request
To make a request to the server is using the `POST` method and sending well formed JSON string that contains the next value
```javascript
/** Single Request **/
{
  "id":<numeric|md5|timestamp>,
  "method":"<methodName | className.methodName>",
  "jsonrpc":"2.0",
  "params":<[arg1, arg2.. argn] | {"argName1": argValue1, ... "argNamen":argValuen}>
}

/** Batch Request **/
[
{
  "id":<numeric|md5|timestamp>,
  "method":"<methodName | className.methodName>",
  "jsonrpc":"2.0",
  "params":<[arg1, arg2.. argn] | {"argName1": argValue1, ... "argNamen":argValuen}>
}, {..request..},..
]
```
* `id` - This is the unique identification for request.
* `method` - This is the method that it will call remotely you can use `methodName` to call the main class methods
           you can use this `className.methodName` to call a method from another defined class.
* `jsonrpc` - this is the version of the protocol for the moment it just valid for jsonrpc 2.0 spec.
* `params` - you can use an array of parameters or using a object with 'key:value' to assign a parameter.

### Notification
In [JSON RPC v2.0 Spec](http://www.jsonrpc.org/specification) notification won't response anything to clients,
_zoServices_ will response with a empty response to indicates to client that server finish the request and is ready
for another one.


###Create a sigle server
```javascript
var server = require('zoservices');

/**
 * Create a new Server
 **/
var app = new server.zoservice();

/** Asign to port 3001 **/
app.set('port', 3001);

/** Start server **/
app.process();
```

### Create Multiple Server with share classes.
```javascript
var server = require('zoService');

/**
 * Create a new Server
 **/
var Server1 = new server.zoservice();
var Server2 = new server.zoservice();
var Server3 = new server.zoservice();

/** This server share the same default response folder **/
Server1.process(3000);
Server2.process(3001);


/** This server doesn't use the same classes **/
Server3.set('responses_dir','/responses2/');
Server3.process(3002);

```
