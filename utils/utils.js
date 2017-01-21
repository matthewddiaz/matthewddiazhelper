var exports = module.exports = {};
var request = require('request-promise');

/**
 * [function description]
 * @param  {[type]} requestOption [description]
 * @return {[type]}               [description]
 */
exports.makeHttpRequest = function(requestOption){
  return new Promise(function(resolve, reject){
    request(requestOption)
      .then(function(response){
        resolve(response);
      }).catch(function(error){
        reject(error);
      });
  });
}
