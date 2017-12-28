const user = require('./user');
const sessions = require('./session');
const game = require('./game');

exports.define = db => {
  user.getModel(db);
  sessions.getModel(db);
  game.getModel(db);
};
