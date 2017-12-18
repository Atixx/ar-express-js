const user = require('./user');
const session = require('./session');

exports.define = db => {
  user.getModel(db);
  session.getModel(db);
};
