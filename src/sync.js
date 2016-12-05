var constants = require('redux-persist/constants');
var keyPrefix = constants.KEY_PREFIX;
var isEqual = require('lodash/lang/isEqual');

function sync(persistor, config){
  if (config === undefined) config = {};
  var blacklist = config.blacklist || false;
  var whitelist = config.whitelist || false;
  var storage = config.storage || throw new Error('missing "storage" property in config parameter');

  chrome.storage.onChanged.addListener(handleStorageEvent);

  function handleStorageEvent(e){
    var key = Object.keys(e)[0];
    if(key && key.indexOf(keyPrefix) === 0 && (!storage._lastData || !isEqual(e[key].newValue, storage._lastData))){
      var keyspace = key.substr(keyPrefix.length);
      if(whitelist && whitelist.indexOf(keyspace) === -1){ return }
      if(blacklist && blacklist.indexOf(keyspace) !== -1){ return }

      persistor.rehydrate({ [keyspace]: e[key].newValue })
    }
  }
}

module.exports = sync;
