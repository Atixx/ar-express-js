const user = require('./user');
const sessions = require('./session');
const game = require('./game');
const match = require('./match');

exports.define = db => {
  user.getModel(db);
  sessions.getModel(db);
  game.getModel(db);
  match.getModel(db);
};
