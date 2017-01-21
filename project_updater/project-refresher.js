var exports = module.exports = {};

var request = require('request-promise');
var databaseAccessor = require('../config/projects-database');
var githubAuthentication = require('../config/github-credentials').credentials;
var utils = require('../utils/utils');

function checkObjectType(object){
  return Object.prototype.toString.call(object);
};

/**
 * [function description]
 * @param  {[type]} entireRepoArray [description]
 * @return {[type]}                 [description]
 */
exports.acquireDesiredProjects = function(entireRepoArray){
  return new Promise(function(resolve, reject){
    databaseAccessor.getAllDocuments(function(err, response){
      if(err){
        console.log(err);
      }
      databaseProjectsArray = response.rows;

      var updatedProjectsArray = [];
      databaseProjectsArray.forEach(function(project){
        //NOTE: only use projectDoc and only add ProjectDoc to be updated
        var projectDoc = project.doc;

        var lastCommitAttribute = 'lastCommit';
        var addedLastCommitAttribute = false;

        if(!projectDoc.hasOwnProperty(lastCommitAttribute)){
          projectDoc[lastCommitAttribute] = new Date(1995, 1, 11);
          addedLastCommitAttribute = true;
        }

        var projectUrl = projectDoc.projectUrl;

        var repoProject = entireRepoArray.find(function(repoProject){
          return (projectUrl === repoProject.html_url);
        });
        //check that there is a repository for the database project
        if(repoProject == undefined){
          if(addedLastCommitAttribute){
            updatedProjectsArray.push(projectDoc);
          }
          return;
        }

        //get last time commit
        var projectLastCommit = projectDoc.lastCommit;
        var repoLastCommit = repoProject.pushed_at;
        //check if conversion of String to Date is necessary for time stamps variable
        if(checkObjectType(repoLastCommit) == '[object String]'){
          repoLastCommit = new Date(repoLastCommit);
        }
        if(checkObjectType(projectLastCommit) == '[object String]'){
          projectLastCommit = new Date(projectLastCommit);
        }

        //if project has been updated in github update timeStamp for database project
        //& add the database project to updatedProjectsArray
        if(repoLastCommit > projectLastCommit){
          projectDoc.lastCommit = repoLastCommit;
          updatedProjectsArray.push(projectDoc);
          return;
        }
      });

      resolve(updatedProjectsArray);
    });
  });
}

/**
* This method creates a Promise and sends a http request to the desired
* url and returns the Promise.
* @param  {String} [urlRequest [http url to where the request object is sent to]
* @return {Promise}            [a Promise that if fulfilled returns
*                                       	an [object Array] with a list of repos.
*                                       	If rejected an error occured.]
*/
exports.acquireGithubProjects = function(urlRequest){
    var githubUserName = githubAuthentication.username;
    var githubPassword = githubAuthentication.password;

    var requestObject = {
      url:  urlRequest,
      headers: {
        'User-Agent': githubUserName
      },
      'auth' :{
        'user' : githubUserName,
        'pass' : githubPassword
      },
      options: {
        'content-type' : 'application/json'
      }
    };
    return utils.makeHttpRequest(requestObject);
};

exports.refreshProjects = function(){
  this.acquireGithubProjects(githubAuthentication.url)
  .then(function(reposArr){
    if(checkObjectType(reposArr) === '[object String]'){
      reposArr = JSON.parse(reposArr);
    }
    return reposArr;
   })
  .then(this.acquireDesiredProjects)
  .then(function(listOfUpdatingProjects){
    databaseAccessor.bulkUpdateDocuments(listOfUpdatingProjects);
  })
  .catch(function(error) {
    console.log("Failed!", error);
  });
};
