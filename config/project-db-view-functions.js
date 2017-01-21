var exports = module.exports = {};
var databaseAccessor = require('./projects-database');

/**
 * function returns a Promise and tries to accomplish sorting by the given
 * designName and viewName.
 * NOTE: look up Views in Couchdb for more info on them.
 * NOTE: The View is sorted in projects db
 * @param  {designName} designName
 * @param  {viewName} viewName
 * @return {Promise}  that will either reject or filfill the sorting task
 */
exports.getSortingByCommitView = function(designName, viewName){
  return new Promise(function(resolve, reject){
    databaseAccessor.db.view(designName, viewName, {descending : true}, function(err, body) {
      if (err) {
        reject(err);
      }
      resolve(body.rows);
    });
  });
}
