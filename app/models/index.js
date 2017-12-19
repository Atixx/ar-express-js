const user = require('./user');
const sessions = require('./session');

exports.define = db => {
  user.getModel(db);
  sessions.getModel(db);
};
