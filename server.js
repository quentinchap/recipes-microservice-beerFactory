var express = require('express');
var app = express();
const routes = require('./routes');

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.use('/', routes);

  var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});