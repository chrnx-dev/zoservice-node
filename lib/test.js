var server = require('./zoService');

var app = new server.zoservice();

app.set('port', 3001);
app.set('debug',true);

app.process();

