var server = new require('./zoServices');

var Server = new server;
Server.set('debug',true);
Server.process(3000);
