const Sequelize = require('sequelize');

exports.getModel = db => {
  return db.define(
    'match',
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hits: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true
    }
  );
};
