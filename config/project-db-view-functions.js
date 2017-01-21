var exports = module.exports = {};
var databaseAccessor = require('./projects-database');

/**
 * [function description]
 * @param  {[type]} designName [description]
 * @param  {[type]} viewName   [description]
 * @return {[type]}            [description]
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
