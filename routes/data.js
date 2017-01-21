var databaseViewRetriver = require('../config/project-db-view-functions');
var databaseRefresher = require('../project_updater/project-refresher');

var express = require('express');
var router = express.Router();

/**
* Route to get all docs sorted by lasted commit in descending order.
* @param  {route} '/allDocsSortedByCommit'
* @param  {callback}
* @return {res} sends either the result if getSortingByCommitView was filfilled
*               or sends an error if the Promise was rejected.
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
* Route to refresh projects that need to be updated in projects database
* @param  {route} '/refreshProjects'
* @param  {callback}
* @return {res} sends either the result if refreshProjects was filfilled
*               or sends an error if the Promise was rejected.
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
