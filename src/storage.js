function createStorage(storage) {
  storage._lastData = null; // Deal with Chrome issue https://code.google.com/p/chromium/issues/detail?id=361113

  storage.getItem = (key, callback) => {
    storage.get(key, obj => {
      if (obj[key]) callback(null, obj[key]);
      else callback(chrome.runtime.lastError, null);
    });
  };

  storage.setItem = (key, value, callback) => {
    let obj = {};
    obj[key] = value;
    storage.set(obj, () => {
      if (chrome.runtime.lastError) callback(key);
    });
    storage._lastData = value;
  };

  storage.removeItem = storage.remove;

  storage.getAllKeys = callback => {
    storage.get(null, obj => {
      callback(null, Object.keys(obj));
    });
  };
}

export const localStorage = createStorage(chrome.storage.local);
export const syncStorage = createStorage(chrome.storage.sync);
export default localStorage;
