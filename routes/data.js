var express = require('express');
var databaseViewRetriver = require('../config/project-db-view-functions');
var databaseRefresher = require('../project_updater/project-refresher');
var githubAuthentication = require('../config/github-credentials').credentials;
var utils = require('../utils/utils');
//NOTE: for more information on Routing visit https://expressjs.com/en/guide/routing.html
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
 * Route to get the last commit of a Project on Github
 * @param  {route} '/getProjectLastCommit'
 * @param  {callback}
 * NOTE: in the request the user has to include a valid githubUserName and repoName
 * @return {String} last commit of project
 */
router.get('/getProjectLastCommit/:githubUserName/:repoName', function(req, res){
  var reqParameters = req.params;
  var githubUserName = reqParameters.githubUserName;
  var repoName = reqParameters.repoName;
  if(githubUserName != null && repoName != null){
    var requestUrl = githubAuthentication.githubUrl + githubAuthentication.getDoc
          + '/' + githubUserName + '/' + repoName;
    var requestObject = {
      url:  requestUrl,
      headers: {
        'User-Agent': githubUserName
      },
      options: {
        'content-type' : 'application/json'
      }
    };
    utils.makeHttpRequest(requestObject)
          .then(function(repo){
            if(utils.checkObjectType(repo) == '[object String]'){
              repo = JSON.parse(repo);
            }
            res.send(repo.pushed_at);
          }).catch(function(error){
            res.send(error);
          });
  }else{
      res.send(new Error("Please send a request with a git username and repo name"));
  }
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
