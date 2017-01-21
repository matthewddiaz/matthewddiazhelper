/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var databaseRefresher = require('./project_updater/project-refresher');
var projectDataRoute = require('./routes/data');

/**
 * [refreshProjects description]
 * @return {[type]} [description]
 */
databaseRefresher.refreshProjects()
  .then(function(result){
    console.log(result);
  }).catch(function(error){
    console.log(error);
  });

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use('/data', projectDataRoute);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
