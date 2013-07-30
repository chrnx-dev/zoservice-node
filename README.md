zoServices
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

To start using this project just need add _zoServices_ by adding `require('zoService');` to your project.

###Server Options
`Server.port` - Modify the port where server listen the request, by default the value of this options is _3000_.
`Server.defaultClass` - Define the main class when try to response a method, by default the value is _main_.
`Server.responses_dir` - Define where server needs to look for the classes to responses, by default _/responses/_.

To set a config you will need the `set` method and to retrieve a value from server you will need to use 


###Example
```javascript
var server = require('zoService');

/**
 * Create a new Server
 **/
var app = new server.zoservice();

/** Asign to port 3001 **/
app.set('port', 3001);


app.process();
```