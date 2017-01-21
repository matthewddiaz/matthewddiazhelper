var databaseViewRetriver = require('../config/project-db-view-functions');
var databaseRefresher = require('../project_updater/project-refresher');

var express = require('express');
var router = express.Router();

/**
* [get description]
* @param  {[type]} '/allDocsSortedByCommit' [description]
* @param  {[type]} function(req,            res           [description]
* @return {[type]}                          [description]
*/
router.get('/allDocsSortedByCommit', function(req, res){
  databaseViewRetriver.getSortingByCommitView('returnOrderList', 'orderedProjects')
  .then(function(result){
    res.send(result);
  }).catch(function(error){
    res.send(error);
  });
});

/**
* [post description]
* @param  {[type]} '/refreshProjects' [description]
* @param  {[type]} function(req,      res           [description]
* @return {[type]}                    [description]
*/
router.post('/refreshProjects', function(req, res){
  databaseRefresher.refreshProjects()
  .then(function(result){
    res.send(result);
  }).catch(function(error){
    res.send(error);
  });
});

module.exports = router;
