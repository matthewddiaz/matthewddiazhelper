var databaseViewRetriver = require('../config/project-db-view-functions');
var databaseRefresher = require('../project_updater/project-refresher');

var express = require('express');
var router = express.Router();

router.get('/allDocsSortedByCommit', function(req, res){
  databaseViewRetriver.getSortingByCommitView('returnOrderList', 'orderedProjects')
    .then(function(result){
      res.send(result);
    }).catch(function(err){
      res.send(err);
    });
});

router.post('/refreshProjects', function(req, res){
  databaseRefresher.refreshProjects();
});

module.exports = router;
