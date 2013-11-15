var server = new require('./zoServices');

var Server = new server;
Server.set('debug',false);
Server.process(3000);
