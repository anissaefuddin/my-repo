
const Datastore = require('@google-cloud/datastore');

// For explicit authentication using key file... (e.g. running it locally)
//       const ds = new Datastore({keyFilename: keyFilename});
// For implicit authentication (e.g. running this code from Google AppEngine)
//       const ds = new Datastore();

var keyFilename = process.env.CREDS;
var keyObj = {};

if (keyFilename) {
  keyObj = {keyFilename: keyFilename};
};

const ds = new Datastore(keyObj);
const gs = require('gstore-node')();
gs.promise = global.Promise;
gs.connect(ds);

module.exports = {gs};
