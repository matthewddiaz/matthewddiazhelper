var exports = module.exports = {};

var request = require('request-promise');
var databaseAccessor = require('../config/projects-database');
var githubAuthentication = require('../config/github-credentials').credentials;
var utils = require('../utils/utils');

/**
 * This method checks to see if there have been any commits to the projects
 * in the database; if any project is out of state it's date gets updated.
 * @param  {Array} entireRepoArray array of all the repos listed on github
 * @return {Array} list of projects that need to be updated in projects database
 */
exports.acquireDesiredProjects = function(entireRepoArray){
  return new Promise(function(resolve, reject){
    databaseAccessor.getAllDocuments(function(err, response){
      if(err){
        reject(err);
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
        if(utils.checkObjectType(repoLastCommit) == '[object String]'){
          repoLastCommit = new Date(repoLastCommit);
        }
        if(utils.checkObjectType(projectLastCommit) == '[object String]'){
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

/**
 * this method checks if input reposArr is of type String; if it is
 * convert the String to an Array and return it.
 * @param  {Object} reposArr [an object that may be a String or Array]
 * @return {Array}          [the input object is returned as an Array]
 */
function getRepoInArrayType(reposArr){
  if(utils.checkObjectType(reposArr) === '[object String]'){
    reposArr = JSON.parse(reposArr);
  }
  return reposArr;
};

/**
 * This method executes a chain of Promises to first obtain the projects
 * that need to be updated and then actually update them in the database.
 * @return {Promise} this last promise will either resolve or reject.
 *                   NOTE: This promise will reject if any of the above chained
 *                   promises was rejected.
 */
exports.refreshProjects = function(){
  var gitRequestURL = githubAuthentication.githubUrl + githubAuthentication.getAllDocs;
  console.log("The url is " + gitRequestURL);
  return this.acquireGithubProjects(gitRequestURL)
  .then(getRepoInArrayType)
  .then(this.acquireDesiredProjects)
  .then(databaseAccessor.bulkUpdateDocuments);
};
