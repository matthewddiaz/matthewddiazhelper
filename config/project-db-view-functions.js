var exports = module.exports = {};
var databaseAccessor = require('./projects-database');

exports.getSortingByCommitView = function(designName, viewName){
  databaseAccessor.db.view(designName, viewName, {descending : true}, function(err, body) {
    if (!err) {
      body.rows.forEach(function(doc) {
        console.log(doc.value);
      });
    }
  });
}
