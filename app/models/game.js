const Sequelize = require('sequelize');

exports.getModel = db => {
  return db.define(
    'game',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      score: {
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
