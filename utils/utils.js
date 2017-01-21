var exports = module.exports = {};
var request = require('request-promise');

/**
 * A util function that returns a Promise trying to
 * send a request to a url in the requestObject
 * @param  {JSON} requestOption contains information of request
 *                              such as url and type of request aka: POST, GET..
 * @return {Promise}
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
