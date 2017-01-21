var exports = module.exports = {};
var databaseAccessor = require('./projects-database');

exports.getSortingByCommitView = function(designName, viewName){
  return new Promise(function(resolve, reject){
    databaseAccessor.db.view(designName, viewName, {descending : true}, function(err, body) {
      if(err){
        reject(err);
      }
      resolve(body.rows);
    });
  });
}
